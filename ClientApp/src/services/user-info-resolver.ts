import { Injectable, Inject, OnDestroy } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/internal/operators/take';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { finalize } from 'rxjs/internal/operators/finalize';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

import { DataStateService } from './data-state.service';
import { EventsService } from './events.service';
import { IUser } from 'src/interfaces/IUser';
import { IAppConfig, APP_CONFIG } from 'src/app/app.config';
import { Controllers } from 'src/enums/controllers.enum';

@Injectable({
  providedIn: 'root'
})
export class UserInfoResolver implements Resolve<IUser | void>, OnDestroy {

  private $destroyed = new Subject();

  constructor(private spinner: NgxSpinnerService,
              private http: HttpClient,
              private eventsSrc: EventsService,
              private dataStateSrc: DataStateService,
              @Inject(APP_CONFIG) protected config: IAppConfig) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUser | void> {
    if (!this.dataStateSrc.User) {
      this.spinner.show();

      return this.http.get<IUser>(
              this.config.apiEndpoint +
              Controllers[this.dataStateSrc.UserRole + 'Profile'])
             .pipe(take(1), takeUntil(this.$destroyed),
                   finalize(() => this.spinner.hide()),
                   map((user) => this.dataStateSrc.User = user),
                   catchError(err => of(this.eventsSrc.ServerNotResponding.emit({err, customMsg: ''}))));
    }
    return of(this.dataStateSrc.User);
  }

  ngOnDestroy(): void {
    this.$destroyed.next();
    this.$destroyed.complete();
  }
}
