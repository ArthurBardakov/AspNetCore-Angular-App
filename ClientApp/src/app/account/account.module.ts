import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountModalComponent } from './account-modal/account-modal.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { firebaseConfig } from './firebase-config';

import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';
import { AuthorizeCallbackComponent } from './authorize-callback/authorize-callback.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { RegisterComponent } from './register/register.component';

import { EqualValidator } from '../../directives/equal.validator.directive';
import { SharedModule } from 'src/app/shared.module';
import { ACCOUNT_ROUTES } from './account.routes';
import { UserExistenceValidator } from 'src/directives/user-existence.validator';
import { ApiService } from 'src/services/api.service';
import { ErrorHandlerService } from 'src/services/errorHandler.service';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  imports: [
    RouterModule.forChild(ACCOUNT_ROUTES),
    MatDialogModule,
    MatFormFieldModule,
    SharedModule,
    MatCheckboxModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  declarations: [
    EqualValidator,
    AccountComponent,
    LoginComponent,
    AccountModalComponent,
    RegisterComponent,
    AuthorizeCallbackComponent,
    ConfirmationComponent,
    UserExistenceValidator
  ],
  exports: [
    AccountComponent
  ],
  providers: [
    ApiService,
    ErrorHandlerService,
    { provide: MatDialogRef, useValue: {} }
  ]
})

export class AccountModule { }
