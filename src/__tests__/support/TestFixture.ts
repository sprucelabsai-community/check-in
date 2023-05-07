import { dateUtil } from '@sprucelabs/calendar-utils'
import { assert } from '@sprucelabs/test-utils'
import { ListAppointmentsTargetAndPayload } from './EventFaker'

export default class TestFixture {
	public assertUpcomingAppointmentstPayloadRangeIsGood(
		payload: ListAppointmentsTargetAndPayload['payload']
	) {
		assert.isBelow(payload?.afterDateTimeMs, this.minutesFromNow(-9))
		assert.isAbove(payload?.afterDateTimeMs, this.minutesFromNow(-16))
		assert.isBelow(payload?.beforeDateTimeMs, this.minutesFromNow(11))
		assert.isAbove(payload?.beforeDateTimeMs, this.minutesFromNow(9))
	}

	private minutesFromNow(minutes: number): number | null | undefined {
		return dateUtil.addMinutes(new Date().getTime(), minutes)
	}
}
