import {
	EventSignature,
	buildPermissionReference,
} from '@sprucelabs/mercury-types'
import '#spruce/permissions/permissions.types'
import '@sprucelabs/mercury-core-events'

type Options = Omit<
	EventSignature,
	| 'responsePayloadSchema'
	| 'emitPayloadSchema'
	| 'listenPermissionContract'
	| 'emitPermissionContract'
>

const eventOptions: Options = {
	isGlobal: false,
	emitPermissions: buildPermissionReference('checkin.checkin', [
		'can-checkin-self',
	]),
}

export default eventOptions
