import { Skill } from '@sprucelabs/spruce-skill-utils'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, generateId } from '@sprucelabs/test-utils'
import { DidBookAppointment } from '../../../checkin.types'
import BookedAppointmentHandler from '../../../respondingToBookEvents/BookedAppointmentHandler'
import AbstractCheckinTest from '../../support/AbstractCheckinTest'

@fake.login()
export default class DidBookAndUpdateListenersTest extends AbstractCheckinTest {
	private static skill: Skill
	private static appointment: DidBookAppointment

	protected static async beforeEach() {
		await super.beforeEach()

		this.appointment = {
			id: generateId(),
			statuses: [],
			target: {
				locationId: generateId(),
			},
		}
	}

	@test()
	protected static async skillIsListeningToDidBook() {
		await this.bootAndEmit('appointments.did-book::v2021_06_23')
	}

	@test()
	protected static async skillIsListeningToDidUpdate() {
		await this.bootAndEmit('appointments.did-update::v2021_06_23')
	}

	@test('handler calls handler for book', 'appointments.did-book::v2021_06_23')
	@test(
		'handler calls handler for update',
		'appointments.did-update::v2021_06_23'
	)
	protected static async handlerCallsHandler(fqen: Fqen) {
		let passedAppointment: DidBookAppointment | undefined

		await this.boot()

		this.skill.updateContext('handleAppointmentChange', async (appointment) => {
			passedAppointment = appointment
		})

		await this.emit(fqen)

		assert.isEqualDeep(passedAppointment, this.appointment)
	}

	@test()
	protected static async handlerCallsHandlerInstance() {
		BookedAppointmentHandler.Class = StubAppointmentHandler

		await this.boot()

		const { handleAppointmentChange } = this.skill.getContext()
		await handleAppointmentChange(this.appointment)

		assert.isEqualDeep(
			StubAppointmentHandler.handledAppointment,
			this.appointment
		)
	}

	private static async bootAndEmit(fqen: Fqen) {
		await this.boot()
		await this.emit(fqen)
	}

	private static async boot() {
		const { skill } = await this.bootSkill()
		this.skill = skill
	}

	private static async emit(fqen: Fqen) {
		await this.fakedClient.emitAndFlattenResponses(fqen, {
			target: {
				locationId: this.appointment.target.locationId,
			},
			payload: {
				appointment: this.appointment,
			},
		})
	}
}

class StubAppointmentHandler extends BookedAppointmentHandler {
	public static handledAppointment?: DidBookAppointment
	public async handle(appointment: DidBookAppointment): Promise<void> {
		StubAppointmentHandler.handledAppointment = appointment
	}
}

type Fqen =
	| 'appointments.did-book::v2021_06_23'
	| 'appointments.did-update::v2021_06_23'
