import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'about',
  templateUrl: 'about.html',
  styleUrls: ['about.scss']
})

export class AboutComponent {

  voter_id: string;
  voting_event_id: string;

  local_browser_storage: Storage;
  local_session_storage: Storage;


  constructor() {
    this.local_browser_storage = window.localStorage;
    this.local_session_storage = window.sessionStorage;
  };

  ngOnInit() {
    this.voter_id = this.local_browser_storage.getItem("session_id");
    this.voting_event_id = this.local_session_storage.getItem("voting_event_id");

    if (this.voter_id === null) {
      this.voter_id = "not set";
    };
    if (this.voting_event_id === null) {
      this.voting_event_id = "not set";
    };

  };

  private reset_voter_id() {
    this.local_browser_storage.removeItem("session_id");
    this.voter_id = "not set";
  };

  private reset_voting_event_id() {
    this.local_session_storage.removeItem("voting_event_id");
    this.voting_event_id = "not set";
  };

  private reset_both() {
    this.reset_voter_id();
    this.reset_voting_event_id();
  };

};
