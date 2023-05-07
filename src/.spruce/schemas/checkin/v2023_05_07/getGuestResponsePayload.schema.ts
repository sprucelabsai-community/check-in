import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'

import personSchema_v2020_07_22 from '#spruce/schemas/spruce/v2020_07_22/person.schema'

const getGuestResponsePayloadSchema: SpruceSchemas.Checkin.v2023_05_07.GetGuestResponsePayloadSchema  = {
	id: 'getGuestResponsePayload',
	version: 'v2023_05_07',
	namespace: 'Checkin',
	name: '',
	    fields: {
	            /** . */
	            'guest': {
	                type: 'schema',
	                isRequired: true,
	                options: {schema: personSchema_v2020_07_22,}
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(getGuestResponsePayloadSchema)

export default getGuestResponsePayloadSchema
