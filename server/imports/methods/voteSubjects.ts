import { Meteor } from 'meteor/meteor';

import { voteSubjects } from '../../../imports/collections/voteSubjects';
import { voteSubject } from '../../../imports/models/voteSubject';

Meteor.methods({
  addVoteSubject(newVoteSubject: voteSubject) {
    voteSubjects.insert(newVoteSubject);
  },

  updateVoteSubject(modifiedVoteSubject: voteSubject) {
    voteSubjects.update(modifiedVoteSubject._id, { $set: modifiedVoteSubject } );
  },
  
  removeVoteSubject(voteSubjectID: string) {
    voteSubjects.remove( { _id: { $eq: voteSubjectID } } );
  }

});
