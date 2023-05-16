import { Link } from '@sprucelabs/spruce-core-schemas'
import { eventFaker, fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert, generateId } from '@sprucelabs/test-utils'
import { Appointment, DidBookAppointment } from '../../../checkin.types'
import BookedAppointmentHandler from '../../../respondingToBookEvents/BookedAppointmentHandler'
import TrackedAppointmentsStore from '../../../respondingToBookEvents/TrackedAppointments.store'
import AbstractCheckinTest from '../../support/AbstractCheckinTest'
import {
	GenerateUrlTargetAndPayload,
	GetAppointmentTargetAndPayload,
	SendMessageTargetAndPayload,
} from '../../support/EventFaker'

@fake.login()
export default class BookedAppointmentHandlerTest extends AbstractCheckinTest {
	private static handler: BookedAppointmentHandler
	private static tracker: TrackedAppointmentsStore
	private static sentMessages: SendMessageTargetAndPayload[] = []
	private static locationId: string
	private static appointment: Appointment

	protected static async beforeEach(): Promise<void> {
		await super.beforeEach()

		BookedAppointmentHandler.debounceDurationMs = 0

		await this.eventFaker.fakeSendMessage((targetAndPayload) => {
			this.sentMessages.push(targetAndPayload)
		})

		this.locationId = generateId()

		this.appointment = this.eventFaker.generateListAppointmentValues({
			locationId: this.locationId,
			organizationId: generateId(),
		})

		await this.eventFaker.fakeGetAppointment(() => this.appointment)
		await this.eventFaker.fakeGenerateUrl()

		this.tracker = await this.stores.getStore('trackedAppointments')
		this.handler = await BookedAppointmentHandler.Handler({
			stores: this.stores,
			client: this.fakedClient,
		})
		this.resetSentMessages()
	}

	@test()
	protected static async throwsWithMissingRequired() {
		const err = await assert.doesThrowAsync(() =>
			//@ts-ignore
			BookedAppointmentHandler.Handler()
		)
		errorAssert.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['stores', 'client'],
		})
	}

	@test('saves handled appointment to local store 1', [])
	@test('saves handled appointment to local store 2', ['aoeu'])
	protected static async savesHandledAppointmentToLocalStore(
		statuses: string[]
	) {
		const appointment = await this.handle(statuses)
		await this.wait(20)

		const tracked = await this.tracker.findOne({
			id: appointment.id,
		})

		assert.isTruthy(tracked)
		assert.isEqualDeep(tracked.statuses, appointment.statuses)
	}

	@test('sends if status is only checked-in', ['checked-in'])
	@test('sends if status is checked-in and other', ['other', 'checked-in'])
	protected static async ifStatusChangesToCheckedInSendACheckinMessage(
		statuses: string[]
	) {
		const appt = await this.handle([])
		this.assertTotalMessagesSent(0)
		await this.handle(statuses, appt.id)
		this.assertTotalMessagesSent(1)
	}

	@test()
	protected static async doesNotSendIfStatusDoesNotContainCheckedIn() {
		const appt = await this.handle([])
		await this.handle([], appt.id)
		this.assertTotalMessagesSent(0)
	}

	@test()
	protected static async doesNotSendIfAppointmentAlreadyHadCheckedIn() {
		const appt = await this.handle(['checked-in'])
		this.assertTotalMessagesSent(1)
		await this.handle(['checked-in'], appt.id)
		this.assertTotalMessagesSent(1)
	}

	@test()
	protected static async multipleUpdatesToCheckedInOnlySendsOnce() {
		const appt = await this.handleCheckedIn()
		await this.handle(['checked-in'], appt.id)
		await this.handle(['checked-in'], appt.id)
		this.assertTotalMessagesSent(1)
	}

	@test()
	protected static async canTellAppointmentsApart() {
		const appt1 = await this.handle([])
		const appt2 = await this.handle([])
		await this.handle(['checked-in'], appt1.id)
		await this.handle(['checked-in'], appt2.id)
		this.assertTotalMessagesSent(2)
	}

	@test()
	protected static async loadsFullAppointment() {
		let passedTarget: GetAppointmentTargetAndPayload['target'] | undefined
		await this.eventFaker.fakeGetAppointment(({ target }) => {
			passedTarget = target
		})

		const appt = await this.handleCheckedIn()

		assert.isEqualDeep(passedTarget, {
			locationId: appt.target.locationId,
			appointmentId: appt.id,
		})
	}

	@test()
	protected static async generatesLinkForMessage() {
		let passedTarget: GenerateUrlTargetAndPayload['target'] | undefined
		let passedPayload: GenerateUrlTargetAndPayload['payload'] | undefined

		await this.eventFaker.fakeGenerateUrl(({ target, payload }) => {
			passedTarget = target
			passedPayload = payload
		})

		await this.handleCheckedIn()

		assert.isEqualDeep(passedTarget, {
			skillViewId: 'feed.root' as any,
		})

		assert.isEqualDeep(passedPayload, {
			args: {
				scopedLocationId: this.appointment.target.locationId,
				personId: this.appointment.target.guestId!,
			},
		})
	}

	@test()
	protected static async dropsLinkIntoMessage() {
		const url = generateId()

		let passedLinks: Link[] | undefined | null

		await this.eventFaker.fakeGenerateUrl(() => url)

		await this.eventFaker.fakeSendMessage(({ payload }) => {
			passedLinks = payload.message.links
		})

		await this.handleCheckedIn()

		assert.isEqualDeep(passedLinks, [
			{
				label: `${this.fakedPerson.casualName}'s Feed`,
				uri: url,
			},
		])
	}

	@test()
	protected static async getPersonShouldHaveLocationIdInTarget() {
		let passedLocationId: string | undefined | null

		await this.eventFaker.fakeGetPerson(({ target }) => {
			passedLocationId = target?.locationId
		})

		await this.handleCheckedIn()

		assert.isEqual(passedLocationId, this.locationId)
	}

	@test()
	protected static async onlySinceOnceWhenUpdatingFast() {
		const appt = await this.handle([])
		this.resetSentMessages()
		await Promise.all([this.checkin(appt.id), this.checkin(appt.id)])
		this.assertTotalMessagesSent(1)
	}

	@test()
	protected static async eventsFailingDoesNotCrashSkill() {
		await eventFaker.makeEventThrow('get-person::v2020_12_25')
		await this.handleCheckedIn()
		await this.wait(100)
	}

	private static async handleCheckedIn() {
		const appt = await this.handle([])
		await this.checkin(appt.id)
		return appt
	}

	private static resetSentMessages() {
		this.sentMessages = []
	}

	private static async checkin(id: string) {
		await this.handle(['checked-in'], id)
	}

	private static assertTotalMessagesSent(expected: number) {
		assert.isLength(this.sentMessages, expected)
	}

	private static async handle(statuses: string[], appointmentId?: string) {
		const appointment: DidBookAppointment = {
			id: appointmentId ?? generateId(),
			target: {
				locationId: this.locationId,
			},
			statuses,
		}

		await this.handler.handle(appointment)
		await this.wait(10)
		return appointment
	}
}
