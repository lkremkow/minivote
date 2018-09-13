import { Meteor } from 'meteor/meteor';

import { votingEvents } from '../../../imports/collections/votingEvents';
import { votingEvent } from '../../../imports/models/votingEvent';

Meteor.methods({
  addVotingEvent(newVotingEvent: votingEvent) {
    votingEvents.insert(newVotingEvent);
  },

  updateVotingEvent(modifiedVotingEvent: votingEvent) {
    votingEvents.update(modifiedVotingEvent._id, { $set: modifiedVotingEvent } );
  },
  
  removeVotingEvent(votingEventID: string) {
    votingEvents.remove( { _id: { $eq: votingEventID } } );
  }

});
