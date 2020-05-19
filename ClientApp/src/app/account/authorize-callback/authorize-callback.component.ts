import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take, takeUntil, filter } from 'rxjs/operators';
import { OAuthService, OAuthSuccessEvent } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs/internal/Subject';

import { FlowType } from 'src/enums/flow-type.enum';
import { EventsService } from 'src/services/events.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-authorize-callback',
  template: ``
})
export class AuthorizeCallbackComponent implements OnDestroy {

  private $destroyed = new Subject();

  constructor(
    private oauthSrc: OAuthService,
    private route: ActivatedRoute,
    private router: Router,
    private eventsSrc: EventsService,
    private spinner: NgxSpinnerService) {
      this.route.queryParams
        .pipe(take(1), takeUntil(this.$destroyed))
        .subscribe(() => this.fetchTokens());
  }

  private fetchTokens(): void {
    localStorage.setItem('signInRequest', 'true');
    localStorage.setItem('flow_type', FlowType.authorizationCode);
    this.eventsSrc.DiscoveryDocLoaded.pipe(
      filter((event: OAuthSuccessEvent) => event.info !== null),
      take(1), takeUntil(this.$destroyed)
    )
    .subscribe(() => {
      this.spinner.show();
        this.oauthSrc.tryLoginCodeFlow()
        .then(() => this.router.navigate(['/']))
        .catch(err => {
          this.spinner.hide();
          this.eventsSrc.ServerNotResponding.emit({err, customMsg: ''});
        });
    });
  }

  ngOnDestroy(): void {
    this.$destroyed.next();
    this.$destroyed.complete();
  }
}
