import {
	AbstractStore,
	UniversalStoreOptions,
	PrepareOptions,
	PrepareResults,
} from '@sprucelabs/data-stores'
import {
	buildSchema,
	dropFields,
	makeFieldsOptional,
	SchemaValues,
	SchemaFieldNames,
} from '@sprucelabs/schema'
import trackedAppointmentSchema from '#spruce/schemas/checkin/v2023_05_15/trackedAppointment.schema'

export default class TrackedAppointmentsStore extends AbstractStore<
	FullSchema,
	CreateSchema,
	UpdateSchema,
	DatabaseSchema
> {
	public name = 'TrackedAppointments'
	protected collectionName = 'tracked_appointments'

	protected createSchema = createSchema
	protected updateSchema = updateSchema
	protected fullSchema = fullSchema
	protected databaseSchema = databaseSchema

	public static Store(
		options: TrackedAppointmentStoreOptions & UniversalStoreOptions
	) {
		return new this(options.db)
	}

	protected async willCreate(
		values: CreateTrackedAppointment
	): Promise<Omit<DatabaseTrackedAppointment, 'id'>> {
		return values
	}

	protected async willUpdate(values: UpdateTrackedAppointment) {
		return values as Partial<DatabaseTrackedAppointment>
	}

	protected async prepareRecord<
		IncludePrivateFields extends boolean,
		F extends SchemaFieldNames<FullSchema> = SchemaFieldNames<FullSchema>
	>(
		record: DatabaseTrackedAppointment,
		_options?: PrepareOptions<IncludePrivateFields, FullSchema, F>
	) {
		return record as PrepareResults<FullSchema, IncludePrivateFields>
	}
}

// The structure of the data you'll be returning from finds
const fullSchema = trackedAppointmentSchema

// The values you will accept when creating a record
const createSchema = buildSchema({
	id: 'createTrackedAppointment',
	fields: {
		...dropFields(fullSchema.fields, []),
	},
})

// The values you will accept when updating a record
const updateSchema = buildSchema({
	id: 'updateTrackedAppointment',
	fields: {
		...makeFieldsOptional(dropFields(fullSchema.fields, [])),
	},
})

// The values you will actually save to the databases (in this case, makes id required)
const databaseSchema = buildSchema({
	id: 'databaseTrackedAppointment',
	fields: {
		...fullSchema.fields,
		id: {
			type: 'id',
			isRequired: true,
		},
	},
})

type FullSchema = typeof fullSchema
type CreateSchema = typeof createSchema
type UpdateSchema = typeof updateSchema
type DatabaseSchema = typeof databaseSchema

// type TrackedAppointment = SchemaValues<FullSchema>
type CreateTrackedAppointment = SchemaValues<CreateSchema>
type UpdateTrackedAppointment = SchemaValues<UpdateSchema>
type DatabaseTrackedAppointment = SchemaValues<DatabaseSchema>
// type QueryTrackedAppointment = Partial<TrackedAppointment>

type TrackedAppointmentStoreOptions = UniversalStoreOptions
