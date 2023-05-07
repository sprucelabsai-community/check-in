import {
	AbstractSkillViewController,
	ActiveRecordCardViewController,
	ListRow,
	ScopeFlag,
	SkillView,
	SkillViewControllerLoadOptions,
	ViewControllerOptions,
	buildActiveRecordCard,
} from '@sprucelabs/heartwood-view-controllers'
import { Location } from '@sprucelabs/spruce-core-schemas'
import { ListAppointment } from '../checkin.types'

export default class RootSkillViewController extends AbstractSkillViewController {
	public static id = 'root'
	protected activeCardVc: ActiveRecordCardViewController
	protected updateIntervalMs = 1000 * 60 * 5
	protected interval?: any
	private location!: Location
	private guestLoadPromises: Promise<void>[] = []

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
				payload: this.buildPayload(),
				rowTransformer: this.renderRow.bind(this),
				responseKey: 'appointments',
				columnWidths: ['fill'],
				footer: {
					buttons: [
						{
							id: 'checkin',
							label: 'Checkin now!!',
							type: 'primary',
							onClick: this.handleClickCheckin.bind(this),
						},
					],
				},
				filter: (appointment: ListAppointment) => {
					return !!(
						appointment.services.length > 0 && appointment.target.guestId
					)
				},
				header: {
					title: 'Checkin below! 👇',
				},
				noResultsRow: {
					height: 'content',
					cells: [
						{
							text: {
								content: 'There are no appointments coming up for checkin!',
							},
						},
					],
				},
			})
		)
	}

	private renderRow(appointment: ListAppointment): ListRow {
		const services = appointment.services
		const names: string[] = []

		for (const service of services) {
			names.push(service.serviceName)
		}

		const firstProvider = services[0].providerCasualName

		let title = names.join(', ')

		const startMs = services[0].startDateTimeMs
		title += ` @ ${this.dates.formatTime(startMs)}`

		return {
			id: appointment.id,
			cells: [
				{
					text: {
						content: title,
					},
					subText: {
						content: `w/ ${firstProvider}`,
					},
				},
			],
		}
	}

	private async handleClickCheckin() {
		const vc = this.Controller('checkin.checkin-confirmation-card', {
			locationId: 'aoeu',
			onSuccess: () => {},
		})
		this.renderInDialog(vc.render())
	}

	public async waitForGuests() {
		await Promise.all(this.guestLoadPromises)
	}

	private buildPayload() {
		return {
			afterDateTimeMs: this.dates.addMinutes(this.dates.date(), -10),
			beforeDateTimeMs: this.dates.addMinutes(this.dates.date(), 10),
		}
	}

	public async load({ scope }: SkillViewControllerLoadOptions) {
		this.location = (await scope.getCurrentLocation()) as Location

		await this.loadActiveRecordCard()

		this.interval = setInterval(() => {
			this.refresh()
		}, this.updateIntervalMs)
	}

	private async loadActiveRecordCard() {
		this.activeCardVc.setTarget({
			locationId: this.location.id,
		})

		await this.activeCardVc.load()
	}

	private refresh() {
		this.activeCardVc.setPayload(this.buildPayload())
		this.activeCardVc.refresh()
	}

	public async destroy(): Promise<void> {
		clearInterval(this.interval)
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
