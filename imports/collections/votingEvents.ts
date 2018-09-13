import { MongoObservable } from 'meteor-rxjs';

import { votingEvent } from '../models/votingEvent';

// VotingEvents is the name of the Collection in Mongo DB
// votingEvents is the name of the Observable in JavaScript
export const votingEvents = new MongoObservable.Collection<votingEvent>('VotingEvents');