import { buildSchema } from '@sprucelabs/schema'

export default buildSchema({
	id: 'trackedAppointment',
	name: 'Tracked Appointment',
	fields: {
		id: {
			type: 'id',
			isRequired: true,
		},
		statuses: {
			type: 'text',
			isRequired: true,
			isArray: true,
			minArrayLength: 0,
		},
	},
})
