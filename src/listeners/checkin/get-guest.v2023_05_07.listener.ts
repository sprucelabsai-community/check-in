import { SkillEventContract } from '@sprucelabs/mercury-types'
import {
	SpruceEvent,
	SpruceEventResponse,
} from '@sprucelabs/spruce-event-utils'
import { SpruceSchemas } from '#spruce/schemas/schemas.types'

export default async (
	event: SpruceEvent<SkillEventContract, EmitPayload>
): SpruceEventResponse<ResponsePayload> => {
	const { client, target } = event
	const { guestId } = target

	await client.emitAndFlattenResponses('get-person::v2020_12_25', {
		target: {
			personId: guestId,
		},
	})

	return {
		guest: {
			id: 'aoeu',
			casualName: 'aoeu',
			dateCreated: new Date().getTime(),
			phone: '555-555-0000',
		},
	}
}

type EmitPayload =
	SpruceSchemas.Checkin.v2023_05_07.GetGuestEmitTargetAndPayload

type ResponsePayload = SpruceSchemas.Checkin.v2023_05_07.GetGuestResponsePayload
