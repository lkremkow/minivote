import { Meteor } from 'meteor/meteor';

import { Fixtures } from '../../../imports/collections/fixtures';
import { Fixture } from '../../../imports/models/fixture';

Meteor.methods({
  addFixture(new_fixture: Fixture) {
    Fixtures.insert(
      new_fixture
    );
  }
  // updateSchool(school_details: Fixture) {
  //   Fixtures.update(school_details._id, { $set: school_details }
  //   );
  // },
  // removeSchool(_id: string) {
  //   Fixtures.remove({
  //     _id
  //   })
  // }
})
