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
import { Location, Person } from '@sprucelabs/spruce-core-schemas'
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

	private renderRow(appointment: ListAppointment, guest?: Person): ListRow {
		const services = appointment.services
		const names: string[] = []

		for (const service of services) {
			names.push(service.serviceName)
		}

		const firstProvider = services[0].providerCasualName

		let title = names.join(', ')

		const startMs = services[0].startDateTimeMs
		title += ` @ ${this.dates.formatTime(startMs)} w/ ${firstProvider}`

		let subText: string | undefined
		if (guest) {
			subText = guest.casualName
		} else {
			this.guestLoadPromises.push(this.loadGuest(appointment))
		}

		return {
			id: appointment.id,
			cells: [
				{
					text: {
						content: title,
					},
					subText: {
						content: subText,
					},
				},
				{
					button: {
						id: 'checkin',
						label: 'Checkin',
						type: 'primary',
						onClick: () => this.handleClickCheckin(),
					},
				},
			],
		}
	}

	private async handleClickCheckin() {
		const vc = this.Controller('checkin.checkin-confirmation-card', {})
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

	private async loadGuest(appointment: ListAppointment) {
		const client = await this.connectToApi()
		const [{ person }] = await client.emitAndFlattenResponses(
			'get-person::v2020_12_25',
			{
				target: {
					personId: appointment.target.guestId!,
					locationId: this.location.id,
				},
			}
		)

		this.activeCardVc.upsertRow(
			appointment.id,
			this.renderRow(appointment, person)
		)
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
