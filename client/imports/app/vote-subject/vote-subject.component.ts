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
  selector: 'vote-subject',
  templateUrl: 'vote-subject.html',
  styleUrls: ['vote-subject.scss']
})

export class VoteSubject implements OnInit, OnDestroy {

  @Input("votingEventID") voting_event_id: string = "";

  voter_id: string;
  
  session_id: number;

  new_vote_subject: voteSubject;

  selected_vote_subjects: Observable<voteSubject[]>;
  vote_subjects_subscription: Subscription;

  local_browser_storage: Storage;
  local_session_storage: Storage;  

  constructor(private route: ActivatedRoute, private router: Router) {
    // console.log("constructor called, voting event ID is:", this.voting_event_id);
    
    this.local_browser_storage = window.localStorage;
    this.local_session_storage = window.sessionStorage;    

  };


  ngOnInit() {
    // console.log("OnInit called, voting event ID is:", this.voting_event_id);
    this.resetNewVoteSubject();

    if ( this.voting_event_id !== "" ) {
      this.fetchVoteSubjects();
    };

    this.voter_id = this.local_browser_storage.getItem("session_id");

  };

  ngOnDestroy() {
    // console.log("OnDestroy called, voting event ID is:", this.voting_event_id);
    if (this.vote_subjects_subscription) {
      this.vote_subjects_subscription.unsubscribe();
    };
  };

  private resetNewVoteSubject() {
    this.new_vote_subject = {
      voting_event_id: this.voting_event_id,
      question_number: 0,
      question_text: null,
      question_instructions: null,
      show_question: true,
      show_results: false,
      voter_editable: true
    };
  };

  private fetchVoteSubjects(): void {
    this.vote_subjects_subscription = MeteorObservable.subscribe('allVoteSubjects').subscribe(() => {
      this.selected_vote_subjects = voteSubjects.find( { voting_event_id: { $eq: this.voting_event_id } }, {sort: { question_number: 1, question_text: 1, _id: 1 } } );
    });
  };

  private addVoteSubject() {
    // console.log("asked to add vote subject question,", this.new_vote_subject.question_text);
    Meteor.call('addVoteSubject', this.new_vote_subject);
    this.resetNewVoteSubject();
  };

  private removeVoteSubject(vote_subject_to_delete_id: string) {
    // console.log("asked to delete vote subject,", vote_subject_to_delete_id);
    Meteor.call('removeVoteSubject', vote_subject_to_delete_id);
  };

  private removeVotableItemsForSubject(vote_subject_votable_items_to_delete_id: string) {
    // console.log("asked to delete vote subject,", vote_subject_to_delete_id);
    Meteor.call('removeVotableItemsForSubject', vote_subject_votable_items_to_delete_id);
  };

  updateVotingEvent(vote_subject_to_update: voteSubject): void {
    // console.log("need to update", vote_subject_to_update._id);
    Meteor.call('updateVoteSubject', vote_subject_to_update);
  };

  copyPreviousVotableItemsTo(vote_subject_id_to_copy_votable_items_to: string, my_voter_id: string): void {
    // console.log("need to update", vote_subject_to_update._id);
    Meteor.call('copyPreviousVotableItemsTo', vote_subject_id_to_copy_votable_items_to, my_voter_id);
  };

}
