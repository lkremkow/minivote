import { Meteor } from 'meteor/meteor';

import { voteSubjects } from '../../../imports/collections/voteSubjects';
import { voteSubject } from '../../../imports/models/voteSubject';

Meteor.publish('allVoteSubjects', function() {
  return voteSubjects.find({});
});
