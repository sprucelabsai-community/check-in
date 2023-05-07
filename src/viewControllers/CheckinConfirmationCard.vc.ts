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
	private locationId: string
	private onSuccessHandler: OnSuccesHandler

	public constructor(options: ViewControllerOptions & CheckinCardOptions) {
		super(options)
		const { locationId, onSuccess } = assertOptions(options, [
			'locationId',
			'onSuccess',
		])
		this.locationId = locationId
		this.onSuccessHandler = onSuccess

		this.formVc = this.Controller(
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

		const vc = this.Controller('talking-sprucebot', {
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

		this.cardVc = this.Controller('card', {
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

	private async handleSubmit() {
		try {
			const client = await this.connectToApi()
			const [{ providerName }] = await client.emitAndFlattenResponses(
				'checkin.checkin::v2023_05_07',
				{
					target: {
						locationId: this.locationId,
					},
					payload: {
						phone: '555-555-5555',
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
