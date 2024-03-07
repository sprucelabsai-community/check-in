import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const getOrgSettingsSettingsSchema: SpruceSchemas.Appointments.v2021_06_23.GetOrgSettingsSettingsSchema  = {
	id: 'getOrgSettingsSettings',
	version: 'v2021_06_23',
	namespace: 'Appointments',
	name: '',
	    fields: {
	            /** Approval. */
	            'approvalStrategy': {
	                label: 'Approval',
	                type: 'select',
	                isRequired: true,
	                options: {choices: [{"label":"Auto-approve all appointments","value":"auto-approve"},{"label":"Require approval on all appointments","value":"required-all"},{"label":"Require approval on first appointment only","value":"required-first"}],}
	            },
	            /** Available times for guests. */
	            'guestAvailabilityInterval': {
	                label: 'Available times for guests',
	                type: 'select',
	                isRequired: true,
	                options: {choices: [{"label":"Every 15 minutes","value":"15"},{"label":"Every 30 minutes","value":"30"},{"label":"Every hour","value":"60"},{"label":"Custom","value":"custom"}],}
	            },
	            /** Require name to book. By default, a person only needs their number. Should I ask for their name too? */
	            'shouldRequireNameToBook': {
	                label: 'Require name to book',
	                type: 'boolean',
	                hint: 'By default, a person only needs their number. Should I ask for their name too?',
	                options: undefined
	            },
	            /** Fallback duration. When someone is booking and hasn't selected a service, by default I'll look for the the times each provider can do their shortest service. If you set this, I'll use this duration instead. It may make sense to set this to the duration of your most popular service. */
	            'durationWhenNoServiceSelectedMinutes': {
	                label: 'Fallback duration',
	                type: 'number',
	                hint: 'When someone is booking and hasn\'t selected a service, by default I\'ll look for the the times each provider can do their shortest service. If you set this, I\'ll use this duration instead. It may make sense to set this to the duration of your most popular service.',
	                options: undefined
	            },
	            /** Show notice. */
	            'shouldRenderGuestBookingNotice': {
	                label: 'Show notice',
	                type: 'boolean',
	                options: undefined
	            },
	            /** Notice message. This message will be shown to guests when they book an appointment. */
	            'guestBookingNoticeMessage': {
	                label: 'Notice message',
	                type: 'text',
	                hint: 'This message will be shown to guests when they book an appointment.',
	                options: undefined
	            },
	            /** Redirect URL. */
	            'guestBookingNoticeRedirect': {
	                label: 'Redirect URL',
	                type: 'text',
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(getOrgSettingsSettingsSchema)

export default getOrgSettingsSettingsSchema
