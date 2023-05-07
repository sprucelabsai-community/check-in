import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import eventSourceSchema_v2021_09_13 from '#spruce/schemas/spruceEventUtils/v2021_09_13/eventSource.schema'
import createCategoryEmitTargetSchema_v2021_06_23 from '#spruce/schemas/appointments/v2021_06_23/createCategoryEmitTarget.schema'
import createCategoryEmitPayloadSchema_v2021_06_23 from '#spruce/schemas/appointments/v2021_06_23/createCategoryEmitPayload.schema'

const createCategoryEmitTargetAndPayloadSchema: SpruceSchemas.Appointments.v2021_06_23.CreateCategoryEmitTargetAndPayloadSchema  = {
	id: 'createCategoryEmitTargetAndPayload',
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
	                options: {schema: createCategoryEmitTargetSchema_v2021_06_23,}
	            },
	            /** . */
	            'payload': {
	                type: 'schema',
	                isRequired: true,
	                options: {schema: createCategoryEmitPayloadSchema_v2021_06_23,}
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(createCategoryEmitTargetAndPayloadSchema)

export default createCategoryEmitTargetAndPayloadSchema
