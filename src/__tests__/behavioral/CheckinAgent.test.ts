import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import { ListAppointment } from '../../checkin.types'
import CheckinAgent from '../../CheckinAgent'
import AbstractCheckinTest from '../support/AbstractCheckinTest'
import {
	GetPersonTargetAndPayload,
	ListAppointmentsTargetAndPayload,
	UpdateAppointmentTargetAndPayload,
} from '../support/EventFaker'

@fake.login()
export default class CheckinAgentTest extends AbstractCheckinTest {
	private static agent: CheckinAgent
	private static fakedAppointment: ListAppointment

	@seed('locations', 1)
	protected static async beforeEach(): Promise<void> {
		await super.beforeEach()

		CheckinAgent.reset()

		this.agent = CheckinAgent.Agent({
			client: this.fakedClient,
		})

		await this.eventFaker.fakeGetPerson()

		this.fakedAppointment = this.generateAppointmentValues()
		await this.eventFaker.fakeListAppointments(() => {
			return [this.fakedAppointment]
		})
		await this.eventFaker.fakeUpdateAppointment()
	}

	@test()
	protected static async throwsWithMissing() {
		//@ts-ignore
		const err = assert.doesThrow(() => CheckinAgent.Agent())
		errorAssert.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['client'],
		})
	}

	@test('gets person by phone 1', '555-555-5555')
	@test('gets person by phone 2', '555-555-1111')
	protected static async getsPersonByPhone(phone: string) {
		let passedTarget: GetPersonTargetAndPayload['target'] | undefined

		await this.eventFaker.fakeGetPerson(({ target }) => {
			passedTarget = target
		})

		await this.checkin(phone)

		assert.isEqualDeep(passedTarget, {
			locationId: this.locationIds[0],
			phone,
		})
	}

	@test()
	protected static async getsUpcomingAppointmentForPerson() {
		let passedTarget: ListAppointmentsTargetAndPayload['target'] | undefined
		let passedPayload: ListAppointmentsTargetAndPayload['payload'] | undefined

		await this.eventFaker.fakeListAppointments(({ target, payload }) => {
			passedTarget = target
			passedPayload = payload
			return [
				{
					...this.generateAppointmentValues(),
				},
			]
		})

		await this.checkin()

		assert.isEqualDeep(passedTarget, {
			locationId: this.locationIds[0],
			guestId: this.fakedPerson.id,
		})

		this.support.assertUpcomingAppointmentstPayloadRangeIsGood(passedPayload)
	}

	@test()
	protected static async noUpcomingAppointmentsThrows() {
		await this.eventFaker.fakeListAppointments(() => [])

		const err = await assert.doesThrowAsync(() => this.checkin())
		errorAssert.assertError(err, 'NO_UPCOMING_APPOINTMENTS')
	}

	@test('updates no status to checked in', [])
	@test('adds checked in to statuses already set', ['waka-waka'])
	@test('does not double add checked-in', ['checked-in'])
	protected static async updatesTheAppointmentStatusToCheckedIn(
		startingStatuses: string[]
	) {
		let passedTarget: UpdateAppointmentTargetAndPayload['target'] | undefined
		let passedPayload: UpdateAppointmentTargetAndPayload['payload'] | undefined

		await this.eventFaker.fakeUpdateAppointment(({ target, payload }) => {
			passedPayload = payload
			passedTarget = target
		})

		this.fakedAppointment.statuses = startingStatuses
		await this.checkin()

		assert.isEqualDeep(passedTarget, {
			appointmentId: this.fakedAppointment.id,
			locationId: this.locationIds[0],
		})

		const expected = [...startingStatuses, 'checked-in']
		assert.isEqualDeep(passedPayload, {
			statuses: [...new Set(expected)],
		})
	}

	@test()
	protected static async isUsedInTheCheckinHandlerInContext() {
		CheckinAgent.Class = SpyCheckinAgent

		const { skill } = await this.bootSkill()
		const { checkin } = skill.getContext()
		const options = {
			locationId: this.locationIds[0],
			phone: '555-555-5555',
		}
		await checkin(options)

		assert.isEqualDeep(SpyCheckinAgent.lastCheckin, {
			...options,
		})
	}

	@test()
	protected static async returnsProviderNameBack() {
		const providerName = await this.bootSkillAndCheckin()

		assert.isEqual(
			providerName,
			this.fakedAppointment.services[0].providerCasualName
		)
	}

	private static async bootSkillAndCheckin() {
		const { skill } = await this.bootSkill()
		const { checkin } = skill.getContext()
		const providerName = await checkin({
			locationId: this.locationIds[0],
			phone: '555-555-5555',
		})
		return providerName
	}

	private static async checkin(phone = '555-555-5555') {
		await this.agent.checkin(this.locationIds[0], phone)
	}

	private static generateAppointmentValues() {
		return this.eventFaker.generateListAppointmentValues({
			locationId: this.locationIds[0],
			organizationId: this.organizationIds[0],
			guestId: this.fakedPerson.id,
		})
	}
}

class SpyCheckinAgent extends CheckinAgent {
	public static lastCheckin: { locationId: string; phone: string }
	public async checkin(locationId: string, phone: string) {
		SpyCheckinAgent.lastCheckin = { locationId, phone }
		return 'Test Provider'
	}
}
