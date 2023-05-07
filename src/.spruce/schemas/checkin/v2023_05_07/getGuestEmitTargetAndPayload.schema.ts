import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import eventSourceSchema_v2021_09_13 from '#spruce/schemas/spruceEventUtils/v2021_09_13/eventSource.schema'
import getGuestEmitTargetSchema_v2023_05_07 from '#spruce/schemas/checkin/v2023_05_07/getGuestEmitTarget.schema'

const getGuestEmitTargetAndPayloadSchema: SpruceSchemas.Checkin.v2023_05_07.GetGuestEmitTargetAndPayloadSchema  = {
	id: 'getGuestEmitTargetAndPayload',
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
	                options: {schema: getGuestEmitTargetSchema_v2023_05_07,}
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(getGuestEmitTargetAndPayloadSchema)

export default getGuestEmitTargetAndPayloadSchema
