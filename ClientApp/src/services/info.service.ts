import { Injectable, Inject, OnDestroy } from '@angular/core';
import { IUser } from 'src/interfaces/IUser';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { take, concatMap, map, takeUntil, finalize } from 'rxjs/operators';

import { APP_CONFIG, IAppConfig } from 'src/app/app.config';
import { Controllers } from 'src/enums/controllers.enum';
import { PatchOperation } from 'src/models/patch-operation';
import { OperationType } from 'src/enums/operation-type.enum';
import { Roles } from 'src/enums/roles.enum';
import { EventsService } from './events.service';
import { APP_ROUTES_NAMES } from 'src/app/app.routes.names';
import { SIDENAV_ROUTES_NAMES } from 'src/app/sidenav/sidenav.routes.names';

@Injectable({
  providedIn: 'root'
})
export class InfoService implements OnDestroy {

  public User: IUser;
  public UserProps: string[];
  public UserRole: Roles;
  private $destroyed = new Subject();

  constructor(private http: HttpClient,
              @Inject(APP_CONFIG) protected config: IAppConfig,
              private eventsSrc: EventsService,
              private spinner: NgxSpinnerService,
              private router: Router) {
    this.configUserInfo();
  }

  private configUserInfo(): void {
    this.eventsSrc.TokenReceived.pipe(
      take(1), takeUntil(this.$destroyed),
      finalize(() => this.spinner.show()),
      map((token) => this.UserRole = jwt_decode(token).role),
      concatMap((userRole: Roles) => this.getProfile(userRole)),
      finalize(() => this.spinner.hide())
    ).subscribe(user => {
        this.User = user;
        this.setUserProps();
        this.navToProfile();
      },
      (err) => this.eventsSrc.ServerNotResponding.emit({err, customMsg: ''}));
  }

  private getProfile(userRole: string): Observable<IUser> {
    return this.http.get<IUser>(
        this.config.apiEndpoint +
        Controllers[userRole + 'Profile']
    );
  }

  private setUserProps(): void {
    const defaultFields = ['userName', 'registryDate'];
    this.UserProps = Object.keys(this.User).filter((p) => !defaultFields.includes(p));
  }

  public EditProfile(editedUser: any) {
    return this.http.patch(
        this.config.apiEndpoint +
        Controllers[this.UserRole + 'Profile'],
        this.generatePatchDocument(editedUser)
    );
  }

  public generatePatchDocument(editedUser: any): PatchOperation[] {
    const patch: PatchOperation[] = [];

    this.UserProps.forEach(el => {
        editedUser[el] = editedUser[el] === '' ? null : editedUser[el];

        if (this.User[el] === null && editedUser[el] !== null) {
            patch.push(new PatchOperation(OperationType.add, '/' + el, editedUser[el]));
        } else if (this.User[el] !== null && editedUser[el] === null) {
            patch.push(new PatchOperation(OperationType.remove, '/' + el));
        } else if (this.User[el] !== editedUser[el]) {
            patch.push(new PatchOperation(OperationType.replace, '/' + el, editedUser[el]));
        }
    });

    return patch;
  }

  private navToProfile(): void {
    this.router.navigate(
      [{ outlets: { body: APP_ROUTES_NAMES.SIDENAV + '/' + SIDENAV_ROUTES_NAMES.INFO }}],
      { skipLocationChange: true }
    );
  }

  ngOnDestroy(): void {
    this.$destroyed.next();
    this.$destroyed.complete();
  }
}
