import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Inject, EventEmitter, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { take, delay } from 'rxjs/operators';

import { ApiService } from './api.service';
import { IAppConfig, APP_CONFIG } from '../app/app.config';
import { ILogin } from 'src/interfaces/ILogin';
import { IRegister } from 'src/interfaces/IRegister';
import { AccountEndpoints } from 'src/enums/account-endpoints.enum';
import { Roles } from 'src/enums/roles.enum';
import { FlowType } from 'src/enums/flow-type.enum';
import { Controllers } from 'src/enums/controllers.enum';
import { EventsService } from './events.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable()
export class AccountService extends ApiService {

    public readonly GoogleSignIn = new EventEmitter<void>();
    public readonly OnRegisterSubmit = new EventEmitter<IRegister>();
    public readonly OnLoginSubmit = new EventEmitter<ILogin>();
    public readonly CloseForm = new EventEmitter<void>();
    public readonly CallConfirmOption = new EventEmitter<void>();
    public readonly OnRoleChosen = new EventEmitter<Roles>();
    public SubmitForm: NgForm;
    private spinnerName = 'account_spinner';

    constructor(protected http: HttpClient,
                private oauthSrc: OAuthService,
                private eventsSrc: EventsService,
                private router: Router,
                private spinner: NgxSpinnerService,
                private afAuth: AngularFireAuth,
                private ngZone: NgZone,
                private errorSrc: ErrorHandlerService,
                @Inject(APP_CONFIG) protected config: IAppConfig) {
        super(http, config);

        this.subs.sink = this.GoogleSignIn
            .subscribe(() => this.showGoogleSignIn());

        this.subs.sink = this.OnRoleChosen
            .pipe(take(1))
            .subscribe(role => this.startCodeFlow(role));

        this.subs.sink = this.OnLoginSubmit
            .subscribe(model => this.login(model));

        this.subs.sink = this.OnRegisterSubmit
         .subscribe(model => this.register(model));

        this.subs.sink = this.eventsSrc.ServerNotResponding
            .subscribe(() => this.logOut(true));

        this.subs.sink = this.eventsSrc.LogOutClicked
            .subscribe(() => this.logOut());
    }

    private showGoogleSignIn(): void {
        this.spinner.show(this.spinnerName);
        this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then(res => this.checkUser(res.user.email))
            .catch(err => this.ngZone.run(() => this.spinner.hide(this.spinnerName)));
    }

    private checkUser(email: string): void {
        this.subs.sink = this.UserExists(email)
            .pipe(take(1))
            .subscribe(exists => !exists ?
                    this.CallConfirmOption.emit() :
                    this.startCodeFlow(''),
                    err => this.ngZone.run(() => this.spinner.hide(this.spinnerName)));
    }

    private startCodeFlow(role: string): void {
        this.afAuth.currentUser.then(fUser => {
            fUser.getIdToken().then(idToken => {
                localStorage.setItem('code_flow_redirect', 'true');
                this.oauthSrc.initCodeFlow('', {
                    role,
                    id_token: idToken
                });
            });
        });
    }

    private login(model: ILogin) {
        this.initiateSignIn();
        this.oauthSrc.fetchTokenUsingPasswordFlow(model.email, model.password)
            .then(() => this.proccessOnSuccess(),
                 (errRes) => this.processOnErrors(errRes, model));
    }

    private register(model: IRegister) {
        model.role = model.role ? Roles.doctor : Roles.patient;
        this.initiateSignIn(true);

        this.subs.sink = this.http.post<IRegister>(
            this.config.apiEndpoint +
            Controllers.account + '/' +
            AccountEndpoints.register,
            model
        )
        .pipe(take(1))
        .subscribe(
            () => this.fetchTokens(model),
            (errRes) => this.processOnErrors(errRes, model)
        );
    }

    private initiateSignIn(updateForm: boolean = false): void {
        this.spinner.show(this.spinnerName);
        this.changeFormState(true);
        this.eventsSrc.SignInRequest.next(true);
        if (updateForm) {
            this.SubmitForm.form.updateValueAndValidity();
        }
    }

    private changeFormState(freeze: boolean): void {
        const form = this.SubmitForm.form;
        freeze ? form.disable() : form.enable();
    }

    private fetchTokens(model: IRegister): void {
        this.oauthSrc.fetchTokenUsingPasswordFlow(model.email, model.password)
            .then(() => this.proccessOnSuccess())
            .catch((errRes) => this.processOnErrors(errRes, model));
    }

    private proccessOnSuccess(): void {
        localStorage.setItem('flow_type', FlowType.password);
        this.subs.sink = this.SubmitForm.form.statusChanges
            .pipe(take(1), delay(100))
            .subscribe(() => this.CloseForm.emit());
        this.changeFormState(false);
    }

    private processOnErrors(errRes: HttpErrorResponse, model: any): void {
        this.spinner.hide(this.spinnerName);
        this.changeFormState(false);
        this.errorSrc.SetServerErrors(errRes.error, model, this.SubmitForm);
    }

    private logOut(serverError = false): void {
        if (localStorage.getItem('flow_type') === FlowType.password || serverError) {
            const logoutUrl = this.oauthSrc.logoutUrl;
            this.oauthSrc.logoutUrl = null;
            this.oauthSrc.logOut();
            this.oauthSrc.logoutUrl = logoutUrl;
            this.spinner.hide();
            this.router.navigate(['./']);
        } else if (localStorage.getItem('flow_type') === FlowType.authorizationCode) {
            // this.oauthService.revokeTokenAndLogout();
            this.oauthSrc.logOut();
        }
    }
}
