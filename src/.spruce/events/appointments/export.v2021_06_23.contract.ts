import '#spruce/permissions/permissions.types'
import { buildEventContract } from '@sprucelabs/mercury-types'
import exportEmitTargetAndPayloadSchema from '#spruce/schemas/appointments/v2021_06_23/exportEmitTargetAndPayload.schema'

const exportEventContract = buildEventContract({
	eventSignatures: {
		'appointments.export::v2021_06_23': {
			emitPermissions: {
				contractId: 'appointments.appointments',
				permissionIdsAny: ['can-export-appointments'],
			},

			emitPayloadSchema: exportEmitTargetAndPayloadSchema,
		},
	},
})
export default exportEventContract

export type ExportEventContract = typeof exportEventContract
