import { Meteor } from 'meteor/meteor';

import { votableItems } from '../../../imports/collections/votableItems';
import { votableItem } from '../../../imports/models/votableItem';

Meteor.publish('allVotableItems', function() {
  return votableItems.find({});
});
