import {
	AbstractSkillViewController,
	Card,
	ScopeFlag,
	SkillView,
	SkillViewControllerLoadOptions,
	ViewControllerOptions,
	splitCardsIntoLayouts,
} from '@sprucelabs/heartwood-view-controllers'
import { Location } from '@sprucelabs/spruce-core-schemas'
import CheckinConfirmationCardViewController from '../viewControllers/CheckinConfirmationCard.vc'

export default class RootSkillViewController extends AbstractSkillViewController {
	public static id = 'root'
	protected updateIntervalMs = 1000 * 60 * 1
	protected interval?: any
	private guestLoadPromises: Promise<void>[] = []
	private confirmationCardVc?: CheckinConfirmationCardViewController
	// private logoCardVc: CardViewController

	public constructor(options: ViewControllerOptions) {
		super(options)
		// this.logoCardVc = this.Controller('card', {
		// 	body: {
		// 		sections: [
		// 			{
		// 				image:
		// 					'https://storybook.spruce.bot/images/checkin/spruce-logo.gif',
		// 			},
		// 		],
		// 	},
		// })
	}

	public getScope = () => ['employed', 'location'] as ScopeFlag[]

	public async load({ scope }: SkillViewControllerLoadOptions) {
		const location = (await scope.getCurrentLocation()) as Location

		//TODO move to load pattern
		this.confirmationCardVc = this.Controller(
			'checkin.checkin-confirmation-card',
			{
				locationId: location.id,
				onSuccess: () => {},
			}
		)
		this.triggerRender()
	}

	public async waitForGuests() {
		await Promise.all(this.guestLoadPromises)
	}

	public async destroy(): Promise<void> {
		clearInterval(this.interval)
	}

	public render(): SkillView {
		return {
			layouts: splitCardsIntoLayouts(
				[this.confirmationCardVc?.render()].filter((c) => !!c) as Card[],
				2
			),
		}
	}
}
