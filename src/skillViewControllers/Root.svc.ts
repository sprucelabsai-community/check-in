import {
	AbstractSkillViewController,
	ActiveRecordCardViewController,
	ScopeFlag,
	SkillView,
	SkillViewControllerLoadOptions,
	ViewControllerOptions,
	buildActiveRecordCard,
} from '@sprucelabs/heartwood-view-controllers'

export default class RootSkillViewController extends AbstractSkillViewController {
	public static id = 'root'
	protected activeCardVc: ActiveRecordCardViewController
	protected updateIntervalMs = 1000 * 60 * 5

	public constructor(options: ViewControllerOptions) {
		super(options)
		this.activeCardVc = this.ActiveCardVc()
	}

	public getScope = () => ['employed', 'location'] as ScopeFlag[]

	private ActiveCardVc(): ActiveRecordCardViewController {
		return this.Controller(
			'active-record-card',
			buildActiveRecordCard({
				id: 'appointments',
				eventName: 'appointments.list::v2021_06_23',
				payload: {
					afterDateTimeMs: this.dates.addMinutes(this.dates.date(), -10),
					beforeDateTimeMs: this.dates.addMinutes(this.dates.date(), 10),
				},
				rowTransformer: () => ({
					id: '123',
					cells: [],
				}),
				responseKey: 'appointments',
			})
		)
	}

	public async load({ scope }: SkillViewControllerLoadOptions) {
		const location = await scope.getCurrentLocation()

		this.activeCardVc.setTarget({
			locationId: location!.id,
		})

		await this.activeCardVc.load()

		setTimeout(() => {
			this.activeCardVc.refresh()
		}, this.updateIntervalMs)
	}

	public render(): SkillView {
		return {
			layouts: [
				{
					cards: [this.activeCardVc.render()],
				},
			],
		}
	}
}
