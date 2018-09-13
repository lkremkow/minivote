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

import { votableItems } from '../../../../imports/collections/votableItems';
import { votableItem } from '../../../../imports/models/votableItem';

@Component({
  selector: 'subject-result',
  templateUrl: 'subject-result.html',
  styleUrls: ['subject-result.scss']
})

export class SubjectResult implements OnInit, OnDestroy {

  @Input("voteEventId") voting_event_id: string = null;
  
  voter_id: string;

  local_browser_storage: Storage;
  local_session_storage: Storage;

  vote_subjects_subscription: Subscription;
  vote_subjects: Observable<voteSubject[]>;

  scope_subscription: Subscription;
  votable_items_of_scope: Observable<votableItem[]>;

  most_likely_subscription: Subscription;
  votable_items_of_most_likely: Observable<votableItem[]>;
  another_votable_items_of_most_likely: Observable<votableItem[]>;

  most_damage_subscription: Subscription;
  votable_items_of_most_damage: Observable<votableItem[]>;

  risks_addressed_subscription: Subscription;
  votable_items_of_risks_addressed: Observable<votableItem[]>;

  most_risk_subscription: Subscription;
  // most_risk_obs: Observable<[votableItem[], votableItem[]]>;
  most_risk_obs: Observable<votableItem[]>;
  // most_risk_obs: Observable<string>;
  most_likely_subscription_of_most_risk: Subscription;
  votable_items_of_most_likely_of_most_risk: Observable<votableItem[]>;
  most_damage_subscription_of_most_risk: Subscription;
  votable_items_of_most_damage_of_most_risk: Observable<votableItem[]>;

  best_solutions_subscription: Subscription;
  best_solutions_obs: Observable<votableItem[]>;

  scope_subject_id: string;
  most_likely_subject_id: string;
  most_damage_subject_id: string;
  risks_addressed_subject_id: string;
  best_solutions_subject_id: string;

  constructor() {
    // console.log("subject results constructor called");

    this.voter_id = null;

    this.scope_subject_id = null;
    this.most_likely_subject_id = null;
    this.most_damage_subject_id = null;
    this.risks_addressed_subject_id = null;
    this.best_solutions_subject_id = null;

    this.local_browser_storage = window.localStorage;
    this.local_session_storage = window.sessionStorage;
  };


  ngOnInit() {
    // console.log("subject results OnInit called");

    this.voter_id = this.local_browser_storage.getItem("session_id");

    if (( this.voter_id !== null ) && ( this.voting_event_id !== null )) {
      // this.fetchVoteSubjects();
    };

    this.vote_subjects_subscription = MeteorObservable.subscribe('allVoteSubjects').subscribe(() => {
      this.vote_subjects = voteSubjects.find(
        // { $and: [
        //   { voting_event_id: { $eq: this.voting_event_id } },
        //   { show_results: { $eq: true } }
        // ]}
        { voting_event_id: { $eq: this.voting_event_id } }
        );
        this.vote_subjects.forEach((found_vote_subject)=>{
          if (found_vote_subject['question_number'] === 1) {
            this.scope_subject_id = found_vote_subject['_id'];
            // console.log("the scope, question 1, is vote subject id", found_vote_subject['_id']);
            this.updateScope();
            
          } else if (found_vote_subject['question_number'] === 2) {
            this.most_likely_subject_id = found_vote_subject['_id'];
            // console.log("the most likely, question 2, is vote subject id", found_vote_subject['_id']);
            this.updateMostLikely();

          } else if (found_vote_subject['question_number'] === 3) {
            this.most_damage_subject_id = found_vote_subject['_id'];
            // console.log("the most damage, question 3, is vote subject id", found_vote_subject['_id']);
            this.updateMostDamage();

          } else if (found_vote_subject['question_number'] === 4) {
            this.risks_addressed_subject_id = found_vote_subject['_id'];
            // console.log("risks that will be addressed, question 4, is vote subject id", found_vote_subject['_id']);
            this.updateRisksAddressed();

          } else if (found_vote_subject['question_number'] === 5) {
            this.best_solutions_subject_id = found_vote_subject['_id'];
            // console.log("risks that will be addressed, question 4, is vote subject id", found_vote_subject['_id']);
            this.updateBestSolutions();

          };

        });

    });

    this.updateMostRisk();

  };

  ngOnDestroy() {
    // console.log("subject results OnDestroy called");

    if (this.vote_subjects_subscription) {
      this.vote_subjects_subscription.unsubscribe();
    };

    if (this.scope_subscription) {
      this.scope_subscription.unsubscribe();
    };

    if (this.most_likely_subscription) {
      this.most_likely_subscription.unsubscribe();
    };

    if (this.most_damage_subscription) {
      this.most_damage_subscription.unsubscribe();
    };

    if (this.risks_addressed_subscription) {
      this.risks_addressed_subscription.unsubscribe();
    };

    if (this.most_risk_subscription) {
      this.most_risk_subscription.unsubscribe();
    };

    if (this.most_likely_subscription_of_most_risk) {
      this.most_likely_subscription_of_most_risk.unsubscribe();
    };
    
    if (this.most_damage_subscription_of_most_risk) {
      this.most_damage_subscription_of_most_risk.unsubscribe();
    };
    
    if (this.best_solutions_subscription) {
      this.best_solutions_subscription.unsubscribe();
    };     

  };

