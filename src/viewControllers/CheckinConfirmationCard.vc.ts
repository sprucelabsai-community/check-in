import {
	AbstractViewController,
	Card,
	CardViewController,
	FormViewController,
	ViewControllerOptions,
	buildForm,
} from '@sprucelabs/heartwood-view-controllers'
import { assertOptions, buildSchema } from '@sprucelabs/schema'

export default class CheckinConfirmationCardViewController extends AbstractViewController<Card> {
	public static id = 'checkin-confirmation-card'
	private cardVc: CardViewController
	protected formVc: FormViewController<FormSchema>
	protected locationId: string
	private onSuccessHandler: OnSuccesHandler

	public constructor(options: ViewControllerOptions & CheckinCardOptions) {
		super(options)
		const { locationId, onSuccess } = assertOptions(options, [
			'locationId',
			'onSuccess',
		])

		this.locationId = locationId
		this.onSuccessHandler = onSuccess

		this.formVc = this.FormVc()
		this.cardVc = this.CardVc()
	}

	private CardVc(): CardViewController {
		const vc = this.TalkingSprucebot()
		return this.Controller('card', {
			header: {
				title: 'Confirm your number',
			},
			body: {
				sections: [
					{
						talkingSprucebot: vc.render(),
					},
					{
						form: this.formVc.render(),
					},
				],
			},
		})
	}

	private TalkingSprucebot() {
		return this.Controller('talking-sprucebot', {
			avatar: {
				size: 'medium',
				stateOfMind: 'contemplative',
			},
			sentences: [
				{
					words: `Enter the number you used to book!`,
				},
			],
		})
	}

	private FormVc(): FormViewController<{
		id: string
		fields: { phone: { type: 'phone'; isRequired: true } }
	}> {
		return this.Controller(
			'form',
			buildForm({
				id: 'checkin',
				schema: formSchema,
				sections: [
					{
						fields: ['phone'],
					},
				],
				shouldShowCancelButton: false,
				onSubmit: this.handleSubmit.bind(this),
			})
		)
	}

	private async handleSubmit() {
		try {
			this.cardVc.setIsBusy(true)
			const client = await this.connectToApi()
			const [{ providerName }] = await client.emitAndFlattenResponses(
				'checkin.checkin::v2023_05_07',
				{
					target: {
						locationId: this.locationId,
					},
					payload: {
						phone: this.formVc.getValue('phone')!,
					},
				}
			)
			await this.alert({
				style: 'success',
				title: 'You are good to go!',
				message: `You'll be seeing ${providerName} today! C'mon in!`,
			})
			this.onSuccessHandler()
		} catch (err: any) {
			console.error(err)
			await this.alert({
				message: err.message,
			})
			this.cardVc.setIsBusy(false)
		}
	}

	public render() {
		return this.cardVc.render()
	}
}

export type OnSuccesHandler = () => void

export interface CheckinCardOptions {
	locationId: string
	onSuccess: OnSuccesHandler
}

const formSchema = buildSchema({
	id: 'checkinForm',
	fields: {
		phone: {
			type: 'phone',
			isRequired: true,
		},
	},
})

type FormSchema = typeof formSchema
