import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

import { AccountService } from 'src/services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../account-modal/account-modal.component.css']
})
export class RegisterComponent implements AfterViewInit, OnDestroy {

  @ViewChild('RegForm') public RegForm: NgForm;
  private $destroyed = new Subject();

  constructor(
    private dialogRef: MatDialogRef<RegisterComponent>,
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
