import '#spruce/permissions/permissions.types'
import { buildEventContract } from '@sprucelabs/mercury-types'
import listRoleCapabilitiesEmitTargetAndPayloadSchema from '#spruce/schemas/appointments/v2021_06_23/listRoleCapabilitiesEmitTargetAndPayload.schema'
import listRoleCapabilitiesResponsePayloadSchema from '#spruce/schemas/appointments/v2021_06_23/listRoleCapabilitiesResponsePayload.schema'

const listRoleCapabilitiesEventContract = buildEventContract({
	eventSignatures: {
		'appointments.list-role-capabilities::v2021_06_23': {
			emitPermissions: {
				contractId: 'appointments.management',
				permissionIdsAny: ['can-list-role-capabilities'],
			},

			emitPayloadSchema: listRoleCapabilitiesEmitTargetAndPayloadSchema,
			responsePayloadSchema: listRoleCapabilitiesResponsePayloadSchema,
		},
	},
})
export default listRoleCapabilitiesEventContract

export type ListRoleCapabilitiesEventContract =
	typeof listRoleCapabilitiesEventContract
