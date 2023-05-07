import { SpruceErrors } from "#spruce/errors/errors.types"
import { ErrorOptions as ISpruceErrorOptions} from "@sprucelabs/error"

export interface NoUpcomingAppointmentsErrorOptions extends SpruceErrors.Checkin.NoUpcomingAppointments, ISpruceErrorOptions {
	code: 'NO_UPCOMING_APPOINTMENTS'
}

type ErrorOptions =  | NoUpcomingAppointmentsErrorOptions 

export default ErrorOptions
