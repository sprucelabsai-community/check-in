import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import eventSourceSchema_v2021_09_13 from '#spruce/schemas/spruceEventUtils/v2021_09_13/eventSource.schema'
import exportEmitTargetSchema_v2021_06_23 from '#spruce/schemas/appointments/v2021_06_23/exportEmitTarget.schema'
import exportEmitPayloadSchema_v2021_06_23 from '#spruce/schemas/appointments/v2021_06_23/exportEmitPayload.schema'

const exportEmitTargetAndPayloadSchema: SpruceSchemas.Appointments.v2021_06_23.ExportEmitTargetAndPayloadSchema  = {
	id: 'exportEmitTargetAndPayload',
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
	                options: {schema: exportEmitTargetSchema_v2021_06_23,}
	            },
	            /** . */
	            'payload': {
	                type: 'schema',
	                isRequired: true,
	                options: {schema: exportEmitPayloadSchema_v2021_06_23,}
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(exportEmitTargetAndPayloadSchema)

export default exportEmitTargetAndPayloadSchema
