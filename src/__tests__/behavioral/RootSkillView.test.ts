import { vcAssert } from '@sprucelabs/heartwood-view-controllers'
import { eventFaker, fake } from '@sprucelabs/spruce-test-fixtures'
import { AbstractSpruceFixtureTest } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import RootSkillViewController from '../../skillViewControllers/Root.svc'

@fake.login()
export default class RootSkillViewTest extends AbstractSpruceFixtureTest {
	private static vc: SpyRootViewController
	protected static async beforeEach() {
		await super.beforeEach()
		this.views.setController('checkin.root', SpyRootViewController)
		this.vc = this.views.Controller('checkin.root', {}) as SpyRootViewController
	}

	@test()
	protected static async rendersActiveRecordCard() {
		vcAssert.assertSkillViewRendersActiveRecordCard(this.vc, 'appointments')
	}

	@test()
	protected static async activeRecordCardIsLoadedWhenLoadingVc() {
		await this.views.load(this.vc)
		assert.isTrue(this.vc.getActiveCardVc().getIsLoaded())
	}

	@test()
	protected static async loadsUpcomingAppointments() {
		await eventFaker.on('appointments.list::v2021_06_23', () => {
			return {
				appointments: [],
			}
		})
	}
}

class SpyRootViewController extends RootSkillViewController {
	public getActiveCardVc() {
		return this.cardVc
	}
}
