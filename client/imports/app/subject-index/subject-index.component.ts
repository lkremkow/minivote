import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';

import { GlobalDataService } from '../../../../imports/global/globaldata.service';

import { votingEvents } from '../../../../imports/collections/votingEvents';
import { votingEvent } from '../../../../imports/models/votingEvent';

import { voteSubjects } from '../../../../imports/collections/voteSubjects';
import { voteSubject } from '../../../../imports/models/voteSubject';

@Component({
  selector: 'subject-index',
  templateUrl: 'subject-index.html',
  styleUrls: ['subject-index.scss']
})

export class SubjectIndex implements OnInit, OnDestroy {

  @Input("voteEventId") voting_event_id: string = null;
  
  voter_id: string;

  local_browser_storage: Storage;
  local_session_storage: Storage;

  new_vote_subject: voteSubject;

  selected_vote_subjects: Observable<voteSubject[]>;
  vote_subjects_subscription: Subscription;

  constructor() {
    this.voter_id = null;
    // this.voting_event_id = null;
    this.local_browser_storage = window.localStorage;
    this.local_session_storage = window.sessionStorage;
  };


  ngOnInit() {
    this.voter_id = this.local_browser_storage.getItem("session_id");
    // this.voting_event_id = this.local_browser_storage.getItem("voting_event_id");
    // this.voting_event_id = this.local_session_storage.getItem("voting_event_id");

    if (( this.voter_id !== null ) && ( this.voting_event_id !== null )) {
      this.fetchVoteSubjects();
    };

  };

  ngOnDestroy() {
    // console.log("OnDestroy called, voting event ID is:", this.voting_event_id);
    if (this.vote_subjects_subscription) {
      this.vote_subjects_subscription.unsubscribe();
    };
  };

  private fetchVoteSubjects(): void {
    this.vote_subjects_subscription = MeteorObservable.subscribe('allVoteSubjects').subscribe(() => {
      this.selected_vote_subjects = voteSubjects.find( { voting_event_id: { $eq: this.voting_event_id } }, {sort: { question_number: 1, question_text: 1, _id: 1 } } );
    });
  };

};
