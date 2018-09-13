import { Meteor } from 'meteor/meteor';

import { votableItems } from '../../../imports/collections/votableItems';
import { votableItem } from '../../../imports/models/votableItem';

Meteor.methods({
  addVotableItem(newVotableItem: votableItem) {
    votableItems.insert(newVotableItem);
  },

  updateVotableItem(modifiedVotableItem: votableItem) {
    votableItems.update(modifiedVotableItem._id, { $set: modifiedVotableItem } );
  },
  
  removeVotableItem(_id: string) {
    votableItems.remove( {_id} )
  }

});
