import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const checkinResponsePayloadSchema: SpruceSchemas.Checkin.v2023_05_07.CheckinResponsePayloadSchema  = {
	id: 'checkinResponsePayload',
	version: 'v2023_05_07',
	namespace: 'Checkin',
	name: '',
	    fields: {
	            /** . */
	            'providerName': {
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(checkinResponsePayloadSchema)

export default checkinResponsePayloadSchema
