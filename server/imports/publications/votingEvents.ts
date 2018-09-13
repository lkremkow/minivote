import { Meteor } from 'meteor/meteor';

import { votingEvents } from '../../../imports/collections/votingEvents';
import { votingEvent } from '../../../imports/models/votingEvent';

Meteor.publish('allVotingEvents', function() {
  return votingEvents.find({});
});
