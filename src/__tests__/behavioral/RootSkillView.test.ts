import {
	ActiveRecordCardViewController,
	buttonAssert,
	interactor,
	vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import { ListAppointment } from '../../checkin.types'
import RootSkillViewController from '../../skillViewControllers/Root.svc'
import CheckinConfirmationCardViewController from '../../viewControllers/CheckinConfirmationCard.vc'
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
		vcAssert.assertSkillViewRendersCard(this.vc, 'appointments')
	}

	@test()
	protected static async isScopedByLocationAndEmployed() {
		vcAssert.assertSkillViewScopedBy(this.vc, ['location', 'employed'])
	}

	@test()
	protected static async checkinButtonOnCard() {
		buttonAssert.cardRendersButton(this.activeCardVc, 'checkin')
	}

	@test()
	protected static async clickingCheckinPopsUpConfirm() {
		this.addFakeAppointment()

		await this.load()

		const dlg = await vcAssert.assertRendersDialog(this.vc, () =>
			interactor.clickButton(this.activeCardVc, 'checkin')
		)

		const checkinVc = vcAssert.assertRendersAsInstanceOf(
			dlg,
			CheckinConfirmationCardViewController
		) as SpyCheckinCard

		await checkinVc.submitForm()

		assert.isFalse(dlg.getIsVisible())
		assert.isEqual(checkinVc.getLocationId(), this.locationIds[0])
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

	private static get activeCardVc() {
		return this.vc.getActiveCardVc()
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
	public getActiveCardVc() {
		return this.cardVc
	}

	public async handleClickCheckin() {
		this.didHandleClickCheckin = true
		return super.handleClickCheckin()
	}

	public setUpdateInterval(intervalMs: number) {
		this.updateIntervalMs = intervalMs
	}
}

class SpyCheckinCard extends CheckinConfirmationCardViewController {
	public getLocationId() {
		return this.locationId
	}
	public async submitForm() {
		await this.formVc.setValue('phone', '555-555-5555')
		await this.formVc.submit()
	}
}
