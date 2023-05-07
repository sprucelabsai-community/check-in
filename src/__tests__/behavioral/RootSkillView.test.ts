import { dateUtil } from '@sprucelabs/calendar-utils'
import {
	ActiveRecordCardViewController,
	interactor,
	listAssert,
	vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { Person } from '@sprucelabs/spruce-core-schemas'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, generateId } from '@sprucelabs/test-utils'
import { ListAppointment } from '../../checkin.types'
import RootSkillViewController from '../../skillViewControllers/Root.svc'
import CheckinConfirmationCardViewController from '../../viewControllers/CheckinConfirmationCard.vc'
import AbstractCheckinTest from '../support/AbstractCheckinTest'
import {
	GenerateListAppointmentValuesOptions,
	GetPersonTargetAndPayload,
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
		assert.isTrue(this.vc.getActiveCardVc().getIsLoaded())
	}

	@test()
	protected static async loadsUpcomingAppointments() {
		await this.load()

		assert.isEqualDeep(this.passedTarget, {
			locationId: this.locationIds[0],
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
		await this.waitAndAssertPayloadChanged()
		await this.waitAndAssertPayloadChanged()
	}

	@test()
	protected static async appointentRowHasCheckinButton() {
		const appointment = this.addFakeAppointment()

		await this.load()

		listAssert.listRendersRow(this.listVc, appointment.id)
		listAssert.rowRendersButton(this.listVc, 0, 'checkin')
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
	protected static async triesToLoadCorrectGuest() {
		let passedTarget: GetPersonTargetAndPayload['target'] | undefined

		await this.eventFaker.fakeGetPerson(({ target }) => {
			passedTarget = target
		})

		const {
			target: { guestId },
		} = this.addFakeAppointment()

		await this.load()

		assert.isEqualDeep(passedTarget, {
			personId: guestId,
			locationId: this.locationIds[0],
		})
	}

	@test()
	protected static async guestNameShouldBeInRow() {
		this.addFakeAppointment()
		await RootSkillViewTest.loadAndWaitForGuests()

		this.assertFirtRowRendersContent(this.fakedPerson.casualName)
	}

	@test()
	protected static async matchesTheGuestToTheAppointment() {
		const {
			id,
			target: { guestId: guestId1 },
		} = this.addFakeAppointment()
		const {
			id: id2,
			target: { guestId: guestId2 },
		} = this.addFakeAppointment()

		const name2 = generateId()
		const map: Record<string, Person> = {
			[guestId1!]: this.fakedPerson,
			[guestId2!]: {
				...this.fakedPerson,
				casualName: name2,
			},
		}

		await this.eventFaker.fakeGetPerson(({ target }) => {
			return map[target!.personId!]
		})

		await this.loadAndWaitForGuests()

		this.assertRowRendersContent(id, this.fakedPerson.casualName)
		this.assertRowRendersContent(id2, name2)
	}

	@test()
	protected static async clickingCheckinPopsUpConfirm() {
		this.addFakeAppointment()

		await this.load()

		const dlg = await vcAssert.assertRendersDialog(this.vc, () =>
			interactor.clickButtonInRow(this.listVc, 0, 'checkin')
		)

		vcAssert.assertRendersAsInstanceOf(
			dlg,
			CheckinConfirmationCardViewController
		)
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

	private static get locationIds() {
		return this.fakedLocations.map((l) => l.id)
	}

	private static get organizationIds() {
		return this.fakedOrganizations.map((l) => l.id)
	}

	private static async waitAndAssertPayloadChanged() {
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
}

class SpyActiveRecordCard extends ActiveRecordCardViewController {
	public getListVc() {
		return this.listVc.getListVc()
	}
}

class SpyRootViewController extends RootSkillViewController {
	public getUpdateInterval() {
		return this.updateIntervalMs
	}
	public getActiveCardVc() {
		return this.activeCardVc as SpyActiveRecordCard
	}

	public getListVc() {
		return this.getActiveCardVc().getListVc()
	}

	public setUpdateInterval(intervalMs: number) {
		this.updateIntervalMs = intervalMs
	}
}
