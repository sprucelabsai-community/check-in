import {
	AbstractViewController,
	Card,
	CardViewController,
	ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'

export default class CheckinConfirmationCardViewController extends AbstractViewController<Card> {
	public static id = 'checkin-confirmation-card'
	private cardVc: CardViewController

	public constructor(options: ViewControllerOptions) {
		super(options)
		this.cardVc = this.Controller('card', {})
	}

	public render() {
		return this.cardVc.render()
	}
}
