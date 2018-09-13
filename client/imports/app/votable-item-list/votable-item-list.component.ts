import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';

import { votableItems } from '../../../../imports/collections/votableItems';
import { votableItem } from '../../../../imports/models/votableItem';

import { voter } from '../../../../imports/models/voter';

import { votes } from '../../../../imports/collections/votes';
import { vote } from '../../../../imports/models/vote';

import { GlobalDataService } from '../../../../imports/global/globaldata.service';

@Component({
  selector: 'votable-item-list',
  templateUrl: 'votable-item-list.html',
  styleUrls: ['votable-item-list.scss']
})

export class VotableItemList implements OnInit, OnDestroy {

  @Input("voterEditable") voter_editable: string = null;

  voter_id: string;
  voting_event_id: string;

  allVotableItems: Observable<votableItem[]>;
  allVotableItemsArray: votableItem[];
  
  votableItemSubscription: Subscription;
  anotherVotableItemSubscription: Subscription;

  votesCastSubscription: Subscription;
  votesCast: Observable<vote[]>;

  validLogin: Observable<voter[]>;
  loginSubscription: Subscription;

  item_list_sorting_options: string[];
  selected_sorting_option: string;

  local_browser_storage: Storage;
  local_session_storage: Storage;

  @Input("voteSubjectID") voting_subject_id: string = null;

  constructor(private globalData: GlobalDataService) {
    this.item_list_sorting_options = ['title', 'most votes', 'newset first'];
    this.selected_sorting_option = this.item_list_sorting_options[0];
  
    this.local_browser_storage = window.localStorage;
    this.local_session_storage = window.sessionStorage;

  };

  ngOnInit() {
    this.voter_id = this.local_browser_storage.getItem("session_id");
    this.voting_event_id = this.local_session_storage.getItem("voting_event_id");
    
    this.fetchVotableItems();
    this.fetchRecordedVotes();
  };

  ngOnDestroy() {
    if (this.votableItemSubscription) {
      this.votableItemSubscription.unsubscribe();
    };
    if (this.anotherVotableItemSubscription) {
      this.anotherVotableItemSubscription.unsubscribe();
    };
    if (this.votesCastSubscription) {
      this.votesCastSubscription.unsubscribe();
    };    
  };

  removeVotableItem(votable_item_id: string) {
    Meteor.call('removeVotableItem', votable_item_id);
  }

  fetchVotableItems(): void {
    // console.log("selected sorting option:", this.selected_sorting_option);
    this.votableItemSubscription = MeteorObservable.subscribe('allVotableItems').subscribe(() => {
      // this.allVotableItems = votableItems.find({}).fetch();
      // if (this.selected_sorting_option === 'title') {
      //   this.allVotableItems = votableItems.find({ vote_subject_id: { $eq: this.voting_subject_id } }, {sort: { title: 1, vote_score: 1, modified_on: 1 } });
      // } else if (this.selected_sorting_option === 'most votes') {
      //   this.allVotableItems = votableItems.find({ vote_subject_id: { $eq: this.voting_subject_id } }, {sort: { vote_score: -1, title: 1, modified_on: 1 } });
      // } else if (this.selected_sorting_option === 'newset first') {
      // this.allVotableItems = votableItems.find({ vote_subject_id: { $eq: this.voting_subject_id } }, {sort: { modified_on: -1, title: 1, vote_score: -1} });
      this.allVotableItems = votableItems.find({ vote_subject_id: { $eq: this.voting_subject_id } }, {sort: { title: 1, question_family_id: 1} });

      // this.anotherVotableItemSubscription = this.allVotableItems.subscribe( (val) => {
      //   this.allVotableItemsArray = val;
      //   console.log("found " + val.length + " votable items");
      //   if (val.length > 0) {
      //   };
      //   console.log(this.allVotableItemsArray[0].title)
      // });
    });
  };

  fetchRecordedVotes(): void {
    this.votesCastSubscription = MeteorObservable.subscribe('votesCast').subscribe(() => {
      this.votesCast = votes.find({ voter_id: { $eq: this.voter_id } } );
    });    
  };

  voteUp(votable_item_id_arg: string, vote_subject_id_arg: string): void {
    Meteor.call('castVote', "up", votable_item_id_arg, this.voter_id, vote_subject_id_arg);
  };

  voteNeutral(votable_item_id: string, vote_subject_id_arg: string): void {
    Meteor.call('castVote', "neutral", votable_item_id, this.voter_id, vote_subject_id_arg);
  };

  voteDown(votable_item_id: string, vote_subject_id_arg: string): void {
    Meteor.call('castVote', "down", votable_item_id, this.voter_id, vote_subject_id_arg);
  };


}
