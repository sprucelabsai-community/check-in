import { buildSchema } from '@sprucelabs/schema'

const checkinEmitPayloadBuilder = buildSchema({
	id: 'checkinEmitPayload',
	fields: {
		phone: {
			type: 'phone',
			isRequired: true,
		},
	},
})

export default checkinEmitPayloadBuilder
