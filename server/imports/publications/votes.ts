import { Meteor } from 'meteor/meteor';

import { votes } from '../../../imports/collections/votes';
import { vote } from '../../../imports/models/vote';

Meteor.publish('votesCast', function() {
  return votes.find({});
});
