import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const checkinEmitTargetSchema: SpruceSchemas.Checkin.v2023_05_07.CheckinEmitTargetSchema  = {
	id: 'checkinEmitTarget',
	version: 'v2023_05_07',
	namespace: 'Checkin',
	name: '',
	    fields: {
	            /** . */
	            'locationId': {
	                type: 'id',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(checkinEmitTargetSchema)

export default checkinEmitTargetSchema
