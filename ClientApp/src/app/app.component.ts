import { Component } from '@angular/core';
import '@fortawesome/fontawesome-free/js/all.js';
import { filter } from 'rxjs/operators';
import { OAuthService, OAuthEvent, OAuthSuccessEvent } from 'angular-oauth2-oidc';
import { UnsubscribeOnDestroyAdapter } from 'src/services/unsubscribe-adapter';
import { MatSnackBar } from '@angular/material/snack-bar';

import { authConfig } from './auth.config';
import { UserDataService } from 'src/services/user-data.service';
import { HubService } from 'src/services/hub.service';
import { InfoService } from 'src/services/info.service';
import { EventsService } from 'src/services/events.service';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends UnsubscribeOnDestroyAdapter {

  constructor(
    private oauthSrc: OAuthService,
    private eventsSrc: EventsService,
    private accountSrc: AccountService,
    private snackBar: MatSnackBar,
    // need to be injected in order to sub. to event token_received
    private infoSrc: InfoService,
    private hubSrc: HubService,
    private dataSrc: UserDataService) {
      super();
      this.configureWithNewConfigApi();
  }

  private configureWithNewConfigApi() {
    this.oauthSrc.configure(authConfig);
    this.oauthSrc.setStorage(localStorage);

    this.oauthSrc.loadDiscoveryDocument()
      .then((event: OAuthSuccessEvent) => {
        this.eventsSrc.DiscoveryDocLoaded.emit(event);
        this.refreshTokensOnReload(event);
      })
      .catch(err => this.eventsSrc.ServerNotResponding.emit({err, customMsg: ''}));

    this.oauthSrc.setupAutomaticSilentRefresh();
    this.subs.sink = this.oauthSrc.events
      .pipe(filter((event) => this.isSignInResponse(event)))
      .subscribe(() => {
        localStorage.setItem('code_flow_redirect', 'false');
        this.eventsSrc.TokenReceived.emit(this.oauthSrc.getAccessToken());
      });

    this.subs.sink = this.eventsSrc.ServerNotResponding
      .subscribe((resp: {err: any, customMsg: string}) => {
        if (!environment.production) {
          console.error(resp.err);
        }
        this.showErrorMessage(resp.customMsg);
      });

    // if (!environment.production) {
    //   this.subs.sink = this.oauthSrc.events
    //       .subscribe((event) => this.logOAuthEvents(event));
    // }
  }

  private refreshTokensOnReload(event: OAuthSuccessEvent): void {
    if (this.isReload) {
      if (this.oauthSrc.getRefreshToken() !== null) {
        this.oauthSrc.refreshToken()
          .then(() =>
            this.eventsSrc.TokenReceived.emit(this.oauthSrc.getAccessToken()));
      }
    }
  }

  private get isReload(): boolean {
    const isRedirect = localStorage.getItem('code_flow_redirect');
    return isRedirect !== 'true';
  }

  private isSignInResponse(event: OAuthEvent): boolean {
    return event.type === 'token_received' &&
      (
        this.accountSrc.SignInRequest.value ||
        (localStorage.getItem('code_flow_redirect') === 'true')
      );
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
