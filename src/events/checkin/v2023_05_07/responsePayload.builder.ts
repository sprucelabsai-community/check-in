import { buildSchema } from '@sprucelabs/schema'

const checkinResponsePayloadBuilder = buildSchema({
	id: 'checkinResponsePayload',
	fields: {
		providerName: {
			type: 'text',
			isRequired: true,
		},
	},
})

export default checkinResponsePayloadBuilder
