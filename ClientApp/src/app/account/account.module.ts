import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

import { LoginPage } from './login/login.page';
import { AuthorizeCallbackPage } from './authorize-callback/authorize-callback.page';
import { ConfirmationPage } from './confirmation/confirmation.page';
import { RegisterPage } from './register/register.page';
import { EqualValidator } from '../../directives/equal.validator.directive';
import { SharedModule } from 'src/app/shared.module';
import { UserExistenceValidator } from 'src/directives/user-existence.validator';
import { AccountModalPage } from './account-modal/account-modal.page';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: AccountModalPage }
  ]),
    MatDialogModule,
    MatFormFieldModule,
    SharedModule,
    MatCheckboxModule
  ],
  declarations: [
    EqualValidator,
    LoginPage,
    AccountModalPage,
    RegisterPage,
    AuthorizeCallbackPage,
    ConfirmationPage,
    UserExistenceValidator
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} }
  ]
})

export class AccountModule { }
