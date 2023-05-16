import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const trackedAppointmentSchema: SpruceSchemas.Checkin.v2023_05_15.TrackedAppointmentSchema  = {
	id: 'trackedAppointment',
	version: 'v2023_05_15',
	namespace: 'Checkin',
	name: 'Tracked Appointment',
	    fields: {
	            /** . */
	            'id': {
	                type: 'id',
	                isRequired: true,
	                options: undefined
	            },
	            /** . */
	            'statuses': {
	                type: 'text',
	                isRequired: true,
	                isArray: true,
	                minArrayLength: 0,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(trackedAppointmentSchema)

export default trackedAppointmentSchema
