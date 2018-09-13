import { MongoObservable } from 'meteor-rxjs';

import { vote } from '../models/vote';

// Votes is the name of the Collection in Mongo DB
// votes is the name of the Observable in JavaScript
export const votes = new MongoObservable.Collection<vote>('Votes');