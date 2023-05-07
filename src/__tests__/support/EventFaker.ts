import { SpruceSchemas } from '@sprucelabs/heartwood-view-controllers'
import { Person } from '@sprucelabs/spruce-core-schemas'
import { eventFaker } from '@sprucelabs/spruce-test-fixtures'
import { generateId } from '@sprucelabs/test-utils'
import { ListAppointment } from '../../checkin.types'

export default class EventFaker {
	private fakedPerson: SpruceSchemas.Spruce.v2020_07_22.Person

	public constructor(options: { fakedPerson: Person }) {
		this.fakedPerson = options.fakedPerson
	}

	public async fakeListAppointments(
		cb?: (
			targetAndPayload: ListAppointmentsTargetAndPayload
		) => void | SpruceSchemas.Appointments.v2021_06_23.ListAppointment[]
	) {
		await eventFaker.on(
			'appointments.list::v2021_06_23',
			(targetAndPayload) => {
				return {
					appointments: cb?.(targetAndPayload) ?? [],
				}
			}
		)
	}

	public generateBookedServiceValues(values: {
		organizationId: string
		locationId: string
		startDateTimeMs?: number
	}) {
		const { organizationId, locationId, startDateTimeMs } = values

		return {
			id: generateId(),
			dateCreated: new Date().getTime(),
			organizationId,
			providerCasualName: generateId(),
			providerId: generateId(),
			serviceName: generateId(),
			startDateTimeMs: startDateTimeMs ?? new Date().getTime(),
			target: {
				appointmentId: generateId(),
				calendarEventId: generateId(),
				locationId,
				serviceId: generateId(),
			},
			durationMinutes: 30,
		}
	}

	public generateListAppointmentValues(
		values: GenerateListAppointmentValuesOptions
	): ListAppointment {
		const { locationId, totalServices = 1 } = values

		return {
			id: generateId(),
			dateCreated: new Date().getTime(),
			statuses: [],

			services: new Array(totalServices)
				.fill(0)
				.map(() => this.generateBookedServiceValues(values)),
			target: {
				locationId,
				guestId: generateId(),
			},
		}
	}

	public async fakeGetPerson(
		cb?: (targetAndPayload: GetPersonTargetAndPayload) => void
	) {
		await eventFaker.on('get-person::v2020_12_25', (targetAndPayload) => {
			return {
				person: cb?.(targetAndPayload) ?? this.fakedPerson,
			}
		})
	}

	public async fakeCheckin(
		cb?: (targetAndPayload: CheckinTargetAndPayload) => void
	) {
		await eventFaker.on('checkin.checkin::v2023_05_07', (targetAndPayload) => {
			cb?.(targetAndPayload)
			return {
				providerName: 'Test Provider',
			}
		})
	}
}
export type ListAppointmentsTargetAndPayload =
	SpruceSchemas.Appointments.v2021_06_23.ListEmitTargetAndPayload

export interface GenerateListAppointmentValuesOptions {
	organizationId: string
	locationId: string
	totalServices?: number
	startDateTimeMs?: number
}

export type GetPersonTargetAndPayload =
	SpruceSchemas.Mercury.v2020_12_25.GetPersonEmitTargetAndPayload

export type CheckinTargetAndPayload =
	SpruceSchemas.Checkin.v2023_05_07.CheckinEmitTargetAndPayload
