import { SpruceSchemas } from '@sprucelabs/spruce-core-schemas'

export type ListAppointment =
	SpruceSchemas.Appointments.v2021_06_23.ListAppointment
export type Appointment = SpruceSchemas.Appointments.v2021_06_23.Appointment
export type DidBookAppointment =
	SpruceSchemas.Appointments.v2021_06_23.DidBookAppointment

declare module '@sprucelabs/spruce-skill-utils/build/types/skill.types' {
	interface SkillContext {
		checkin: (options: CheckinOptions) => Promise<string>
		handleAppointmentChange: (appointment: DidBookAppointment) => Promise<void>
	}
}

export type CheckinOptions = {
	locationId: string
	phone: string
}
