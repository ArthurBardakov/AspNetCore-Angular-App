import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';

import { ApiService } from './api.service';
import { IAppConfig, APP_CONFIG } from '../app/app.config';
import { ILogin } from 'src/interfaces/ILogin';
import { IRegister } from 'src/interfaces/IRegister';
import { AccountEndpoints } from 'src/enums/account-endpoints.enum';
import { Roles } from 'src/enums/roles.enum';
import { FlowType } from 'src/enums/flow-type.enum';
import { Controllers } from 'src/enums/controllers.enum';
import { EventsService } from './events.service';
import { Router } from '@angular/router';

@Injectable()
export class AccountService extends ApiService {

    public readonly SignInRequest = new BehaviorSubject<boolean>(false);
    public readonly GoogleSignIn = new EventEmitter<void>();
    public readonly OnRegisterSubmit = new EventEmitter<IRegister>();
    public readonly OnLoginSubmit = new EventEmitter<ILogin>();
    public readonly CloseForm = new EventEmitter<void>();
    public readonly CallConfirmOption = new EventEmitter<void>();
    public readonly OnRoleChosen = new EventEmitter<Roles>();
    public SubmitForm: NgForm;

    constructor(protected http: HttpClient,
                private oauthSrc: OAuthService,
                private eventsSrc: EventsService,
                private router: Router,
                @Inject(APP_CONFIG) protected config: IAppConfig) {
        super(http, config);
        this.subs.sink = this.eventsSrc.ServerNotResponding
            .subscribe(() => this.logOut(true));
        this.subs.sink = this.eventsSrc.LogOutClicked
            .subscribe(() => this.logOut());
    }

    public Register(model: IRegister): Observable<IRegister> {
        return this.http.post<IRegister>(
            this.config.apiEndpoint +
            Controllers.account + '/' +
            AccountEndpoints.register,
            model
        );
    }

    private logOut(serverError = false): void {
        if (localStorage.getItem('flow_type') === FlowType.password || serverError) {
            const logoutUrl = this.oauthSrc.logoutUrl;
            this.oauthSrc.logoutUrl = null;
            this.oauthSrc.logOut();
            this.oauthSrc.logoutUrl = logoutUrl;
            this.router.navigate(['./']);
        } else if (localStorage.getItem('flow_type') === FlowType.authorizationCode) {
            // this.oauthService.revokeTokenAndLogout();
            this.oauthSrc.logOut();
        }
    }
}
