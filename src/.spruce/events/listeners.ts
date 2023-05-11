import { EventFeatureListener } from '@sprucelabs/spruce-event-utils'

const listeners: EventFeatureListener[] = [
    {
        eventName: 'checkin',
        eventNamespace: 'checkin',
        version: 'v2023_05_07',
        callback: require('../../listeners/checkin/checkin.v2023_05_07.listener').default,
        isGlobal: require('../../listeners/checkin/checkin.v2023_05_07.listener').isGlobal,
    },
    {
        eventName: 'get-guest',
        eventNamespace: 'checkin',
        version: 'v2023_05_07',
        callback: require('../../listeners/checkin/get-guest.v2023_05_07.listener').default,
        isGlobal: require('../../listeners/checkin/get-guest.v2023_05_07.listener').isGlobal,
    },
    {
        eventName: 'did-boot',
        eventNamespace: 'skill',
        version: 'v2023_05_07',
        callback: require('../../listeners/skill/did-boot.v2023_05_07.listener').default,
        isGlobal: require('../../listeners/skill/did-boot.v2023_05_07.listener').isGlobal,
    },
]

export default listeners