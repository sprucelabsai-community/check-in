import {
	ActiveRecordCardViewController,
	ViewControllerOptions,
	vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { assert, test } from '@sprucelabs/test-utils'
import { ListAppointment } from '../../checkin.types'
import RootSkillViewController from '../../skillViewControllers/Root.svc'
import CheckinConfirmationCardViewController, {
	CheckinCardOptions,
} from '../../viewControllers/CheckinConfirmationCard.vc'
import AbstractCheckinTest from '../support/AbstractCheckinTest'
import { GenerateListAppointmentValuesOptions } from '../support/EventFaker'

@fake.login()
export default class RootSkillViewTest extends AbstractCheckinTest {
	private static vc: SpyRootViewController

	private static fakedAppointments: ListAppointment[] = []

	@seed('locations', 1)
	protected static async beforeEach() {
		await super.beforeEach()

		this.fakedAppointments = []

		await this.eventFaker.fakeGetPerson(() => {})
		await this.eventFaker.fakeCheckin()

		this.views.setController(
			'checkin.checkin-confirmation-card',
			SpyCheckinCard
		)
		this.views.setController('active-record-card', SpyActiveRecordCard)
		this.views.setController('checkin.root', SpyRootViewController)

		this.vc = this.views.Controller('checkin.root', {}) as SpyRootViewController
	}

	protected static async afterEach(): Promise<void> {
		await super.afterEach()
		await this.vc.destroy()
	}

	@test()
	protected static async rendersActiveRecordCard() {
		await this.load()
		const cardVc = vcAssert.assertSkillViewRendersCard(this.vc, 'checkin')
		vcAssert.assertRendersAsInstanceOf(
			cardVc,
			CheckinConfirmationCardViewController
		)
	}

	@test()
	protected static async isScopedByLocationAndEmployed() {
		vcAssert.assertSkillViewScopedBy(this.vc, ['location', 'employed'])
	}

	@test()
	protected static async loadSetsUpCheckinProperly() {
		this.addFakeAppointment()
		await this.load()
		assert.isEqual(SpyCheckinCard.constructorLocationId, this.locationIds[0])
	}

	@test()
	protected static async hidesNavigation() {
		assert.isNull(this.vc.renderNavigation())
	}

	private static addFakeAppointment(
		options?: Partial<GenerateListAppointmentValuesOptions>
	) {
		const appointment = this.eventFaker.generateListAppointmentValues({
			locationId: this.locationIds[0],
			organizationId: this.organizationIds[0],
			...options,
		})

		this.fakedAppointments.push(appointment)
		return appointment
	}

	private static async load() {
		await this.views.load(this.vc)
	}
}

class SpyActiveRecordCard extends ActiveRecordCardViewController {
	public getListVc() {
		return this.listVc.getListVc()
	}

	public getCardVc() {
		return this.cardVc
	}
}

class SpyRootViewController extends RootSkillViewController {
	public didHandleClickCheckin = false
	public getUpdateInterval() {
		return this.updateIntervalMs
	}

	public setUpdateInterval(intervalMs: number) {
		this.updateIntervalMs = intervalMs
	}
}

class SpyCheckinCard extends CheckinConfirmationCardViewController {
	public static constructorLocationId: string
	public constructor(options: ViewControllerOptions & CheckinCardOptions) {
		super(options)
		SpyCheckinCard.constructorLocationId = options.locationId
	}

	public getLocationId() {
		return this.locationId
	}
	public async submitForm() {
		await this.formVc.setValue('phone', '555-555-5555')
		await this.formVc.submit()
	}
}
