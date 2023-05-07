import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const noUpcomingAppointmentsSchema: SpruceErrors.Checkin.NoUpcomingAppointmentsSchema  = {
	id: 'noUpcomingAppointments',
	namespace: 'Checkin',
	name: 'No upcoming appointments',
	    fields: {
	    }
}

SchemaRegistry.getInstance().trackSchema(noUpcomingAppointmentsSchema)

export default noUpcomingAppointmentsSchema
