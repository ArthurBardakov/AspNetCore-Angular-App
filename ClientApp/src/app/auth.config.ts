import { AuthConfig } from 'angular-oauth2-oidc';
import { apiBaseUrl, clientId } from '../app/app.config';
import { APP_ROUTES_NAMES } from './app.routes.names';
import { environment } from 'src/environments/environment';

export const authConfig: AuthConfig = {
    issuer: apiBaseUrl,
    redirectUri: window.location.origin + `/(body:${APP_ROUTES_NAMES.AUTH_CALLBACK})`,
    postLogoutRedirectUri: window.location.origin,
    clientId,
    scope: 'openid profile offline_access role resourceapi',
    loginUrl: apiBaseUrl + '/connect/authorize',
    logoutUrl: apiBaseUrl + '/connect/endsession',
    tokenEndpoint: apiBaseUrl + '/connect/token',
    userinfoEndpoint: apiBaseUrl + '/connect/userinfo',
    responseType: 'code',
    clearHashAfterLogin: true,
    showDebugInformation: !environment.production,
    requireHttps: true,
    oidc: true
};
