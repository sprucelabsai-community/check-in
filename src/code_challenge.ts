/*
This problem concerns finding a time when we can do daily recurring maintenance on a server. You are to write a function that is given the following information:
* List of times when the server is busy every day
* Duration, in minutes, of the desired maintenance window

The function should return the start time of a daily maintenance window when the server is not busy.

In pseudo-code, the function signature would look something like this:

```
  maint_window_start(busy_times, duration_mins) -> start_time
```

### Busy time input
The "busy times" should be a list of time ranges like the following expressed in minutes from midnight:
* 5 to 30 (00:05 to 00:30)
* 120 to 241 (02:00 to 04:01)
* 790 to 1015 (13:10 to 16:55)
*/

const MINUTES_IN_DAY = 60 * 24

function maint_window_start(
	busy_times: number[][],
	duration_mins: number
): number | undefined {
	const busy_times_extended = [
		...busy_times,
		[busy_times[0][0] + MINUTES_IN_DAY, busy_times[0][1] + MINUTES_IN_DAY],
	]
	for (let i = 0; i < busy_times.length; i++) {
		const thisTime = busy_times[i][1]

		if (thisTime >= MINUTES_IN_DAY) {
			return undefined
		}

		const nextTime = busy_times_extended[i + 1]?.[0]
		const diff = nextTime - thisTime

		if (diff >= duration_mins) {
			return thisTime
		}
	}

	return undefined
}

equals(maint_window_start([[0, 30]], 10), 30)
equals(maint_window_start([[0, 40]], 10), 40)
equals(
	maint_window_start(
		[
			[0, 40],
			[50, 200],
		],
		10
	),
	40
)
equals(
	maint_window_start(
		[
			[0, 40],
			[45, 200],
		],
		10
	),
	200
)
equals(
	maint_window_start(
		[
			[0, 40],
			[50, 200],
		],
		20
	),
	200
)
equals(
	maint_window_start(
		[
			[0, 40],
			[30, 200],
			[210, 250],
			[300, 320],
		],
		20
	),
	250
)
equals(
	maint_window_start(
		[
			[0, 40],
			[30, 200],
			[210, 250],
			[300, 320],
			[320, 60 * 24],
		],
		60
	),
	undefined
)
equals(
	maint_window_start(
		[
			[0, 40],
			[50, 200],
		],
		1240
	),
	200
)
equals(
	maint_window_start(
		[
			[0, 40],
			[50, 201],
		],
		1240
	),
	undefined
)
equals(
	maint_window_start(
		[
			[10, 40],
			[50, 200],
		],
		1250
	),
	200
)
equals(
	maint_window_start(
		[
			[150, 40],
			[50, 200],
			[280, 1350],
		],
		200
	),
	1350
)

function equals(actual: unknown, expected: unknown) {
	if (actual !== expected) {
		throw new Error(`Expected ${expected}, got ${actual}!`)
	}
}
