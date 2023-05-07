import {
	SpruceEvent,
	SpruceEventResponse,
} from '@sprucelabs/spruce-event-utils'
import CheckinAgent from '../../CheckinAgent'

export default async (event: SpruceEvent): SpruceEventResponse => {
	const { skill, client } = event

	const checkinAgent = CheckinAgent.Agent({ client })

	skill.updateContext('checkin', async (options) => {
		const { locationId, phone } = options
		return checkinAgent.checkin(locationId, phone)
	})
}
