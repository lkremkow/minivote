import { Meteor } from 'meteor/meteor';

import { voters } from '../../../imports/collections/voters';
import { voter } from '../../../imports/models/voter';

Meteor.methods({
  addVoter(newVoter: voter) {
    voters.insert(newVoter);
  },

  updateVoter(modifiedVoter: voter) {
    voters.update(modifiedVoter._id, { $set: modifiedVoter } );
  },
  
  removeVoter(_id: string) {
    voters.remove( {_id} )
  },

  voterLogin(activeVoter: voter): void {
    let timeNow = new Date();
    let currentVoters = voters.findOne(   {
      $and: [
             { 'voter_id' : activeVoter.voter_id },
             { 'secret' : activeVoter.secret }
           ]
    });
    if (currentVoters === undefined) {
      //login failed, nothing in MongoDB
    } else {
      if (currentVoters._id === undefined) {
        //login failed, something in MongoDB, but not what we need
      } else {
        //login success
        activeVoter.expires = timeNow.valueOf() + 3600000;
        voters.update(currentVoters._id, { $set: activeVoter } );
      };
    };
  }  
});
