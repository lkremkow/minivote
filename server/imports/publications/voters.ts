import { Meteor } from 'meteor/meteor';

import { voters } from '../../../imports/collections/voters';
import { voter } from '../../../imports/models/voter';

Meteor.publish('allVoters', function() {
  return voters.find({});
});
