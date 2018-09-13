import { Meteor } from 'meteor/meteor';

import { Fixtures } from '../../../imports/collections/fixtures';
import { Fixture } from '../../../imports/models/fixture';

Meteor.publish('allFixtures', function() {
  return Fixtures.find({});
});
