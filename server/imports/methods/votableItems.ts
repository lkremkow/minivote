import { Meteor } from 'meteor/meteor';

import { votableItems } from '../../../imports/collections/votableItems';
import { votableItem } from '../../../imports/models/votableItem';

import { votes } from '../../../imports/collections/votes';
import { vote } from '../../../imports/models/vote';

Meteor.methods({
  addVotableItem(newVotableItem: votableItem) {
    votableItems.insert(newVotableItem);
  },

  updateVotableItem(modifiedVotableItem: votableItem) {
    votableItems.update(modifiedVotableItem._id, { $set: modifiedVotableItem } );
  },
  
  removeVotableItem(_id: string) {
    votes.remove( { votable_item_id: { $eq: _id } } );
    votableItems.remove( {_id} )
  }

});
