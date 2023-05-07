import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import AbstractCheckinTest from '../support/AbstractCheckinTest'
import { GetPersonTargetAndPayload } from '../support/EventFaker'

@fake.login()
export default class GetGuestListenerTest extends AbstractCheckinTest {
	@seed('locations', 1)
	protected static async beforeEach() {
		await super.beforeEach()
		await this.bootSkill()
	}

	@test()
	protected static async skillIsListening() {
		await this.emitGetGuest()
	}

	@test.skip('come back to this when adding more security')
	protected static async returnsGuest() {
		let passedTarget: GetPersonTargetAndPayload['target'] | undefined
		let wasHit = false
		await this.eventFaker.fakeGetPerson(({ target }) => {
			passedTarget = target
			wasHit = true
		})

		await this.emitGetGuest()

		assert.isTrue(wasHit)
		assert.isEqualDeep(passedTarget, {
			locationId: this.fakedLocations[0].id,
			personId: this.fakedPerson.id,
		})
	}

	private static async emitGetGuest() {
		await this.fakedClient.emitAndFlattenResponses(
			'checkin.get-guest::v2023_05_07',
			{
				target: {
					guestId: this.fakedPerson.id,
					locationId: '123',
				},
			}
		)
	}
}
