import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs/internal/Observable';

import { APP_ROUTES_NAMES } from '../app.routes.names';
import { AccountComponents } from 'src/enums/account-components';
import { SIDENAV_ROUTES_NAMES } from '../sidenav/sidenav.routes.names';
import { EventsService } from 'src/services/events.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  // ['(min-width: 600px)']
  public isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.XSmall])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  public readonly AccountCmps = AccountComponents;

  public get IsLoggedIn(): boolean {
    return this.oauthSrc.hasValidAccessToken();
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    private oauthSrc: OAuthService,
    private router: Router,
    public eventsSrc: EventsService) {}

  public NavToInfo(): void {
      this.router.navigate(
        [{ outlets: { body: APP_ROUTES_NAMES.SIDENAV + '/' + SIDENAV_ROUTES_NAMES.INFO }}],
        { skipLocationChange: true }
      );
  }

  public NavToAccount(cmp: AccountComponents): void {
    this.router.navigate(
      [{ outlets: { account: APP_ROUTES_NAMES.ACCOUNT }}],
      {
        skipLocationChange: true,
        queryParams: { component: cmp }
      }
    );
  }
}
