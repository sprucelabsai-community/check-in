import { buildPermissionContract } from '@sprucelabs/mercury-types'

const checkinPermissions = buildPermissionContract({
	id: 'checkin',
	name: 'checkin',
	description: '',
	requireAllPermissions: false,
	permissions: [
		{
			id: 'can-get-guest-details',
			name: 'Can get guest details',
			defaults: {
				owner: {
					default: true,
				},
				manager: {
					default: true,
				},
				groupManager: {
					default: true,
				},
				teammate: {
					default: true,
				},
			},
			requireAllStatuses: false,
		},
	],
})

export default checkinPermissions
