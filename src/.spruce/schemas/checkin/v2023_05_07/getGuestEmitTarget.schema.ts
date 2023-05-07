import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const getGuestEmitTargetSchema: SpruceSchemas.Checkin.v2023_05_07.GetGuestEmitTargetSchema  = {
	id: 'getGuestEmitTarget',
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
	            /** . */
	            'guestId': {
	                type: 'id',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(getGuestEmitTargetSchema)

export default getGuestEmitTargetSchema
