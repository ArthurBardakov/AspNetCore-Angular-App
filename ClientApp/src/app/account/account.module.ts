import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

import { LoginComponent } from './login/login.component';
import { AuthorizeCallbackComponent } from './authorize-callback/authorize-callback.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { RegisterComponent } from './register/register.component';
import { EqualValidator } from '../../directives/equal.validator.directive';
import { SharedModule } from 'src/app/shared.module';
import { UserExistenceValidator } from 'src/directives/user-existence.validator';
import { AccountModalComponent } from './account-modal/account-modal.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: AccountModalComponent }
  ]),
    MatDialogModule,
    MatFormFieldModule,
    SharedModule,
    MatCheckboxModule
  ],
  declarations: [
    EqualValidator,
    LoginComponent,
    AccountModalComponent,
    RegisterComponent,
    AuthorizeCallbackComponent,
    ConfirmationComponent,
    UserExistenceValidator
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} }
  ]
})

export class AccountModule { }
