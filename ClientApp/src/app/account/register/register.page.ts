import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

import { AccountService } from 'src/services/account.service';

@Component({
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.css', '../account-modal/account-modal.page.css']
})
export class RegisterPage implements AfterViewInit, OnDestroy {

  @ViewChild('RegForm') public RegForm: NgForm;
  private $destroyed = new Subject();

  constructor(private dialogRef: MatDialogRef<RegisterPage>,
              public accountSrc: AccountService) {
    this.accountSrc.CloseForm
        .pipe(take(1), takeUntil(this.$destroyed))
        .subscribe(() => this.Close());
  }

  ngAfterViewInit(): void {
    this.accountSrc.SubmitForm = this.RegForm;
  }

  public Close(dialogResult = null): void {
    this.dialogRef.close(dialogResult);
  }

  ngOnDestroy(): void {
    this.$destroyed.next();
    this.$destroyed.complete();
  }
}
