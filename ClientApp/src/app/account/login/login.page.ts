import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { take, takeUntil, delay, tap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { Subject } from 'rxjs/internal/Subject';

import { AccountService } from 'src/services/account.service';

@Component({
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css', '../account-modal/account-modal.page.css']
})
export class LoginPage implements AfterViewInit, OnDestroy {

  @ViewChild('GoogleBtn') public GoogleBtn: ElementRef<HTMLElement>;
  @ViewChild('LogForm') public LogForm: NgForm;
  private $destroyed = new Subject();

  constructor(private dialogRef: MatDialogRef<LoginPage>,
              public accountSrc: AccountService) {
      this.accountSrc.CloseForm
          .pipe(take(1), takeUntil(this.$destroyed))
          .subscribe(() => this.Close());
  }

  ngAfterViewInit(): void {
    this.accountSrc.SubmitForm = this.LogForm;
    // needs to be set manually to remove black button effect
    of(true).pipe(
      delay(1), take(1),
      tap(() => this.GoogleBtn.nativeElement.style.transition = '0.7s')
    ).subscribe();
  }

  public GoToRegister(): void {
    if (this.LogForm.enabled) {
      this.Close('redirect');
    }
  }

  public Close(dialogResult = null): void {
    this.dialogRef.close(dialogResult);
  }

  ngOnDestroy(): void {
    this.$destroyed.next();
    this.$destroyed.complete();
  }
}
