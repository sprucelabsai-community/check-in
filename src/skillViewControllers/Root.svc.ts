import {
	AbstractSkillViewController,
	ActiveRecordCardViewController,
	SkillView,
	ViewControllerOptions,
	buildActiveRecordCard,
} from '@sprucelabs/heartwood-view-controllers'

export default class RootSkillViewController extends AbstractSkillViewController {
	public static id = 'root'
	protected activeCardVc: ActiveRecordCardViewController

	public constructor(options: ViewControllerOptions) {
		super(options)
		this.activeCardVc = this.ActiveCardVc()
	}

	private ActiveCardVc(): ActiveRecordCardViewController {
		return this.Controller(
			'active-record-card',
			buildActiveRecordCard({
				id: 'appointments',
				eventName: 'appointments.list::v2021_06_23',
				rowTransformer: () => ({
					id: '123',
					cells: [],
				}),
				responseKey: 'appointments',
			})
		)
	}

	public async load() {
		await this.activeCardVc.load()
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
