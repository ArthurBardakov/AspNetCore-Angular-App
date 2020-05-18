import { Component } from '@angular/core';
import '@fortawesome/fontawesome-free/js/all.js';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { UnsubscribeOnDestroyAdapter } from 'src/services/unsubscribe-adapter';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EventsService } from 'src/services/events.service';
import { environment } from 'src/environments/environment';
import { AppService } from 'src/services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends UnsubscribeOnDestroyAdapter {

  constructor(private appSrc: AppService,
              private oauthSrc: OAuthService,
              private eventsSrc: EventsService,
              private snackBar: MatSnackBar) {
    super();
    this.appSrc.ConfigureWithNewConfigApi();

    this.subs.sink = this.eventsSrc.ServerNotResponding
    .subscribe((resp: {err: any, customMsg: string}) => {
      if (!environment.production) {
        console.error(resp.err);
      }
      this.showErrorMessage(resp.customMsg);
    });

    // if (!environment.production) {
    //   this.subs.sink = this.oauthSrc.events
    //     .subscribe((event) => this.logOAuthEvents(event));
    // }
  }

  private showErrorMessage(customMsg: string): void {
    customMsg = customMsg === '' ? 'Some server error occured, try again later, please!' : customMsg;

    this.snackBar.open(customMsg, '', {
      duration: 3000,
      panelClass: 'snackbar_msg'
    });
  }

  private logOAuthEvents(event: OAuthEvent): void {
    console.log(event.type);
    console.log(event);
  }
}
