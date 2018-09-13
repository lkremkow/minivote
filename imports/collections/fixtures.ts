import { MongoObservable } from 'meteor-rxjs';

// import { School } from '../models/school';
import { Fixture } from '../models/fixture';

// export const Schools = new MongoObservable.Collection<School>('schools');
export const Fixtures = new MongoObservable.Collection<Fixture>('allFixtures');