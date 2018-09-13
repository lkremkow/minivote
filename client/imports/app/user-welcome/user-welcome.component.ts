import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';

import { votingEvents } from '../../../../imports/collections/votingEvents';
import { votingEvent } from '../../../../imports/models/votingEvent';

import { isString, isNumber } from 'util';
import { forEach } from '@angular/router/src/utils/collection';

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

  // all_voting_events: votingEvent[];
  current_voting_event: Observable<votingEvent[]>;
  voting_events_subscription: Subscription;

  vote_events_subscription: Subscription;



  constructor() {
    this.voter_id = null;
    this.public_event_id = null;
    this.voting_event_id = null;
    this.local_browser_storage = window.localStorage;
    this.local_session_storage = window.sessionStorage;
    this.login_message = null;
    this.current_voting_event = null;
  };
  
  ngOnInit() {
    this.voter_id = this.local_browser_storage.getItem("session_id");
    this.voting_event_id = this.local_session_storage.getItem("voting_event_id");

    if (typeof this.voting_event_id === 'undefined') {
      // console.log("event id undefined; will try using public id");
      this.tryPublicID();
    } else {
      if (this.voting_event_id === null) {
        // console.log("event id null; will try using public id");
        this.tryPublicID();
      } else {
        if ( this.voting_event_id.length > 0 ) {
          // console.log("seem to have valid event id; will try using that");
          this.tryEventId();

        } else {
          // console.log("event id zero length; will try using public id");
          this.tryPublicID();

        };

      }

    }

  };

  ngOnDestroy() {
    if (this.voting_events_subscription) {
      this.voting_events_subscription.unsubscribe();
      // console.log("unsubscribed this.voting_events_subscription");
    };
    if (this.vote_events_subscription) {
      this.vote_events_subscription.unsubscribe();
      // console.log("unsubscribed this.vote_events_subscription");
    };
  };

  private tryEventId(): void {
    this.voting_events_subscription = MeteorObservable.subscribe('allVotingEvents').subscribe(() => {
      this.current_voting_event = votingEvents.find( { _id: { $eq: this.voting_event_id } }, { limit: 1 } );

      if (typeof this.current_voting_event === 'undefined') {
        // console.log("given event_id: ", this.voting_event_id);
        // console.log("found no records for it in DB");
        this.login_message = "No event available by that id. Please try again.";
        this.voting_event_id = null;
        this.local_session_storage.removeItem("voting_event_id");
      } else {

        if (this.current_voting_event === null) {
          this.login_message = "No meeting available by that number. Please try again.";
          // console.log("given event_id: ", this.voting_event_id);
          // console.log("found no records for it in DB");
          this.voting_event_id = null;
          this.local_session_storage.removeItem("voting_event_id");
        } else {
          this.current_voting_event.forEach((currentValue)=> {
            // console.log(currentValue);
            this.voting_event_id = currentValue['_id'];
            this.local_session_storage.setItem('voting_event_id', this.voting_event_id);
            // console.log("triggered for each, read event id from DB:", this.voting_event_id);
          });

        };

      };

    });     

  };

  private tryPublicID(): void {
    // console.log("trying to join meeting number [" + this.public_event_id + "] type [" + typeof this.public_event_id + "]");

    if (this.public_event_id === undefined) {
      this.login_message = "Please enter your meeting number and press login.";
    } else {
      if (this.public_event_id === null) {
        this.login_message = "Please enter your meeting number and press login.";
      } else {
        if (this.public_event_id.length > 0 ) {

          if (Number.isInteger(parseInt(this.public_event_id))) {
            this.voting_events_subscription = MeteorObservable.subscribe('allVotingEvents').subscribe(() => {
              this.current_voting_event = votingEvents.find( { public_id: { $eq: this.public_event_id } }, { limit: 1 } );
  
              if (typeof this.current_voting_event === 'undefined') {
                // console.log("given public_event_id: ", this.public_event_id);
                // console.log("found no records for it in DB");
                this.login_message = "No meeting available by that number. Please try again.";
              } else {
  
                if (this.current_voting_event === null) {
                  this.login_message = "No meeting available by that number. Please try again.";
                } else {
                  this.login_message = "No meeting available by that number. Please try again.";
                  // console.log("given public_event_id: ", this.public_event_id);
                  // console.log("found a record for it in DB");
                  this.current_voting_event.forEach((currentValue)=>{
                    this.login_message = "Meeting found. Joining…";
                    // console.log(currentValue);
                    this.voting_event_id = currentValue['_id'];
                    this.local_session_storage.setItem('voting_event_id', this.voting_event_id);
                    // console.log("triggered for each, read event id from DB:", this.voting_event_id);
                  });
                };
              };
  
            });          
          } else {
            this.login_message = "Not a valid meeting number: use numbers only. Please try again.";
          };          

        } else {
          this.login_message = "No meeting number provided, please enter meeting number and try again.";
        };
        
      };
    };

  };

};
