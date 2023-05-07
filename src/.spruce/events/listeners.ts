import { EventFeatureListener } from '@sprucelabs/spruce-event-utils'

const listeners: EventFeatureListener[] = [
	{
		eventName: 'get-guest',
		eventNamespace: 'checkin',
		version: 'v2023_05_07',
		callback: require('../../listeners/checkin/get-guest.v2023_05_07.listener')
			.default,
		isGlobal: require('../../listeners/checkin/get-guest.v2023_05_07.listener')
			.isGlobal,
	},
]

export default listeners
