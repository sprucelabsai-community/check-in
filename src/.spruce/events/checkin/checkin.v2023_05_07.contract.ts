import '#spruce/permissions/permissions.types'
import { buildEventContract } from '@sprucelabs/mercury-types'
import checkinEmitTargetAndPayloadSchema from '#spruce/schemas/checkin/v2023_05_07/checkinEmitTargetAndPayload.schema'
import checkinResponsePayloadSchema from '#spruce/schemas/checkin/v2023_05_07/checkinResponsePayload.schema'

const checkinEventContract = buildEventContract({
	eventSignatures: {
		'checkin.checkin::v2023_05_07': {
			emitPermissions: {
				contractId: 'checkin.checkin',
				permissionIdsAny: ['can-checkin-self'],
			},

			emitPayloadSchema: checkinEmitTargetAndPayloadSchema,
			responsePayloadSchema: checkinResponsePayloadSchema,
		},
	},
})
export default checkinEventContract

export type CheckinEventContract = typeof checkinEventContract
