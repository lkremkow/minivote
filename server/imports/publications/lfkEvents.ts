import { Meteor } from 'meteor/meteor';

import { lfkEvents } from '../../../imports/collections/lfkEvents';
import { lfkEvent } from '../../../imports/models/lfkEvent';

Meteor.publish('allEvents', function() {
  return lfkEvents.find({});
});
