import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';

import { GlobalDataService } from '../../../../imports/global/globaldata.service';

import { votingEvents } from '../../../../imports/collections/votingEvents';
import { votingEvent } from '../../../../imports/models/votingEvent';

@Component({
  selector: 'voting-event-view',
  templateUrl: 'voting-event-view.html',
  styleUrls: ['voting-event-view.scss']
})

export class VotingEventView implements OnInit, OnDestroy {
  session_id: number;

  voting_event: votingEvent;

  eventSubscription: Subscription;

  paramsSub: Subscription;
  voting_event_id: string;
  
  show_vote_event: boolean;

  constructor(private globalData: GlobalDataService, private route: ActivatedRoute, private router: Router) {
    if ( this.globalData.shareObj['session_id'] !== undefined ) {
      this.session_id = parseInt(this.globalData.shareObj['session_id']);
    };
  };


  ngOnInit() {
    this.voting_event_id = "";
    this.show_vote_event = false;

    this.paramsSub = this.route.params.map(params => params['VotingEventID']).subscribe(arugumentvotingEventID => this.voting_event_id = arugumentvotingEventID);

    if ( this.voting_event_id === undefined || this.voting_event_id === null ) {
      // console.log("got undefined or null event ID to look up and edit");
      this.voting_event_id = "";
    } else {
      // console.log("got event ID to look up and edit: " + this.eventId);
      this.eventSubscription = MeteorObservable.subscribe('allVotingEvents').subscribe(() => {
        this.voting_event = votingEvents.findOne(this.voting_event_id);
        this.show_vote_event = true;
      });
    };
    // console.log("after init voting_event_id is", this.voting_event_id);


  };

  ngOnDestroy() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    };
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    };
  };

};
