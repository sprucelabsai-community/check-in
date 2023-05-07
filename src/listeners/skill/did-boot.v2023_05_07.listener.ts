import {
	SpruceEvent,
	SpruceEventResponse,
} from '@sprucelabs/spruce-event-utils'

export default async (event: SpruceEvent): SpruceEventResponse => {
	const { skill } = event

	skill.updateContext('checkin', async () => {
		return ' aoue '
	})
}
