import TrackedAppointmentsStore from '../../respondingToBookEvents/TrackedAppointments.store'

declare module '@sprucelabs/data-stores/build/types/stores.types' {
	interface StoreMap {
                trackedAppointments: TrackedAppointmentsStore
	}

	interface StoreOptionsMap {
                trackedAppointments: Omit<Parameters<typeof TrackedAppointmentsStore['Store']>[0], keyof UniversalStoreOptions>   
        }
}
