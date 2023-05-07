import { buildSchema } from '@sprucelabs/schema'

const getGuestEmitTargetBuilder = buildSchema({
	id: 'getGuestEmitTarget',
	fields: {
		locationId: {
			type: 'id',
			isRequired: true,
		},
		guestId: {
			type: 'id',
			isRequired: true,
		},
	},
})

export default getGuestEmitTargetBuilder
