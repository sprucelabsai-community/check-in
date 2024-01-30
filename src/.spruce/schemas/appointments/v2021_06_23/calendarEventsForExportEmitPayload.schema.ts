import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import calendarEventSchema_v2021_05_19 from '#spruce/schemas/calendarUtils/v2021_05_19/calendarEvent.schema'
import chunkPagingSchema_v2023_10_21 from '#spruce/schemas/mercuryChunkingEmitter/v2023_10_21/chunkPaging.schema'

const calendarEventsForExportEmitPayloadSchema: SpruceSchemas.Appointments.v2021_06_23.CalendarEventsForExportEmitPayloadSchema  = {
	id: 'calendarEventsForExportEmitPayload',
	version: 'v2021_06_23',
	namespace: 'Appointments',
	name: '',
	    fields: {
	            /** . */
	            'chunkingId': {
	                type: 'id',
	                isRequired: true,
	                options: undefined
	            },
	            /** . */
	            'events': {
	                type: 'schema',
	                isRequired: true,
	                isArray: true,
	                minArrayLength: 0,
	                options: {schema: calendarEventSchema_v2021_05_19,}
	            },
	            /** . */
	            'chunk': {
	                type: 'schema',
	                isRequired: true,
	                options: {schema: chunkPagingSchema_v2023_10_21,}
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(calendarEventsForExportEmitPayloadSchema)

export default calendarEventsForExportEmitPayloadSchema
