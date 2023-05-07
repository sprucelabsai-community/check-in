import { vcAssert } from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { AbstractSpruceFixtureTest } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import RootSkillViewController from '../../skillViewControllers/Root.svc'
import EventFaker from '../support/EventFaker'

@fake.login()
export default class RootSkillViewTest extends AbstractSpruceFixtureTest {
	private static vc: SpyRootViewController
	private static eventFaker: EventFaker
	protected static async beforeEach() {
		await super.beforeEach()

		this.eventFaker = new EventFaker()
		await this.eventFaker.fakeListAppointments()

		this.views.setController('checkin.root', SpyRootViewController)
		this.vc = this.views.Controller('checkin.root', {}) as SpyRootViewController
	}

	@test()
	protected static async rendersActiveRecordCard() {
		vcAssert.assertSkillViewRendersActiveRecordCard(this.vc, 'appointments')
	}

	@test()
	protected static async activeRecordCardIsLoadedWhenLoadingVc() {
		await this.load()
		assert.isTrue(this.vc.getActiveCardVc().getIsLoaded())
	}

	@test()
	protected static async loadsUpcomingAppointments() {
		let wasHit = false

		await this.eventFaker.fakeListAppointments(() => {
			wasHit = true
		})

		await this.load()

		assert.isTrue(wasHit)
	}

	private static async load() {
		await this.views.load(this.vc)
	}
}

class SpyRootViewController extends RootSkillViewController {
	public getActiveCardVc() {
		return this.activeCardVc
	}
}
