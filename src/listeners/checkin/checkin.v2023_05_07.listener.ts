import { SkillEventContract } from '@sprucelabs/mercury-types'
import {
	SpruceEvent,
	SpruceEventResponse,
} from '@sprucelabs/spruce-event-utils'
import { SpruceSchemas } from '#spruce/schemas/schemas.types'

export default async (
	event: SpruceEvent<SkillEventContract, EmitPayload>
): SpruceEventResponse<ResponsePayload> => {
	const { checkin, target, payload } = event
	const { locationId } = target
	const { phone } = payload

	const providerName = await checkin({
		locationId,
		phone,
	})

	return {
		providerName,
	}
}

type EmitPayload = SpruceSchemas.Checkin.v2023_05_07.CheckinEmitTargetAndPayload

type ResponsePayload = SpruceSchemas.Checkin.v2023_05_07.CheckinResponsePayload
