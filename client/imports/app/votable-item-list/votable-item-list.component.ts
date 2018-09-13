import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';

import { votableItems } from '../../../../imports/collections/votableItems';
import { votableItem } from '../../../../imports/models/votableItem';

import { voter } from '../../../../imports/models/voter';

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
  // allVotableItems: votableItem[];
  votableItemSubscription: Subscription;

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
  };

  ngOnDestroy() {
    if (this.votableItemSubscription) {
      this.votableItemSubscription.unsubscribe();
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
    this.allVotableItems = votableItems.find({ vote_subject_id: { $eq: this.voting_subject_id } }, {sort: { modified_on: 1, title: 1, vote_score: -1} });
      // };      
    });
  };

  voteUp(votable_item_id: string): void {
    Meteor.call('castVote', "up", votable_item_id, this.voter_id);
  };

  voteNeutral(votable_item_id: string): void {
    Meteor.call('castVote', "neutral", votable_item_id, this.voter_id);
  };

  voteDown(votable_item_id: string): void {
    Meteor.call('castVote', "down", votable_item_id, this.voter_id);
  };


}
