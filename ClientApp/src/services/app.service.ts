import { Injectable, OnDestroy } from '@angular/core';
import { OAuthService, OAuthSuccessEvent, OAuthEvent } from 'angular-oauth2-oidc';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import * as jwt_decode from 'jwt-decode';

import { authConfig } from 'src/app/auth.config';
import { EventsService } from './events.service';
import { HubService } from './hub.service';
import { UserDataService } from './user-data.service';
import { AccountService } from './account.service';
import { APP_ROUTES_NAMES } from 'src/app/app.routes.names';
import { SIDENAV_ROUTES_NAMES } from 'src/app/sidenav/sidenav.routes.names';
import { Router } from '@angular/router';
import { DataStateService } from './data-state.service';

@Injectable({
  providedIn: 'root'
})
export class AppService implements OnDestroy {

  private destroyed$ = new Subject();

  constructor(private oauthSrc: OAuthService,
              private eventsSrc: EventsService,
              private router: Router,
              private dataStateSrc: DataStateService,
              private accountSrc: AccountService,
              private hubSrc: HubService,
              private dataSrc: UserDataService) {
    this.ConfigureWithNewConfigApi();
  }

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
      .pipe(takeUntil(this.destroyed$), filter((event) => this.isSignInResponse(event)))
      .subscribe(() => {
        localStorage.setItem('code_flow_redirect', 'false');
        this.configServices(this.oauthSrc.getAccessToken());
      });
  }

  private refreshTokensOnReload(event: OAuthSuccessEvent): void {
    if (this.isReload) {
      if (this.oauthSrc.getRefreshToken() !== null) {
        this.oauthSrc.refreshToken()
          .then(() =>
            this.configServices(this.oauthSrc.getAccessToken()));
      }
    }
  }

  private configServices(accessToken: string): void {
    this.dataStateSrc.UserRole = jwt_decode(accessToken).role;
    this.hubSrc.ConfigHub(accessToken);
    this.dataSrc.FetchUserData();
    this.navToProfile();
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

  private navToProfile(): void {
    this.router.navigate(
      [{ outlets: { body: APP_ROUTES_NAMES.SIDENAV + '/' + SIDENAV_ROUTES_NAMES.INFO }}],
      { skipLocationChange: true }
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
