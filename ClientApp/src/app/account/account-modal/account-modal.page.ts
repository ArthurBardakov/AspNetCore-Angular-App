import { Component, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ComponentType } from '@angular/cdk/portal';

import { AccountService } from 'src/services/account.service';
import { AccountComponents } from 'src/enums/account-components';
import { LoginPage } from '../login/login.page';
import { RegisterPage } from '../register/register.page';
import { ConfirmationPage } from '../confirmation/confirmation.page';
import { UnsubscribeOnDestroyAdapter } from 'src/services/unsubscribe-adapter';

@Component({
  template: ``
})
export class AccountModalPage extends UnsubscribeOnDestroyAdapter {

  constructor(public dialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute,
              private accountSrc: AccountService,
              private spinner: NgxSpinnerService,
              private ngZone: NgZone) {
      super();
      this.openDialogOnRouting();
      this.openConfirmationOnTrigger();
  }

  private openDialogOnRouting(): void {
    this.subs.sink = this.route.queryParams
      .pipe(take(1))
      .subscribe(params => {
        switch (params.component) {
          case AccountComponents.login:
            this.openDialog(LoginPage);
            break;
          case AccountComponents.register:
            this.openDialog(RegisterPage);
            break;
          default:
            break;
        }
      });
  }

  private openConfirmationOnTrigger(): void {
    this.subs.sink = this.accountSrc.CallConfirmOption
      .subscribe(() => {
        this.openDialog(ConfirmationPage, {
          width: '250px',
          hasBackdrop: false,
          panelClass: 'account-dialog-container'
        });
      });
  }

  private openDialog(component: ComponentType<unknown>, config?): void {
    if (!config) {
      config = {
        width: '320px',
        hasBackdrop: true,
        disableClose: true,
        panelClass: 'account-dialog-container'
      };
    }

    this.ngZone.run(() => {
      this.subs.sink = this.dialog.open(component, config)
        .afterClosed()
        .pipe(take(1))
        .subscribe(result => this.onDialogClosed(result));
    });
  }

  private onDialogClosed(result: any): void {
    if (result !== 'role_chosen') {
      this.spinner.hide('account_spinner');
    }
    if (result === 'redirect') {
      this.openDialog(RegisterPage);
    } else if (result === 'close') {
      this.router.navigate(['./']);
    }
  }
}
