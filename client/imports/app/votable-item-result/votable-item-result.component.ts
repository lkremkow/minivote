import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';

import { votableItems } from '../../../../imports/collections/votableItems';
import { votableItem } from '../../../../imports/models/votableItem';

import { GlobalDataService } from '../../../../imports/global/globaldata.service';

@Component({
  selector: 'votable-item-result',
  templateUrl: 'votable-item-result.html',
  styleUrls: ['votable-item-result.scss']
})

export class VotableItemResult implements OnInit, OnDestroy {

  @Input("voteSubjectID") voting_subject_id: string = null;

  voter_id: string;
  voting_event_id: string;

  allVotableItems: Observable<votableItem[]>;
  // allVotableItems: votableItem[];
  votableItemSubscription: Subscription;

  local_browser_storage: Storage;
  local_session_storage: Storage;

  

  constructor(private globalData: GlobalDataService) {  
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
      this.allVotableItems = votableItems.find({ vote_subject_id: { $eq: this.voting_subject_id } }, {sort: { vote_score: -1, title: 1, modified_on: 1 } });
    });
  };

};