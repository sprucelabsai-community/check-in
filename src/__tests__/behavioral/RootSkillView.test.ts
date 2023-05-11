import { dateUtil } from '@sprucelabs/calendar-utils'
import {
	ActiveRecordCardViewController,
	buttonAssert,
	interactor,
	listAssert,
	vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import { ListAppointment } from '../../checkin.types'
import RootSkillViewController from '../../skillViewControllers/Root.svc'
import CheckinConfirmationCardViewController from '../../viewControllers/CheckinConfirmationCard.vc'
import AbstractCheckinTest from '../support/AbstractCheckinTest'
import {
	GenerateListAppointmentValuesOptions,
	ListAppointmentsTargetAndPayload,
} from '../support/EventFaker'

@fake.login()
export default class RootSkillViewTest extends AbstractCheckinTest {
	private static vc: SpyRootViewController

	private static passedTarget:
		| ListAppointmentsTargetAndPayload['target']
		| undefined
	private static passedPayload:
		| ListAppointmentsTargetAndPayload['payload']
		| undefined

	private static fakedAppointments: ListAppointment[] = []

	@seed('locations', 1)
	protected static async beforeEach() {
		await super.beforeEach()

		this.passedTarget = undefined
		this.passedPayload = undefined
		this.fakedAppointments = []

		await this.eventFaker.fakeListAppointments(({ target, payload }) => {
			this.passedTarget = target
			this.passedPayload = payload
			return this.fakedAppointments
		})

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
		vcAssert.assertSkillViewRendersActiveRecordCard(this.vc, 'appointments')
	}

	@test()
	protected static async isScopedByLocationAndEmployed() {
		vcAssert.assertSkillViewScopedBy(this.vc, ['location', 'employed'])
	}

	@test()
	protected static async activeRecordCardIsLoadedWhenLoadingVc() {
		await this.load()
		assert.isTrue(this.activeCardVc.getIsLoaded())
		assert.isTrue(this.activeCardVc.getCardVc().getFooter()?.isSticky)
	}

	@test()
	protected static async loadsUpcomingAppointments() {
		await this.load()

		assert.isEqualDeep(this.passedTarget, {
			locationId: this.locationIds[0],
		})

		assert.isTrue(this.passedPayload?.shouldSearchLocationWide)
		this.support.assertUpcomingAppointmentstPayloadRangeIsGood(
			this.passedPayload
		)
	}

	@test()
	protected static async updatesOnInterval() {
		assert.isEqual(this.vc.getUpdateInterval(), 1000 * 60 * 1)
		this.vc.setUpdateInterval(100)
		await this.load()
		await this.waitAndAssertPayloadChanged()
		await this.waitAndAssertPayloadChanged()
	}

	@test()
	protected static async aRowForAppointments() {
		const appointment = this.addFakeAppointment()

		await this.load()

		listAssert.listRendersRow(this.listVc, appointment.id)
	}

	@test()
	protected static async checkinButtonOnCard() {
		buttonAssert.cardRendersButton(this.activeCardVc, 'checkin')
	}

	@test()
	protected static async rowHasAllServiceNamesForAppointment() {
		const appointment = this.addFakeAppointment({
			totalServices: 2,
		})

		await this.load()

		this.assertFirtRowRendersContent(appointment.services[0].serviceName)
		this.assertFirtRowRendersContent(appointment.services[1].serviceName)
	}

	@test()
	protected static async rowRendersTimeOfAppointment() {
		const appointment = this.addFakeAppointment({})
		const expected = dateUtil.formatTime(
			appointment.services[0].startDateTimeMs
		)

		await this.load()

		this.assertFirtRowRendersContent(expected)
	}

	@test()
	protected static async shouldNotCrashAboutApointmentWithNoServices() {
		const { id } = this.addFakeAppointment({
			totalServices: 0,
		})

		await this.load()

		listAssert.listDoesNotRenderRow(this.listVc, id)
	}

	@test()
	protected static async shouldHaveNoAppointmentsWithoutGuests() {
		const appointment = this.addFakeAppointment()
		appointment.target.guestId = undefined
		await this.load()
		listAssert.listDoesNotRenderRow(this.listVc, appointment.id)
	}

	@test()
	protected static async providerNameShouldBeInRow() {
		const appointment = this.addFakeAppointment()
		await RootSkillViewTest.loadAndWaitForGuests()

		this.assertFirtRowRendersContent(appointment.services[0].providerCasualName)
	}

	@test()
	protected static async matchesTheProviderToTheAppointment() {
		const {
			id,
			services: [{ providerCasualName }],
		} = this.addFakeAppointment()
		const {
			id: id2,
			services: [{ providerCasualName: providerCasualName2 }],
		} = this.addFakeAppointment()

		await this.loadAndWaitForGuests()

		this.assertRowRendersContent(id, providerCasualName)
		this.assertRowRendersContent(id2, providerCasualName2)
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

	@test()
	protected static async clickingRowActsLikeClickingCheckin() {
		this.addFakeAppointment()
		await this.load()
		await vcAssert.assertRendersDialog(this.vc, () =>
			interactor.clickRow(this.listVc, 0)
		)
		assert.isTrue(this.vc.didHandleClickCheckin)
	}

	private static async loadAndWaitForGuests() {
		await this.load()
		await this.vc.waitForGuests()
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

	private static async waitAndAssertPayloadChanged() {
		const lastPayload = this.passedPayload
		await this.wait(100)
		assert.isNotEqualDeep(this.passedPayload, lastPayload)
	}

	private static async load() {
		await this.views.load(this.vc)
	}

	private static get listVc() {
		return this.vc.getListVc()
	}

	private static assertFirtRowRendersContent(name: string) {
		this.assertRowRendersContent(0, name)
	}

	private static assertRowRendersContent(
		idOrIdx: number | string,
		name: string
	) {
		listAssert.rowRendersContent(this.listVc, idOrIdx, name)
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
		return this.activeCardVc as SpyActiveRecordCard
	}

	public getListVc() {
		return this.getActiveCardVc().getListVc()
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
