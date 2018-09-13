import { MongoObservable } from 'meteor-rxjs';

import { lfkEvent } from '../models/lfkEvent';

export const lfkEvents = new MongoObservable.Collection<lfkEvent>('Events');