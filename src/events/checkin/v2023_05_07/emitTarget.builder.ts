import { buildSchema } from '@sprucelabs/schema'

const checkinEmitTargetBuilder = buildSchema({
	id: 'checkinEmitTarget',
	fields: {
		locationId: {
			type: 'id',
			isRequired: true,
		},
	},
})

export default checkinEmitTargetBuilder
