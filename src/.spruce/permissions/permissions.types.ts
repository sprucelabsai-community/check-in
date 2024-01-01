import '@sprucelabs/mercury-types'

declare module '@sprucelabs/mercury-types/build/types/mercury.types' {
	interface PermissionContractMap {
		'checkin.checkin': [
			'can-get-guest-details','can-checkin-self',
		]
		'appointments.management': [
			'can-configure-people-capabilities','can-configure-role-capabilities','can-list-role-capabilities','can-register-capabilities','can-get-organization-settings',
		]
		'heartwood.skill-views': [
			'can-get-skill-views','can-register-skill-views','can-listen-to-did-register-skill-views','can-generate-url','can-get-skill-views','can-list-skill-views','can-get-dashboard-cards','can-get-active-theme','can-manage-organization-themes',
		]
		'appointments.appointments': [
			'can-hold-time','can-get-monthly-aviability','can-cancel-hold','can-book-appointment','can-create-appointment','can-list-appointments','can-list-appointments-for-others','can-update-appointment','can-listen-to-did-book',
		]
		'appointments.deleteServiceEmitPermissions': [
			'can-delete-service',
		]
		'appointments.getAvailableTimesEmitPermissions': [
			'can-get-available-times',
		]
		'appointments.getEmitPermissions': [
			'can-get-appointment',
		]
		'appointments.getCategoryEmitPermissions': [
			'can-get-category',
		]
		'appointments.listBookedServicesEmitPermissions': [
			'can-list-booked-services',
		]
		'appointments.listServicesEmitPermissions': [
			'can-list-services',
		]
		'appointments.getServiceEmitPermissions': [
			'can-get-service',
		]
		'appointments.listCategoriesEmitPermissions': [
			'can-list-categories',
		]
		'appointments.listServicesWithProvidersEmitPermissions': [
			'can-list-services-with-providers',
		]
		'appointments.createCategoryEmitPermissions': [
			'can-create-category',
		]
		'appointments.createServiceEmitPermissions': [
			'can-create-service',
		]
		'appointments.updateOrganizationSettingsEmitPermissions': [
			'can-save-org-settings',
		]
		'appointments.updateServiceEmitPermissions': [
			'can-edit-service',
		]
		'appointments.updateCategoryEmitPermissions': [
			'can-edit-category',
		]
		'appointments.willSendConfirmationListenPermissions': [
			'can-listen-to-will-send',
		]
		'appointments.syncStatusesEmitPermissions': [
			'can-high-five',
		]
		'appointments.listStatusesEmitPermissions': [
			'can-list-statuses',
		]
		'appointments.deleteCategoryEmitPermissions': [
			'can-delete-category',
		]
	}
}


export interface PermissionContractMap {}