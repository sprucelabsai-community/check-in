import '#spruce/permissions/permissions.types'
import { buildEventContract } from '@sprucelabs/mercury-types'
import getGuestEmitTargetAndPayloadSchema from '#spruce/schemas/checkin/v2023_05_07/getGuestEmitTargetAndPayload.schema'
import getGuestResponsePayloadSchema from '#spruce/schemas/checkin/v2023_05_07/getGuestResponsePayload.schema'

const getGuestEventContract = buildEventContract({
	eventSignatures: {
		'checkin.get-guest::v2023_05_07': {
			emitPermissions: {
				contractId: 'checkin.checkin',
				permissionIdsAny: ['can-get-guest-details'],
			},

			emitPayloadSchema: getGuestEmitTargetAndPayloadSchema,
			responsePayloadSchema: getGuestResponsePayloadSchema,
		},
	},
})
export default getGuestEventContract

export type GetGuestEventContract = typeof getGuestEventContract
