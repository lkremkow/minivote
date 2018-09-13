import { MongoObservable } from 'meteor-rxjs';

import { votableItem } from '../models/votableItem';

// VotableItems is the name of the Collection in Mongo DB
export const votableItems = new MongoObservable.Collection<votableItem>('VotableItems');