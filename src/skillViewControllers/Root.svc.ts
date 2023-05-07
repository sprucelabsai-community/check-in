import {
	AbstractSkillViewController,
	ActiveRecordCardViewController,
	SkillView,
	ViewControllerOptions,
	buildActiveRecordCard,
} from '@sprucelabs/heartwood-view-controllers'

export default class RootSkillViewController extends AbstractSkillViewController {
	public static id = 'root'
	protected cardVc: ActiveRecordCardViewController

	public constructor(options: ViewControllerOptions) {
		super(options)
		this.cardVc = this.Controller(
			'active-record-card',
			buildActiveRecordCard({
				id: 'appointments',
				eventName: 'list-roles::v2020_12_25',
				rowTransformer: () => ({
					id: '123',
					cells: [],
				}),
				responseKey: 'roles',
			})
		)
	}

	public async load() {
		await this.cardVc.load()
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
