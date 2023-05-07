import { dateUtil } from '@sprucelabs/calendar-utils'
import { vcAssert } from '@sprucelabs/heartwood-view-controllers'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { AbstractSpruceFixtureTest } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import RootSkillViewController from '../../skillViewControllers/Root.svc'
import EventFaker, {
	ListAppointmentsTargetAndPayload,
} from '../support/EventFaker'

@fake.login()
export default class RootSkillViewTest extends AbstractSpruceFixtureTest {
	private static vc: SpyRootViewController
	private static eventFaker: EventFaker
	private static passedTarget:
		| ListAppointmentsTargetAndPayload['target']
		| undefined
	private static passedPayload:
		| ListAppointmentsTargetAndPayload['payload']
		| undefined

	@seed('locations', 1)
	protected static async beforeEach() {
		await super.beforeEach()

		this.eventFaker = new EventFaker()

		this.passedTarget = undefined
		this.passedPayload = undefined

		await this.eventFaker.fakeListAppointments(({ target, payload }) => {
			this.passedTarget = target
			this.passedPayload = payload
		})

		this.views.setController('checkin.root', SpyRootViewController)
		this.vc = this.views.Controller('checkin.root', {}) as SpyRootViewController
	}

	@test()
	protected static async rendersActiveRecordCard() {
		vcAssert.assertSkillViewRendersActiveRecordCard(this.vc, 'appointments')
	}

	@test()
	protected static async isScopedByLocationAndEmployed() {
		vcAssert.assertSkillViewScopedBy(this.vc, ['location', 'employed'])
	}

	@test()
	protected static async activeRecordCardIsLoadedWhenLoadingVc() {
		await this.load()
		assert.isTrue(this.vc.getActiveCardVc().getIsLoaded())
	}

	@test()
	protected static async loadsUpcomingAppointments() {
		await this.load()

		assert.isEqualDeep(this.passedTarget, {
			locationId: this.fakedLocations[0].id,
		})

		assert.isBelow(this.passedPayload?.afterDateTimeMs, this.minutesFromNow(-9))
		assert.isAbove(
			this.passedPayload?.afterDateTimeMs,
			this.minutesFromNow(-11)
		)

		assert.isBelow(
			this.passedPayload?.beforeDateTimeMs,
			this.minutesFromNow(11)
		)
		assert.isAbove(this.passedPayload?.beforeDateTimeMs, this.minutesFromNow(9))
	}

	@test()
	protected static async updatesOnInterval() {
		assert.isEqual(this.vc.getUpdateInterval(), 1000 * 60 * 5)
		this.vc.setUpdateInterval(100)
		await this.load()
		const lastPayload = this.passedPayload
		await this.wait(100)
		assert.isNotEqualDeep(this.passedPayload, lastPayload)
	}

	private static minutesFromNow(minutes: number): number | null | undefined {
		return dateUtil.addMinutes(new Date().getTime(), minutes)
	}

	private static async load() {
		await this.views.load(this.vc)
	}
}

class SpyRootViewController extends RootSkillViewController {
	public getUpdateInterval() {
		return this.updateIntervalMs
	}
	public getActiveCardVc() {
		return this.activeCardVc
	}

	public setUpdateInterval(intervalMs: number) {
		this.updateIntervalMs = intervalMs
	}
}