  private updateScope(): void {
    // console.log("subject results updateScope called");
    // console.log("using this id to find votable items:", this.scope_subject_id);

    this.scope_subscription = MeteorObservable.subscribe('allVotableItems').subscribe(() => {
      this.votable_items_of_scope = votableItems.find(
        { $and: [
          { vote_subject_id: { $eq: this.scope_subject_id } },
          { vote_score: { $gt: 0 } }
        ]},
        { sort:
          { vote_score: -1, title: 1 }
        });
    });
  };

  private updateMostLikely(): void {
    // console.log("subject results updateMostLikely called");
    // console.log("using this id to find votable items:", this.most_likely_subject_id);

    this.most_likely_subscription = MeteorObservable.subscribe('allVotableItems').subscribe(() => {
      this.votable_items_of_most_likely = votableItems.find(
        { $and: [
          { vote_subject_id: { $eq: this.most_likely_subject_id } },
          { vote_score: { $gt: 0 } }
        ]},
        { sort:
          { vote_score: -1, title: 1 }
      });
      // this.votable_items_of_most_likely.forEach(()=>{});
      // this.votable_items_of_most_likely.subscribe(()=>{console.log("votable_items_of_most_likely changed")});

    });
  };

  private updateMostDamage(): void {
    // console.log("subject results updateMostDamage called");
    // console.log("using this id to find votable items:", this.most_likely_subject_id);

    this.most_damage_subscription = MeteorObservable.subscribe('allVotableItems').subscribe(() => {
      this.votable_items_of_most_damage = votableItems.find(
        { $and: [
          { vote_subject_id: { $eq: this.most_damage_subject_id } },
          { vote_score: { $gt: 0 } }
        ]},
        { sort:
          { vote_score: -1, title: 1 }
      });
    });
  };

  private updateMostRisk(): void {
    // console.log("subject results updateMostRisk called");

    this.most_likely_subscription_of_most_risk = MeteorObservable.subscribe('allVotableItems').subscribe(() => {
      this.votable_items_of_most_likely_of_most_risk = votableItems.find(
        { $and: [
          { vote_subject_id: { $eq: this.most_likely_subject_id } },
          { vote_score: { $gt: 0 } }
        ]},
        { sort:
          { question_family_id: 1 }
      });

      this.votable_items_of_most_damage_of_most_risk = votableItems.find(
        { $and: [
          { vote_subject_id: { $eq: this.most_damage_subject_id } },
          { vote_score: { $gt: 0 } }
        ]},
        { sort:
          { question_family_id: 1 }
      });

      this.most_risk_obs = Observable.zip(this.votable_items_of_most_likely_of_most_risk, this.votable_items_of_most_damage_of_most_risk,
        (s1, s2)=>{
          // console.log("s1[0]", s1[0]);
          // console.log("s2[0]", s2[0]);
          let array_counter_max: number = 0;

          if (s1.length !== s2.length) {
            // console.log("the two arrays are not the same length");
            // console.log(s1);
            // console.log(s2);
            if (s1.length > s2.length) {
              array_counter_max = s2.length;
            } else if (s2.length > s1.length) {
              array_counter_max = s1.length;
            };
          } else if (s1.length === s2.length) {
            // console.log("the two arrays are now the same length");
            array_counter_max = s1.length;
            array_counter_max = s2.length;
          };
          var most_risk_array: votableItem[] = [];
          for (let array_counter = 0; array_counter < array_counter_max; array_counter++) {
            // console.log("s1[array_counter].vote_score", s1[array_counter].vote_score);
            // console.log("s2[array_counter].vote_score", s2[array_counter].vote_score);
            // console.log("new total:", s1[array_counter].vote_score + s2[array_counter].vote_score);
            if (s1[array_counter].question_family_id === s2[array_counter].question_family_id) {
              most_risk_array.push({
                vote_subject_id: s1[array_counter].vote_subject_id,
                title: s1[array_counter].title,
                description: s1[array_counter].description,
                question_family_id: s1[array_counter].question_family_id,
                author: s1[array_counter].author,
                vote_score: s1[array_counter].vote_score + s2[array_counter].vote_score,
                modified_on: 0
              });
              // console.log("same questions - family ids match - pushed");
            } else {
              // console.log("not the same questions - family ids don't match - skipping");
            };
          };

          // console.log("new:", most_risk_array);
          most_risk_array.sort((value_one, value_two)=> { return value_two.vote_score - value_one.vote_score} );
          return most_risk_array;

        });
      // this.most_risk_subscription = this.most_risk_obs.subscribe( (xz)=>{console.log("most_risk_subscription created:") } );
  
    });

  };  

  private updateRisksAddressed(): void {
    // console.log("subject results updateTopicsAdderssed called");
    // console.log("using this id to find votable items:", this.risks_addressed_subject_id);

    this.risks_addressed_subscription = MeteorObservable.subscribe('allVotableItems').subscribe(() => {
      this.votable_items_of_risks_addressed = votableItems.find(
        { $and: [
          { vote_subject_id: { $eq: this.risks_addressed_subject_id } },
          { vote_score: { $gt: 0 } }
        ]},
        { sort:
          { vote_score: -1, title: 1 }
        });
    });
  };

  private updateBestSolutions(): void {
    // console.log("subject results updateBestSolutions called");
    // console.log("using this id to find votable items:", this.best_solutions_subject_id);

    this.best_solutions_subscription = MeteorObservable.subscribe('allVotableItems').subscribe(() => {
      this.best_solutions_obs = votableItems.find(
        { $and: [
          { vote_subject_id: { $eq: this.best_solutions_subject_id } },
          { vote_score: { $gt: 0 } }
        ]},
        { sort:
          { vote_score: -1, title: 1 }
        });
    });
  }

};