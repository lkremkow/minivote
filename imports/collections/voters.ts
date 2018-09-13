import { MongoObservable } from 'meteor-rxjs';

import { voter } from '../models/voter';

// Voters is the name of the Collection in Mongo DB
// voters is the name of the Observable in JavaScript
export const voters = new MongoObservable.Collection<voter>('Voters');