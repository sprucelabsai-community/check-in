import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const exportEmitTargetSchema: SpruceSchemas.Appointments.v2021_06_23.ExportEmitTargetSchema  = {
	id: 'exportEmitTarget',
	version: 'v2021_06_23',
	namespace: 'Appointments',
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

SchemaRegistry.getInstance().trackSchema(exportEmitTargetSchema)

export default exportEmitTargetSchema
