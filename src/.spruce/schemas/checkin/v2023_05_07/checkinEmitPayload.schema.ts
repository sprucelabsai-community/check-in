import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const checkinEmitPayloadSchema: SpruceSchemas.Checkin.v2023_05_07.CheckinEmitPayloadSchema  = {
	id: 'checkinEmitPayload',
	version: 'v2023_05_07',
	namespace: 'Checkin',
	name: '',
	    fields: {
	            /** . */
	            'phone': {
	                type: 'phone',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(checkinEmitPayloadSchema)

export default checkinEmitPayloadSchema
