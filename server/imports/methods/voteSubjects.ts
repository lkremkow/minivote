import { Meteor } from 'meteor/meteor';

import { voteSubjects } from '../../../imports/collections/voteSubjects';
import { voteSubject } from '../../../imports/models/voteSubject';

import { votableItems } from '../../../imports/collections/votableItems';
import { votableItem } from '../../../imports/models/votableItem';

import { votes } from '../../../imports/collections/votes';
import { vote } from '../../../imports/models/vote';

Meteor.methods({
  addVoteSubject(newVoteSubject: voteSubject) {
    voteSubjects.insert(newVoteSubject);
  },

  updateVoteSubject(modifiedVoteSubject: voteSubject) {
    voteSubjects.update(modifiedVoteSubject._id, { $set: modifiedVoteSubject } );
  },

  removeVotableItemsForSubject(voteSubjectID: string) {
    votes.remove( { vote_subject_id: { $eq: voteSubjectID } } );
    votableItems.remove( { vote_subject_id: { $eq: voteSubjectID } } );
  },
  
  removeVoteSubject(voteSubjectID: string) {
    votes.remove( { vote_subject_id: { $eq: voteSubjectID } } );
    votableItems.remove( { vote_subject_id: { $eq: voteSubjectID } } );
    voteSubjects.remove( { _id: { $eq: voteSubjectID } } );
  },

  copyPreviousVotableItemsTo(voteSubjectIdToCopyVotableItemsTo: string, voter_id: string) {
    // console.log("need to copy votable items to:", voteSubjectIdToCopyVotableItemsTo);
    // console.log("copyPreviousVotableItemsTo voter_id:", voter_id);

    // fetch question number and event id for this question
    let current_vote_subject: voteSubject;
    current_vote_subject = voteSubjects.findOne( { _id: { $eq: voteSubjectIdToCopyVotableItemsTo } } );
    // console.log("need to copy votable items to:", current_vote_subject.question_text);
    // console.log("need to copy votable items to:", current_vote_subject.question_number);

    let target_question_number: number;
    let current_voting_event_id: string;
    target_question_number = current_vote_subject.question_number - 1;
    current_voting_event_id = current_vote_subject.voting_event_id;
    // console.log("target_question_number:", target_question_number);
    // console.log("current_voting_event_id:", current_voting_event_id);

    // fetch id for previous subject
    let previous_vote_subject: voteSubject;
    previous_vote_subject = voteSubjects.findOne( { $and: [
      { voting_event_id: { $eq: current_voting_event_id } },
      { question_number: { $eq: target_question_number } }
    ]});

    if (typeof previous_vote_subject != 'undefined') {
      // console.log("previous_vote_subject.question_text:", previous_vote_subject.question_text);
      // console.log("previous_vote_subject.question_number:", previous_vote_subject.question_number);
      // console.log("previous_vote_subject._id:", previous_vote_subject._id);

      // fetch all votable items for that subject id
      let VotableItemsToCopy: any;
      VotableItemsToCopy = votableItems.find( {vote_subject_id: { $eq: previous_vote_subject._id }} ).fetch();
      // console.log("number of votable items to copy:", VotableItemsToCopy.length);
      if (VotableItemsToCopy.length > 0) {
        for (let votable_item_counter = 0; votable_item_counter < VotableItemsToCopy.length; votable_item_counter++) {
          // console.log("will copy:", VotableItemsToCopy[votable_item_counter].title);
          let newVotableItem: votableItem;
          // change subject id to subject id of current subject
          newVotableItem = {
            vote_subject_id: current_vote_subject._id,
            title: VotableItemsToCopy[votable_item_counter].title,
            description: VotableItemsToCopy[votable_item_counter].description,
            question_family_id: VotableItemsToCopy[votable_item_counter].question_family_id,
            // author: VotableItemsToCopy[votable_item_counter].author,
            author: voter_id,
            vote_score: 0,
            modified_on: new Date().valueOf()
          };
          // add to votable item list
          votableItems.insert(newVotableItem);
        }
      }
    };

  }


});
