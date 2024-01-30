import '#spruce/permissions/permissions.types'
import { buildEventContract } from '@sprucelabs/mercury-types'
import calendarEventsForExportEmitTargetAndPayloadSchema from '#spruce/schemas/appointments/v2021_06_23/calendarEventsForExportEmitTargetAndPayload.schema'

const calendarEventsForExportEventContract = buildEventContract({
	eventSignatures: {
		'appointments.calendar-events-for-export::v2021_06_23': {
			emitPayloadSchema: calendarEventsForExportEmitTargetAndPayloadSchema,
		},
	},
})
export default calendarEventsForExportEventContract

export type CalendarEventsForExportEventContract =
	typeof calendarEventsForExportEventContract
