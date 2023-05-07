import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import eventSourceSchema_v2021_09_13 from '#spruce/schemas/spruceEventUtils/v2021_09_13/eventSource.schema'
import checkinEmitTargetSchema_v2023_05_07 from '#spruce/schemas/checkin/v2023_05_07/checkinEmitTarget.schema'
import checkinEmitPayloadSchema_v2023_05_07 from '#spruce/schemas/checkin/v2023_05_07/checkinEmitPayload.schema'

const checkinEmitTargetAndPayloadSchema: SpruceSchemas.Checkin.v2023_05_07.CheckinEmitTargetAndPayloadSchema  = {
	id: 'checkinEmitTargetAndPayload',
	version: 'v2023_05_07',
	namespace: 'Checkin',
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
	                options: {schema: checkinEmitTargetSchema_v2023_05_07,}
	            },
	            /** . */
	            'payload': {
	                type: 'schema',
	                isRequired: true,
	                options: {schema: checkinEmitPayloadSchema_v2023_05_07,}
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(checkinEmitTargetAndPayloadSchema)

export default checkinEmitTargetAndPayloadSchema
