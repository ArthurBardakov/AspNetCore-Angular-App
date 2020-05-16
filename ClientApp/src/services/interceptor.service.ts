import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  constructor(protected oauthSrc: OAuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = request.headers.set('Accept', 'application/json');

    if (!headers.has('Content-Type')) {
      headers = headers.set('Content-Type', this.getContentType(request.method));
    }
    if (this.oauthSrc.hasValidAccessToken()) {
      headers = headers.set('Authorization', `Bearer ${this.oauthSrc.getAccessToken()}`);
    }
    request = request.clone({headers});

    return next.handle(request).pipe( tap((event: HttpEvent<any>) => {
        // console.log(event);
      },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 404) {
            // console.log(err);
            return err;
          }
        }
      })
    );
  }

  private getContentType(method: string): string {
    switch (method) {
      case 'PATCH':
        return 'application/json-patch+json';
      default:
        return 'application/json';
    }
  }
}
