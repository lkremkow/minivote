import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';

import { GlobalDataService } from '../../../../imports/global/globaldata.service';

import { votingEvents } from '../../../../imports/collections/votingEvents';
import { votingEvent } from '../../../../imports/models/votingEvent';

@Component({
  selector: 'voting-event-edit',
  templateUrl: 'voting-event-edit.html',
  styleUrls: ['voting-event-edit.scss']
})

export class VotingEventEdit implements OnInit, OnDestroy {
  session_id: number;

  voting_event: votingEvent;

  eventSubscription: Subscription;

  paramsSub: Subscription;
  votingEventID: string;

  constructor(private globalData: GlobalDataService, private route: ActivatedRoute, private router: Router) {
    if ( this.globalData.shareObj['session_id'] !== undefined ) {
      this.session_id = parseInt(this.globalData.shareObj['session_id']);
    };
    this.votingEventID = "";
    this.resetVotingEvent();
  };


  ngOnInit() {
    this.paramsSub = this.route.params.map(params => params['VotingEventID']).subscribe(arugumentvotingEventID => this.votingEventID = arugumentvotingEventID);

    if ( this.votingEventID === undefined || this.votingEventID === null ) {
      // console.log("got undefined or null event ID to look up and edit");
      this.votingEventID = "";
    } else {
      // console.log("got event ID to look up and edit: " + this.eventId);
      this.eventSubscription = MeteorObservable.subscribe('allVotingEvents').subscribe(() => {
        this.voting_event = votingEvents.findOne(this.votingEventID);
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

  private saveVotingEvent() {
    if (this.votingEventID === "") {
      Meteor.call('addVotingEvent', this.voting_event);
    } else {
      Meteor.call('updateVotingEvent', this.voting_event);      
    };
    this.router.navigate(["mgr"]);
  };

  private resetVotingEvent() {
    this.voting_event = {
      public_id: Math.trunc(Math.random() * 10000).toString(),
      title: null,
      introduction: null,
      start_time: new Date().valueOf(),
      end_time: new Date().valueOf()
    };
  };

}
