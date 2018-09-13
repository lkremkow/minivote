import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';

import { votingEvents } from '../../../../imports/collections/votingEvents';
import { votingEvent } from '../../../../imports/models/votingEvent';

import { GlobalDataService } from '../../../../imports/global/globaldata.service';
import { isString, isNumber } from 'util';

@Component({
  selector: 'user-welcome',
  templateUrl: 'user-welcome.html',
  styleUrls: ['user-welcome.scss']
})

export class UserWelcome implements OnInit, OnDestroy {

  voter_id: string;
  public_event_id: string;
  voting_event_id: string;

  login_message: string;

  local_browser_storage: Storage;
  local_session_storage: Storage;

  all_voting_events: votingEvent[];
  voting_events_subscription: Subscription;

  constructor(private globalData: GlobalDataService) {
    this.voter_id = null;
    this.public_event_id = null;
    this.voting_event_id = null;
    this.local_browser_storage = window.localStorage;
    this.local_session_storage = window.sessionStorage;
    this.login_message = null;
  };
  
  ngOnInit() {
    this.voter_id = this.local_browser_storage.getItem("session_id");
    this.voting_event_id = this.local_session_storage.getItem("voting_event_id");
    this.login_message = "Please enter your meeting numebr and press login."
  };

  ngOnDestroy() {
    if (this.voting_events_subscription) {
      this.voting_events_subscription.unsubscribe();
    };
  };

  private tryPublicID(): void {
    // console.log("trying to cjoin meeting numebr" + this.public_event_id + " type " + typeof this.public_event_id);

    if (this.public_event_id === undefined) {
      this.login_message = "No meeting number provided, please enter meeting number and try again.";
    } else {
      if (this.public_event_id === null) {
        this.login_message = "No meeting number provided, please enter meeting number and try again.";
      } else {
        if (Number.isInteger(parseInt(this.public_event_id))) {
          this.voting_events_subscription = MeteorObservable.subscribe('allVotingEvents').subscribe(() => {
            this.all_voting_events = votingEvents.find( { public_id: { $eq: this.public_event_id } } ).fetch();
            // console.log("meetings with this numebr: ", this.all_voting_events.length);
            if (this.all_voting_events.length === 1) {
              this.voting_event_id = this.all_voting_events[0]._id;
              this.login_message = "Meeting found.";
              this.local_session_storage.setItem('voting_event_id', this.voting_event_id);
            } else {
              this.login_message = "No meeting available by that number. Please try again.";
            };
          });          
        } else {
          this.login_message = "Invalid meeting number, please try again.";
        };
        
      };
    };

  };

};
