import { Meteor } from 'meteor/meteor';

import { votes } from '../../../imports/collections/votes';
import { vote } from '../../../imports/models/vote';

import { votableItems } from '../../../imports/collections/votableItems';
import { votableItem } from '../../../imports/models/votableItem';

Meteor.methods({
  castVote(vote_direction: string, votable_item_id: string, voter_id: number) {
    // console.log("user", voter_id, "voted", vote_direction, "for", votable_item_id);

    let voteToCast: vote = {
      voter_id: voter_id,
      votable_item_id: votable_item_id,
      vote: 0,
      time_cast: new Date()
    };

    if (vote_direction === 'up') {
      voteToCast.vote = 1;
    };
    if (vote_direction === 'neutral') {
      voteToCast.vote = 0;
    };
    if (vote_direction === 'down') {
      voteToCast.vote = -1;
    };

    let hasVotedAlready: vote = votes.findOne(   {
      $and: [
             { 'voter_id' : voter_id },
             { 'votable_item_id' : votable_item_id }
            ]
    });

    if (hasVotedAlready !== undefined) {
      if (hasVotedAlready !== null) {
        // console.log("has voted already record", hasVotedAlready._id);
        votes.update(hasVotedAlready._id, { $set: voteToCast } );

      } else {
        // console.log("hasVotedAlready is null");
      };

    } else {
      // console.log("hasVotedAlready is undefined");
      // console.log("registering vote");
      votes.insert(voteToCast);
    };

    updateVoteCounts();

  }

});

function updateVoteCounts(): void {
  let all_votable_items: votableItem[];
  all_votable_items = votableItems.find({}).fetch();
  
  let item_counter: number = 0;
  for (item_counter = 0; item_counter < all_votable_items.length; item_counter++) {
    let votable_item_id = all_votable_items[item_counter]._id;

    let votes_for_item: vote[];
    votes_for_item = votes.find( { votable_item_id: { $eq: votable_item_id } } ).fetch();

    all_votable_items[item_counter].vote_score = 0;

    let votes_counter: number;
    for (votes_counter = 0; votes_counter < votes_for_item.length; votes_counter++) {
      all_votable_items[item_counter].vote_score = all_votable_items[item_counter].vote_score + votes_for_item[votes_counter].vote;
    };

    votableItems.update(all_votable_items[item_counter]._id, { $set: all_votable_items[item_counter] } );

  };

};

