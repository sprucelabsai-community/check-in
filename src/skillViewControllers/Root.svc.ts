import {
	AbstractSkillViewController,
	CardViewController,
	ScopeFlag,
	SkillView,
	SkillViewControllerLoadOptions,
	TalkingSprucebotViewController,
	ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { Location } from '@sprucelabs/spruce-core-schemas'

export default class RootSkillViewController extends AbstractSkillViewController {
	public static id = 'root'
	protected cardVc: CardViewController
	protected updateIntervalMs = 1000 * 60 * 1
	protected interval?: any
	private location!: Location
	private guestLoadPromises: Promise<void>[] = []
	private talkingSprucebotVc: TalkingSprucebotViewController

	public constructor(options: ViewControllerOptions) {
		super(options)
		this.talkingSprucebotVc = this.Controller('talking-sprucebot', {
			avatar: {
				size: 'medium',
				stateOfMind: 'accomplished',
			},
			sentences: [
				{
					words: 'Hey there! 👋 Checkin now!',
				},
			],
		})
		this.cardVc = this.CardVc()
	}

	public getScope = () => ['employed', 'location'] as ScopeFlag[]

	private CardVc(): CardViewController {
		return this.Controller('card', {
			id: 'appointments',
			header: {
				title: 'Upcoming appointments 👇',
			},
			body: {
				sections: [
					{
						talkingSprucebot: this.talkingSprucebotVc.render(),
					},
				],
			},
			footer: {
				isSticky: true,
				buttons: [
					{
						id: 'checkin',
						label: 'Checkin now!!',
						type: 'primary',
						onClick: this.handleClickCheckin.bind(this),
					},
				],
			},
		})
	}

	public async load({ scope }: SkillViewControllerLoadOptions) {
		this.location = (await scope.getCurrentLocation()) as Location
	}

	protected async handleClickCheckin() {
		const vc = this.Controller('checkin.checkin-confirmation-card', {
			locationId: this.location.id,
			onSuccess: () => dlgVc.hide(),
		})
		const dlgVc = this.renderInDialog(vc.render())
	}

	public async waitForGuests() {
		await Promise.all(this.guestLoadPromises)
	}

	public async destroy(): Promise<void> {
		clearInterval(this.interval)
	}

	public render(): SkillView {
		return {
			layouts: [
				{
					cards: [this.cardVc.render()],
				},
			],
		}
	}
}
