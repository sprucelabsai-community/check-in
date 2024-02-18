import '@sprucelabs/mercury-types'

declare module '@sprucelabs/mercury-types/build/types/mercury.types' {
	interface PermissionContractMap {
		'checkin.checkin': [
			'can-get-guest-details','can-checkin-self',
		]
		'appointments.management': [
			'can-configure-people-capabilities','can-configure-role-capabilities','can-list-role-capabilities','can-register-capabilities','can-get-organization-settings',
		]
		'appointments.appointments': [
			'can-hold-time','can-get-monthly-aviability','can-cancel-hold','can-book-appointment','can-create-appointment','can-list-appointments','can-list-appointments-for-others','can-update-appointment','can-listen-to-did-book','can-export-appointments',
		]
		'appointments.createServiceEmitPermissions': [
			'can-create-service',
		]
		'appointments.getCategoryEmitPermissions': [
			'can-get-category',
		]
		'appointments.syncStatusesEmitPermissions': [
			'can-high-five',
		]
		'appointments.listCategoriesEmitPermissions': [
			'can-list-categories',
		]
		'appointments.getServiceEmitPermissions': [
			'can-get-service',
		]
		'appointments.getEmitPermissions': [
			'can-get-appointment',
		]
		'appointments.createCategoryEmitPermissions': [
			'can-create-category',
		]
		'appointments.getAvailableTimesEmitPermissions': [
			'can-get-available-times',
		]
		'appointments.updateOrganizationSettingsEmitPermissions': [
			'can-save-org-settings',
		]
		'appointments.listBookedServicesEmitPermissions': [
			'can-list-booked-services',
		]
		'appointments.deleteCategoryEmitPermissions': [
			'can-delete-category',
		]
		'appointments.deleteServiceEmitPermissions': [
			'can-delete-service',
		]
		'appointments.listStatusesEmitPermissions': [
			'can-list-statuses',
		]
		'appointments.listServicesWithProvidersEmitPermissions': [
			'can-list-services-with-providers',
		]
		'appointments.updateServiceEmitPermissions': [
			'can-edit-service',
		]
		'appointments.willSendConfirmationListenPermissions': [
			'can-listen-to-will-send',
		]
		'appointments.listServicesEmitPermissions': [
			'can-list-services',
		]
		'appointments.updateCategoryEmitPermissions': [
			'can-edit-category',
		]
		'heartwood.skill-views': [
			'can-get-skill-views','can-register-skill-views','can-listen-to-did-register-skill-views','can-generate-url','can-get-skill-views','can-list-skill-views','can-get-dashboard-cards','can-get-active-theme','can-manage-organization-themes',
		]
	}
}


export interface PermissionContractMap {}