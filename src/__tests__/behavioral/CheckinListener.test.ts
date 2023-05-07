import { Skill } from '@sprucelabs/spruce-skill-utils'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, generateId } from '@sprucelabs/test-utils'
import { CheckinOptions } from '../../checkin.types'
import AbstractCheckinTest from '../support/AbstractCheckinTest'

@fake.login()
export default class CheckinListenerTest extends AbstractCheckinTest {
	private static skill: Skill
	private static locationId: string
	protected static async beforeEach(): Promise<void> {
		await super.beforeEach()
		const { skill } = await this.bootSkill()
		this.skill = skill
		this.locationId = generateId()
	}

	@test()
	protected static async skillIsListening() {
		await this.emitCheckin()
	}

	@test('checkin handler 1', '555-555-5555')
	@test('checkin handler 2', '555-555-1111')
	protected static async callsCheckinHandler(phone: string) {
		let wasHit = false
		let passedOptions: CheckinOptions | undefined
		const name = generateId()
		this.skill.updateContext('checkin', async (options) => {
			passedOptions = options
			wasHit = true
			return name
		})

		const providerName = await this.emitCheckin(phone)

		assert.isTrue(wasHit)
		assert.isEqualDeep(passedOptions, {
			locationId: this.locationId,
			phone,
		})
		assert.isEqual(providerName, name)
	}

	private static async emitCheckin(phone?: string) {
		const [{ providerName }] = await this.fakedClient.emitAndFlattenResponses(
			'checkin.checkin::v2023_05_07',
			{
				target: {
					locationId: this.locationId,
				},
				payload: {
					phone: phone ?? '5555555555',
				},
			}
		)

		return providerName
	}
}
