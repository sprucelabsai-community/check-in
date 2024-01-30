import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import eventSourceSchema_v2021_09_13 from '#spruce/schemas/spruceEventUtils/v2021_09_13/eventSource.schema'
import calendarEventsForExportEmitTargetSchema_v2021_06_23 from '#spruce/schemas/appointments/v2021_06_23/calendarEventsForExportEmitTarget.schema'
import calendarEventsForExportEmitPayloadSchema_v2021_06_23 from '#spruce/schemas/appointments/v2021_06_23/calendarEventsForExportEmitPayload.schema'

const calendarEventsForExportEmitTargetAndPayloadSchema: SpruceSchemas.Appointments.v2021_06_23.CalendarEventsForExportEmitTargetAndPayloadSchema  = {
	id: 'calendarEventsForExportEmitTargetAndPayload',
	version: 'v2021_06_23',
	namespace: 'Appointments',
	name: '',
	    fields: {
	            /** Source. */
	            'source': {
	                label: 'Source',
	                type: 'schema',
	                options: {schema: eventSourceSchema_v2021_09_13,}
	            },
	            /** . */
	            'target': {
	                type: 'schema',
	                isRequired: true,
	                options: {schema: calendarEventsForExportEmitTargetSchema_v2021_06_23,}
	            },
	            /** . */
	            'payload': {
	                type: 'schema',
	                isRequired: true,
	                options: {schema: calendarEventsForExportEmitPayloadSchema_v2021_06_23,}
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(calendarEventsForExportEmitTargetAndPayloadSchema)

export default calendarEventsForExportEmitTargetAndPayloadSchema
