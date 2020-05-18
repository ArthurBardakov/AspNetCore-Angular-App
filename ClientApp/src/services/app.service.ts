import { Injectable, OnDestroy } from '@angular/core';
import { OAuthService, OAuthSuccessEvent, OAuthEvent } from 'angular-oauth2-oidc';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

import { authConfig } from 'src/app/auth.config';
import { EventsService } from './events.service';
import { InfoService } from './info.service';
import { HubService } from './hub.service';
import { UserDataService } from './user-data.service';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class AppService implements OnDestroy {

  private $destroyed = new Subject();

  constructor(private oauthSrc: OAuthService,
              private eventsSrc: EventsService,
              private accountSrc: AccountService,
              // need to be injected in order to sub. to event token_received
              private infoSrc: InfoService,
              private hubSrc: HubService,
              private dataSrc: UserDataService) {}

  public ConfigureWithNewConfigApi() {
    this.oauthSrc.configure(authConfig);
    this.oauthSrc.setStorage(localStorage);

    this.oauthSrc.loadDiscoveryDocument()
      .then((event: OAuthSuccessEvent) => {
        this.eventsSrc.DiscoveryDocLoaded.emit(event);
        this.refreshTokensOnReload(event);
      })
      .catch(err => this.eventsSrc.ServerNotResponding.emit({err, customMsg: ''}));

    this.oauthSrc.setupAutomaticSilentRefresh();
    this.oauthSrc.events
      .pipe(takeUntil(this.$destroyed), filter((event) => this.isSignInResponse(event)))
      .subscribe(() => {
        localStorage.setItem('code_flow_redirect', 'false');
        this.eventsSrc.TokenReceived.emit(this.oauthSrc.getAccessToken());
      });
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
        this.eventsSrc.SignInRequest.value ||
        (localStorage.getItem('code_flow_redirect') === 'true')
      );
  }

  ngOnDestroy(): void {
    this.$destroyed.next();
    this.$destroyed.complete();
  }
}
