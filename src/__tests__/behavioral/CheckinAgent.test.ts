import { MercuryClient } from '@sprucelabs/mercury-client'
import { assertOptions } from '@sprucelabs/schema'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import AbstractCheckinTest from '../support/AbstractCheckinTest'
import {
	GetPersonTargetAndPayload,
	ListAppointmentsTargetAndPayload,
} from '../support/EventFaker'

@fake.login()
export default class CheckinAgentTest extends AbstractCheckinTest {
	private static agent: CheckinAgent

	@seed('locations', 1)
	protected static async beforeEach(): Promise<void> {
		await super.beforeEach()
		this.agent = CheckinAgent.Agent({
			client: this.fakedClient,
		})

		await this.eventFaker.fakeGetPerson()
		await this.eventFaker.fakeListAppointments()
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
		let wasHit = false
		let passedTarget: ListAppointmentsTargetAndPayload['target'] | undefined

		await this.eventFaker.fakeListAppointments(({ target }) => {
			passedTarget = target
			wasHit = true
		})

		await this.checkin()

		assert.isTrue(wasHit)
		assert.isEqualDeep(passedTarget, {
			locationId: this.locationIds[0],
		})
	}

	private static async checkin(phone = '555-555-5555') {
		await this.agent.checkin(this.locationIds[0], phone)
	}
}

class CheckinAgent {
	private client: MercuryClient

	protected constructor(client: MercuryClient) {
		this.client = client
	}

	public static Agent(options: { client: MercuryClient }) {
		const { client } = assertOptions(options, ['client'])
		return new this(client)
	}

	public async checkin(locationId: string, phone: string) {
		await this.client.emitAndFlattenResponses('get-person::v2020_12_25', {
			target: {
				locationId,
				phone,
			},
		})

		await this.client.emitAndFlattenResponses(
			'appointments.list::v2021_06_23',
			{
				target: {
					locationId,
				},
			}
		)
	}
}
