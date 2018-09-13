import { MongoObservable } from 'meteor-rxjs';

import { voteSubject } from '../models/voteSubject';

// VoteSubjects is the name of the Collection in Mongo DB
// voteSubjects is the name of the Observable in JavaScript
export const voteSubjects = new MongoObservable.Collection<voteSubject>('VoteSubjects');