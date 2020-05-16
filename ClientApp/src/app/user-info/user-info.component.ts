import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { take, takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

import { Roles } from 'src/enums/roles.enum';
import { ErrorHandlerService } from 'src/services/errorHandler.service';
import { InfoService } from 'src/services/info.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnDestroy {

    @ViewChild('ProfileForm') public ProfileForm: NgForm;
    public User: any;
    public ModelsEqual: boolean;
    public SaveBtnDisabled: boolean;
    public Roles = Roles;
    private destroyed$ = new Subject();

    constructor(
        public infoSrc: InfoService,
        private errorSrc: ErrorHandlerService,
        public datePipe: DatePipe,
        private spinner: NgxSpinnerService) {
            this.User = Object.assign({},  this.infoSrc.User);
            this.ModelsEqual = true;
            this.SaveBtnDisabled = false;
    }

    public OnChange(): void {
        this.ModelsEqual = this.ProfileForm.invalid ||
            this.infoSrc.UserProps.every(p =>
                this.propsEqual(this.infoSrc.User[p], this.User[p]));
    }

    private propsEqual(initialVal, changedVal): boolean {
        return initialVal === null && this.isNullOrEmpty(changedVal) ||
               initialVal === changedVal;
    }

    private isNullOrEmpty(value): boolean {
        return value === null || value === '';
    }

    public OnSaveChanges(): void {
        this.disabledForm();

        this.infoSrc.EditProfile(this.User)
            .pipe(take(1), takeUntil(this.destroyed$),
                  finalize(() => this.enableForm()))
            .subscribe(
                () => this.editSuccess(),
                (err) => this.errorSrc.SetServerErrors(
                    err, this.infoSrc.User, this.ProfileForm));
    }

    private disabledForm(): void {
        this.spinner.show();
        this.SaveBtnDisabled = true;
    }

    private enableForm(): void {
        this.spinner.hide();
        this.SaveBtnDisabled = false;
    }

    private editSuccess(): void {
        this.ModelsEqual = true;
        this.infoSrc.User = Object.assign({}, this.User);
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
