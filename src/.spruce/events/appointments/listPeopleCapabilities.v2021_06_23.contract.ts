import '#spruce/permissions/permissions.types'
import { buildEventContract } from '@sprucelabs/mercury-types'
import listPeopleCapabilitiesEmitTargetAndPayloadSchema from '#spruce/schemas/appointments/v2021_06_23/listPeopleCapabilitiesEmitTargetAndPayload.schema'
import listPeopleCapabilitiesResponsePayloadSchema from '#spruce/schemas/appointments/v2021_06_23/listPeopleCapabilitiesResponsePayload.schema'

const listPeopleCapabilitiesEventContract = buildEventContract({
	eventSignatures: {
		'appointments.list-people-capabilities::v2021_06_23': {
			emitPermissions: {
				contractId: 'appointments.management',
				permissionIdsAny: ['can-configure-people-capabilities'],
			},

			emitPayloadSchema: listPeopleCapabilitiesEmitTargetAndPayloadSchema,
			responsePayloadSchema: listPeopleCapabilitiesResponsePayloadSchema,
		},
	},
})
export default listPeopleCapabilitiesEventContract

export type ListPeopleCapabilitiesEventContract =
	typeof listPeopleCapabilitiesEventContract
