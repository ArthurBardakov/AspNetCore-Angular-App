import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

import { APP_ROUTES_NAMES } from '../app.routes.names';
import { AccountComponents } from 'src/enums/account-components';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeGuard implements CanActivate {

  constructor(private oauthSrc: OAuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.handleAuthorization(this.oauthSrc.hasValidAccessToken(), state);
  }

  private handleAuthorization(isAuthenticated: boolean, state: RouterStateSnapshot) {
    if (!isAuthenticated) {
      this.router.navigate(
        [{ outlets: {account: APP_ROUTES_NAMES.ACCOUNT}}],
        {
          queryParams: { component: AccountComponents.login },
          skipLocationChange: true
        }
      );
    }
    return isAuthenticated;
  }
}
