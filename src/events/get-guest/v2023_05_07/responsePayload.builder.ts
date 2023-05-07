import { buildSchema } from '@sprucelabs/schema'
import { personSchema } from '@sprucelabs/spruce-core-schemas'

const getGuestResponsePayloadBuilder = buildSchema({
	id: 'getGuestResponsePayload',
	fields: {
		guest: {
			type: 'schema',
			isRequired: true,
			options: {
				schema: personSchema,
			},
		},
	},
})

export default getGuestResponsePayloadBuilder
