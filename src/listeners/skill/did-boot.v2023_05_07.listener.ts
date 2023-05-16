import {
	SpruceEvent,
	SpruceEventResponse,
} from '@sprucelabs/spruce-event-utils'
import CheckinAgent from '../../CheckinAgent'
import BookedAppointmentHandler from '../../respondingToBookEvents/BookedAppointmentHandler'

export default async (event: SpruceEvent): SpruceEventResponse => {
	const { skill, client, stores } = event

	const checkinAgent = CheckinAgent.Agent({ client })
	const handler = await BookedAppointmentHandler.Handler({
		client,
		stores,
	})

	skill.updateContext('checkin', async (options) => {
		const { locationId, phone } = options
		return checkinAgent.checkin(locationId, phone)
	})

	skill.updateContext('handleAppointmentChange', async (options) => {
		return handler.handle(options)
	})
}
