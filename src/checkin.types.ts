import { SpruceSchemas } from '@sprucelabs/spruce-core-schemas'

export type ListAppointment =
	SpruceSchemas.Appointments.v2021_06_23.ListAppointment

declare module '@sprucelabs/spruce-skill-utils/build/types/skill.types' {
	interface SkillContext {
		checkin: (options: CheckinOptions) => Promise<string>
	}
}

export type CheckinOptions = {
	locationId: string
	phone: string
}
