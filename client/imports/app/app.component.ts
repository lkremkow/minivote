import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalDataService } from '../../../imports/global/globaldata.service';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: [ 'app.component.scss' ]
})
export class AppComponent {
  session_id: string;
  
  local_browser_storage: Storage;
  local_session_storage: Storage;

  local_storage_session_id: string;

  constructor(private globalData: GlobalDataService) {
    if ( this.globalData.shareObj['session_id'] === undefined ) {
      // console.log("no session id currenlty set, checking local storage");

      this.local_browser_storage = window.localStorage;
      this.local_session_storage = window.sessionStorage;
      this.local_storage_session_id = this.local_browser_storage.getItem("session_id");

      if (this.local_storage_session_id === undefined) {
        // console.log("no session id string in local storage, setting it");
        this.generateSessionID();
      } else {
        if ( (this.local_storage_session_id === null) || (isNaN(parseInt(this.local_storage_session_id))) ) {
          // console.log("session id string from local storage is null or not a number, setting it");
          this.generateSessionID();
        } else {
          this.globalData.shareObj['session_id'] = this.local_storage_session_id;
          this.session_id = this.globalData.shareObj['session_id'];
          // console.log("was able to read session id string from local storage:", this.session_id.toString());
        };
      };
    } else {
      this.session_id = this.globalData.shareObj['session_id'];
      // console.log("session id already set, not checking local storage: ", this.session_id);
    };

  };

  private generateSessionID(): void {
    // Birthday Paradox
    // checking likely hood of collision
    // probability of 500 attendees having different ID is 99.9998%
    // https://instacalc.com/28845
    this.session_id = Math.trunc(Math.random() * 100000000000).toString();
    this.globalData.shareObj['session_id'] = this.session_id;
    this.local_browser_storage.setItem('session_id', this.session_id);
    // this.local_session_storage.setItem('session_id', this.session_id.toString());
  };
}
