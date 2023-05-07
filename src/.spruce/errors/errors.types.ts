/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */

import { default as SchemaEntity } from '@sprucelabs/schema'
import * as SpruceSchema from '@sprucelabs/schema'





export declare namespace SpruceErrors.Checkin {

	
	export interface NoUpcomingAppointments {
		
	}

	export interface NoUpcomingAppointmentsSchema extends SpruceSchema.Schema {
		id: 'noUpcomingAppointments',
		namespace: 'Checkin',
		name: 'No upcoming appointments',
		    fields: {
		    }
	}

	export type NoUpcomingAppointmentsEntity = SchemaEntity<SpruceErrors.Checkin.NoUpcomingAppointmentsSchema>

}




