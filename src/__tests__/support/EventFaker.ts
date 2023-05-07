import { SpruceSchemas } from '@sprucelabs/heartwood-view-controllers'
import { eventFaker } from '@sprucelabs/spruce-test-fixtures'

export default class EventFaker {
	public async fakeListAppointments(
		cb?: (targetAndPayload: ListAppointmentsTargetAndPayload) => void
	) {
		await eventFaker.on(
			'appointments.list::v2021_06_23',
			(targetAndPayload) => {
				cb?.(targetAndPayload)
				return {
					appointments: [],
				}
			}
		)
	}
}
export type ListAppointmentsTargetAndPayload =
	SpruceSchemas.Appointments.v2021_06_23.ListEmitTargetAndPayload
