import {
	formAssert,
	interactor,
	vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { eventFaker, fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import CheckinConfirmationCardViewController from '../../viewControllers/CheckinConfirmationCard.vc'
import AbstractCheckinTest from '../support/AbstractCheckinTest'
import { CheckinTargetAndPayload } from '../support/EventFaker'

@fake.login()
export default class CheckingConfirmationCardTest extends AbstractCheckinTest {
	private static vc: SpyCheckinCard
	private static wasOnSuccesHandlerHit = false

	@seed('locations', 1)
	protected static async beforeEach() {
		await super.beforeEach()

		this.wasOnSuccesHandlerHit = false

		this.views.setController(
			'checkin.checkin-confirmation-card',
			SpyCheckinCard
		)
		this.vc = this.views.Controller('checkin.checkin-confirmation-card', {
			locationId: this.locationIds[0],
			onSuccess: () => {
				this.wasOnSuccesHandlerHit = true
			},
		}) as SpyCheckinCard

		await this.eventFaker.fakeCheckin()
	}

	@test()
	protected static async throwsWithMissing() {
		const err = assert.doesThrow(() =>
			//@ts-ignore
			this.views.Controller('checkin.checkin-confirmation-card', {})
		)

		errorAssert.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['locationId', 'onSuccess'],
		})
	}

	@test()
	protected static async rendersFormWithPhoneField() {
		formAssert.cardRendersForm(this.vc, 'checkin')
		formAssert.formRendersField(this.formVc, 'phone')
		assert.isFalse(this.formVc.getShouldRenderCancelButton())
	}

	@test('fail renders alert 1', '555-555-5555')
	@test('fail renders alert 2', '555-555-6666')
	protected static async failingASubmitRendersAlertsWithPropertTargetAndPayload(
		phone: string
	) {
		let passedTarget: CheckinTargetAndPayload['target'] | undefined
		let passedPayload: CheckinTargetAndPayload['payload'] | undefined

		await this.eventFaker.fakeCheckin(({ target, payload }) => {
			passedTarget = target
			passedPayload = payload
			assert.fail('nooo!!')
		})

		await this.setPhone(phone)
		await vcAssert.assertRendersAlert(this.vc, () => this.submit())

		assert.isEqualDeep(passedTarget, {
			locationId: this.locationIds[0],
		})

		assert.isEqualDeep(passedPayload, {
			phone,
		})

		this.assertOnSuccesNotInvoked()
	}

	@test()
	protected static async sucssessOnSuccess() {
		await this.setPhone()
		await vcAssert.assertRendersSuccessAlert(this.vc, () => this.submit())
	}

	@test()
	protected static async successInvokesOnSubmit() {
		this.assertOnSuccesNotInvoked()
		const alertVc = await this.setPhoneAndAssertSuccessOnSubmit()
		this.assertOnSuccesNotInvoked()
		await alertVc.hide()
		assert.isTrue(this.wasOnSuccesHandlerHit)
	}

	@test()
	protected static async phoneFieldClearsOnSuccess() {
		const alertVc = await this.setPhoneAndAssertSuccessOnSubmit()
		await alertVc.hide()
		this.assertResetPhone()
		vcAssert.assertCardIsNotBusy(this.vc)
	}

	@test()
	protected static async phoneFieldDoesNotClearOnError() {
		await eventFaker.makeEventThrow('checkin.checkin::v2023_05_07')
		const alertVc = await this.setPhoneAndAssertSuccessOnSubmit()
		await alertVc.hide()
		assert.isTruthy(this.getPhone())
	}

	private static assertResetPhone() {
		assert.isEqual(this.getPhone(), '')
	}

	private static getPhone(): string {
		return this.formVc.getValue('phone')
	}

	private static async setPhoneAndAssertSuccessOnSubmit() {
		await this.setPhone()
		const alertVc = await vcAssert.assertRendersSuccessAlert(this.vc, () =>
			this.submit()
		)
		return alertVc
	}

	private static assertOnSuccesNotInvoked() {
		assert.isFalse(this.wasOnSuccesHandlerHit)
	}

	private static submit(): any {
		return interactor.submitForm(this.formVc)
	}

	private static async setPhone(phone?: string) {
		await this.formVc.setValue('phone', phone ?? '555-555-5555')
	}

	private static get formVc() {
		return this.vc.getFormVc()
	}
}

class SpyCheckinCard extends CheckinConfirmationCardViewController {
	public getFormVc() {
		return this.formVc
	}
}
