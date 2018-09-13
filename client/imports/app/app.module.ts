import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HelpComponent } from './help/help.component';
import { AboutComponent } from './about/about.component';
import { UserWelcome } from './user-welcome/user-welcome.component';
import { VotableItemEdit } from './votable-item-edit/votable-item-edit.component';
import { VotableItemList } from './votable-item-list/votable-item-list.component';
import { VotableItemResult } from './votable-item-result/votable-item-result.component';
import { VotingEventEdit } from './voting-event-edit/voting-event-edit.component';
import { VotingEventList } from './voting-event-list/voting-event-list.component';
import { VotingEventView } from './voting-event-view/voting-event-view.component';
import { VoteSubject } from './vote-subject/vote-subject.component';
import { SubjectIndex } from './subject-index/subject-index.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { GlobalDataService } from '../../../imports/global/globaldata.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: 'welcome',
        component: UserWelcome
      },
      {
        path: 'help',
        component: HelpComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'votable-item-edit/:VoteSubjectID/:VotableItemID',
        component: VotableItemEdit
      },
      {
        path: 'votable-item-edit/:VoteSubjectID',
        component: VotableItemEdit
      },      
      {
        path: 'votable-item-edit',
        component: VotableItemEdit
      },
      {
        path: 'voting-event-edit/:VotingEventID',
        component: VotingEventEdit
      },
      {
        path: 'voting-event-edit',
        component: VotingEventEdit
      },
      {
        path: 'mgr',
        component: VotingEventList
      },
      {
        path: 'voting-event-view/:VotingEventID',
        component: VotingEventView
      },      
      {
        path: 'votable-item-list',
        component: VotableItemList
      },
      // Home Page
      {
        path: '',
        redirectTo: '/welcome',
        pathMatch: 'full'
      },
      // 404 Page
      {
        path: '**',
        component: PageNotFoundComponent
      }
    ], { enableTracing: false} ),
  ],
  declarations: [
    AppComponent,
    HelpComponent,
    AboutComponent,
    UserWelcome,
    VotableItemEdit,
    VotableItemList,
    VotableItemResult,
    VotingEventEdit,
    VotingEventList,
    VotingEventView,
    VoteSubject,
    SubjectIndex,
    PageNotFoundComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    GlobalDataService
  ]
})

export class AppModule { }
