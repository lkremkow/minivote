import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';

import { votingEvents } from '../../../../imports/collections/votingEvents';
import { votingEvent } from '../../../../imports/models/votingEvent';

import { GlobalDataService } from '../../../../imports/global/globaldata.service';

@Component({
  selector: 'voting-event-list',
  templateUrl: 'voting-event-list.html',
  styleUrls: ['voting-event-list.scss']
})

export class VotingEventList implements OnInit, OnDestroy {

  all_voting_events: Observable<votingEvent[]>;

  voting_events_subscription: Subscription;

  constructor() {
  };

  ngOnInit() {
    this.fetchVotingEvents();
  };

  ngOnDestroy() {
    if (this.voting_events_subscription) {
      this.voting_events_subscription.unsubscribe();
    };
  };

  removeVotingEvent(votable_item_id: string) {
    Meteor.call('removeVotingEvent', votable_item_id);
  }

  fetchVotingEvents(): void {
    this.voting_events_subscription = MeteorObservable.subscribe('allVotingEvents').subscribe(() => {
      this.all_voting_events = votingEvents.find({});
    });
  };

};
