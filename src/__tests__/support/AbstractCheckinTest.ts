import { AbstractSpruceFixtureTest } from '@sprucelabs/spruce-test-fixtures'
import EventFaker from './EventFaker'
import TestFixture from './TestFixture'

export default abstract class AbstractCheckinTest extends AbstractSpruceFixtureTest {
	protected static eventFaker: EventFaker
	protected static support: TestFixture
	protected static async beforeEach() {
		await super.beforeEach()
		this.eventFaker = new EventFaker({ fakedPerson: this.fakedPerson })
		this.support = new TestFixture()
	}

	protected static get locationIds() {
		return this.fakedLocations.map((l) => l.id)
	}

	protected static get organizationIds() {
		return this.fakedOrganizations.map((l) => l.id)
	}
}
