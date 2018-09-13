import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';

import { GlobalDataService } from '../../../../imports/global/globaldata.service';

import { votableItems } from '../../../../imports/collections/votableItems';
import { votableItem } from '../../../../imports/models/votableItem';

@Component({
  selector: 'votable-item-edit',
  templateUrl: 'votable-item-edit.html',
  styleUrls: ['votable-item-edit.scss']
})

export class VotableItemEdit {
  voter_id: string;

  votable_item: votableItem;
  vote_subject_id: string;

  eventSubscription: Subscription;

  paramsSub: Subscription;
  votable_item_id: string;

  local_browser_storage: Storage;
  local_session_storage: Storage;

  constructor(private globalData: GlobalDataService, private route: ActivatedRoute, private router: Router) {
    this.votable_item_id = null;
    this.vote_subject_id = null;

    this.local_browser_storage = window.localStorage;
    this.local_session_storage = window.sessionStorage;
  };


  ngOnInit() {
    this.paramsSub = this.route.params.map(params => params['VoteSubjectID']).subscribe(arugument_voting_event_id => this.vote_subject_id = arugument_voting_event_id);
    this.paramsSub = this.route.params.map(params => params['VotableItemID']).subscribe(arugument_votable_item_id => this.votable_item_id = arugument_votable_item_id);

    this.voter_id = this.local_browser_storage.getItem("session_id");
    // this.voting_event_id = this.local_session_storage.getItem("voting_event_id");

    // console.log("VoteSubjectID", this.vote_subject_id);
    // console.log("VotableItemID", this.votable_item_id);

    if ( this.votable_item_id === undefined || this.votable_item_id === null ) {
      // console.log("got undefined or null event ID to look up and edit");
      this.votable_item_id = null;
      this.resetVotableItem();
    } else {
      // console.log("got event ID to look up and edit: " + this.eventId);
      this.eventSubscription = MeteorObservable.subscribe('allVotableItems').subscribe(() => {
        this.votable_item = votableItems.findOne(this.votable_item_id);
      });
    };
  };

  ngOnDestroy() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    };
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    };
  };

  private saveVotableItem() {
    if (this.votable_item_id === null) {
      // console.log("adding new votable item");
      Meteor.call('addVotableItem', this.votable_item);
    } else {
      // console.log("updating new votable item");
      this.votable_item.modified_on = new Date().valueOf();
      Meteor.call('updateVotableItem', this.votable_item);      
    };
    this.router.navigate(["/welcome"]);
  };

  private resetVotableItem() {
    this.votable_item = {
      vote_subject_id: this.vote_subject_id,
      title: null,
      description: null,
      author: this.voter_id,
      vote_score: 0,
      modified_on: new Date().valueOf()
    };
  };

}
