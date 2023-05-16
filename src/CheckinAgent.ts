import { dateUtil } from '@sprucelabs/calendar-utils'
import { MercuryClient } from '@sprucelabs/mercury-client'
import { assertOptions } from '@sprucelabs/schema'
import SpruceError from './errors/SpruceError'

export default class CheckinAgent {
	private client: MercuryClient
	public static Class?: new (...opts: any) => CheckinAgent

	public constructor(client: MercuryClient) {
		this.client = client
	}

	public static Agent(options: { client: MercuryClient }) {
		const { client } = assertOptions(options, ['client'])
		return new (this.Class ?? this)(client)
	}

	public static reset() {
		delete this.Class
	}

	public async checkin(locationId: string, phone: string) {
		const [{ person }] = await this.client.emitAndFlattenResponses(
			'get-person::v2020_12_25',
			{
				target: {
					locationId,
					phone,
				},
			}
		)

		const now = new Date().getTime()
		const [{ appointments }] = await this.client.emitAndFlattenResponses(
			'appointments.list::v2021_06_23',
			{
				target: {
					locationId,
					guestId: person.id,
				},
				payload: {
					afterDateTimeMs: dateUtil.addMinutes(now, -15),
					beforeDateTimeMs: dateUtil.addMinutes(now, 30),
				},
			}
		)

		if (appointments.length === 0) {
			throw new SpruceError({
				code: 'NO_UPCOMING_APPOINTMENTS',
			})
		}

		const appointment = appointments[0]
		const service = appointment.services[0]

		await this.client.emitAndFlattenResponses(
			'appointments.update::v2021_06_23',
			{
				target: {
					appointmentId: appointment.id,
					locationId,
				},
				payload: {
					statuses: [...new Set([...appointment.statuses, 'checked-in'])],
				},
			}
		)

		return service.providerCasualName
	}
}
