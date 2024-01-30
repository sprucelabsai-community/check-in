import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const exportEmitPayloadSchema: SpruceSchemas.Appointments.v2021_06_23.ExportEmitPayloadSchema  = {
	id: 'exportEmitPayload',
	version: 'v2021_06_23',
	namespace: 'Appointments',
	name: '',
	    fields: {
	            /** . */
	            'daysBack': {
	                type: 'select',
	                isRequired: true,
	                options: {choices: [{"label":"90 days","value":"90"}],}
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(exportEmitPayloadSchema)

export default exportEmitPayloadSchema
