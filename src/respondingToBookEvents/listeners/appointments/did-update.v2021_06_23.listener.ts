import { SkillEventContract } from '@sprucelabs/mercury-types'
import {
	SpruceEvent,
	SpruceEventResponse,
} from '@sprucelabs/spruce-event-utils'
import { SpruceSchemas } from '#spruce/schemas/schemas.types'

export default async (
	event: SpruceEvent<SkillEventContract, EmitPayload>
): SpruceEventResponse => {
	const { handleAppointmentChange, payload } = event
	const { appointment } = payload
	await handleAppointmentChange(appointment)
}

type EmitPayload =
	SpruceSchemas.Appointments.v2021_06_23.DidUpdateEmitTargetAndPayload
