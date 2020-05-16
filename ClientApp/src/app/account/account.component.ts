import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { take, delay } from 'rxjs/operators';

import { FlowType } from 'src/enums/flow-type.enum';
import { AccountService } from 'src/services/account.service';
import { ErrorHandlerService } from 'src/services/errorHandler.service';
import { IRegister } from 'src/interfaces/IRegister';
import { ILogin } from 'src/interfaces/ILogin';
import { UnsubscribeOnDestroyAdapter } from 'src/services/unsubscribe-adapter';
import { AngularFireAuth } from '@angular/fire/auth';
import { Roles } from 'src/enums/roles.enum';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html'
})
export class AccountComponent extends UnsubscribeOnDestroyAdapter {

    private spinnerName = 'account_spinner';

    constructor(
        private oauthSrc: OAuthService,
        private accountSrc: AccountService,
        private errorSrc: ErrorHandlerService,
        private detector: ChangeDetectorRef,
        private spinner: NgxSpinnerService,
        private afAuth: AngularFireAuth,
        private ngZone: NgZone
    ) {
        super();

        this.subs.sink = this.accountSrc.GoogleSignIn
            .subscribe(() => this.googleSignIn());

        this.subs.sink = this.accountSrc.OnRegisterSubmit
            .subscribe(model => this.register(model));

        this.subs.sink = this.accountSrc.OnLoginSubmit
            .subscribe(model => this.login(model));

        this.subs.sink = this.accountSrc.OnRoleChosen
            .pipe(take(1))
            .subscribe(role => this.proceedWithLogin(role));
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

        // using 'subs' with 'take' to avoid memory leaks in case component gets destroyed
        this.subs.sink = this.accountSrc.Register(model)
            .pipe(take(1))
            .subscribe(
                () => this.fetchTokens(model),
                (errRes) => this.processOnErrors(errRes, model)
            );
    }

    private initiateSignIn(updateForm: boolean = false): void {
        this.spinner.show(this.spinnerName);
        this.changeFormState(true);
        this.accountSrc.SignInRequest.next(true);
        if (updateForm) {
            this.updateChanges();
        }
    }

    private changeFormState(freeze: boolean): void {
        const form = this.accountSrc.SubmitForm.form;
        freeze ? form.disable() : form.enable();
    }

    private updateChanges(): void {
        this.accountSrc.SubmitForm.form.updateValueAndValidity();
        this.detector.detectChanges();
    }

    private fetchTokens(model: IRegister): void {
        this.oauthSrc.fetchTokenUsingPasswordFlow(model.email, model.password)
            .then(() => this.proccessOnSuccess())
            .catch((errRes) => this.processOnErrors(errRes, model));
    }

    private proccessOnSuccess(): void {
        localStorage.setItem('flow_type', FlowType.password);
        this.subs.sink = this.accountSrc.SubmitForm.form.statusChanges
            .pipe(take(1), delay(100))
            .subscribe(() => this.accountSrc.CloseForm.emit());
        this.changeFormState(false);
    }

    private processOnErrors(errRes: HttpErrorResponse, model: any): void {
        this.spinner.hide(this.spinnerName);
        this.changeFormState(false);
        this.errorSrc.SetServerErrors(errRes.error, model, this.accountSrc.SubmitForm);
    }

    private googleSignIn(): void {
        this.spinner.show(this.spinnerName);
        this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then(res => this.checkUser(res.user.email))
            .catch(err => this.ngZone.run(() => this.spinner.hide(this.spinnerName)));
    }

    private checkUser(email: string): void {
        this.subs.sink = this.accountSrc.UserExists(email)
            .pipe(take(1))
            .subscribe(
                ex => !ex ?
                    this.accountSrc.CallConfirmOption.emit() :
                    this.proceedWithLogin(''),
                err => this.ngZone.run(() => this.spinner.hide(this.spinnerName))
            );
    }

    private proceedWithLogin(role: string): void {
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
}
