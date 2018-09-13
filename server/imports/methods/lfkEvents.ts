import { Meteor } from 'meteor/meteor';

import { lfkEvents } from '../../../imports/collections/lfkEvents';
import { lfkEvent } from '../../../imports/models/lfkEvent';

Meteor.methods({
  addEvent(newEvent: lfkEvent) {
    lfkEvents.insert(newEvent);
  },
  updateEvent(modifiedEvent: lfkEvent) {
    lfkEvents.update(modifiedEvent._id, { $set: modifiedEvent } );
  },
  removeEvent(_id: string) {
    lfkEvents.remove( {_id} )
  }
})
