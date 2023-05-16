import { SimpleStoreFactory } from '@sprucelabs/data-stores'
import { MercuryClient } from '@sprucelabs/mercury-client'
import { assertOptions } from '@sprucelabs/schema'
import { Person, SpruceSchemas } from '@sprucelabs/spruce-core-schemas'
import { buildLog } from '@sprucelabs/spruce-skill-utils'
import { Appointment, DidBookAppointment } from '../checkin.types'
import TrackedAppointmentsStore from './TrackedAppointments.store'

export default class BookedAppointmentHandler {
	public static debounceDurationMs = 1000
	public static Class: typeof BookedAppointmentHandler
	private log = buildLog('BookedAppointmentHandler')
	private handleTimeouts: Record<string, any> = {}

	protected constructor(
		private readonly tracker: TrackedAppointmentsStore,
		private readonly client: MercuryClient
	) {}

	public static async Handler(options: {
		stores: SimpleStoreFactory
		client: MercuryClient
	}) {
		const { stores, client } = assertOptions(options, ['stores', 'client'])
		const tracker = await stores.getStore('trackedAppointments')
		return new (this.Class ?? this)(tracker, client)
	}

	public async handle(appointment: DidBookAppointment) {
		const { id } = appointment

		clearTimeout(this.handleTimeouts[id])
		this.handleTimeouts[id] = setTimeout(async () => {
			try {
				await this._handle(appointment)
			} catch (err: any) {
				this.log.error(
					'Failed to handle appointment for checkin',
					err.stack ?? err.message
				)
			}
		}, BookedAppointmentHandler.debounceDurationMs)
	}

	private async _handle(appointment: DidBookAppointment) {
		const { id } = appointment
		const match = await this.tracker.findOne({ id })
		let shouldSend = false
		if (match) {
			shouldSend = !this.isCheckedIn(match) && this.isCheckedIn(appointment)
		} else if (!match && this.isCheckedIn(appointment)) {
			shouldSend = true
		}

		if (shouldSend) {
			const full = await this.loadFullAppointment(appointment)
			await this.sendCheckinMessage(full)
		}

		await this.track(appointment)
	}

	private async track(appointment: DidBookAppointment) {
		await this.tracker.upsertOne(
			{
				id: appointment.id,
			},
			{
				id: appointment.id,
				statuses: appointment.statuses,
			}
		)
	}

	private async sendCheckinMessage(appointment: Appointment) {
		const guest = await this.loadGuest(appointment)
		const url = await this.generateUrl(appointment)
		await this.emitSendMessage(appointment, guest, url)
	}

	private async loadGuest(appointment: Appointment) {
		const guestId = appointment.target.guestId!
		const locationId = appointment.target.locationId
		const [{ person }] = await this.client.emitAndFlattenResponses(
			'get-person::v2020_12_25',
			{
				target: {
					locationId,
					personId: guestId,
				},
			}
		)

		return person
	}

	private async emitSendMessage(
		appointment: SpruceSchemas.Appointments.v2021_06_23.Appointment,
		person: Person,
		url: string
	) {
		const service = appointment.services[0]
		await this.client.emitAndFlattenResponses('send-message::v2020_12_25', {
			target: {
				locationId: appointment.target.locationId,
				personId: service.providerId,
			},
			payload: {
				message: {
					body: `Hey ${service.providerCasualName}! ${person.casualName} is here for their ${service.serviceName}!`,
					classification: 'transactional',
					links: [
						{
							label: `${person.casualName}'s Feed`,
							uri: url,
						},
					],
				},
			},
		})
		return service
	}

	private async loadFullAppointment(appointment: DidBookAppointment) {
		const {
			id,
			target: { locationId },
		} = appointment
		const [{ appointment: fullAppointment }] =
			await this.client.emitAndFlattenResponses(
				'appointments.get::v2021_06_23',
				{
					target: {
						locationId,
						appointmentId: id,
					},
				}
			)

		return fullAppointment
	}

	private async generateUrl(fullAppointment: Appointment) {
		const {
			target: { guestId, locationId },
		} = fullAppointment

		const [{ url }] = await this.client.emitAndFlattenResponses(
			'heartwood.generate-url::v2021_02_11',
			{
				target: {
					skillViewId: 'feed.root',
				},
				payload: {
					args: {
						scopedLocationId: locationId,
						personId: guestId,
					},
				},
			}
		)

		const ur = url
		return ur
	}

	private isCheckedIn(appointment: { statuses: string[] }) {
		return appointment.statuses.includes('checked-in')
	}
}
