import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { take, takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

import { Roles } from 'src/enums/roles.enum';
import { ErrorHandlerService } from 'src/services/error-handler.service';
import { InfoService } from 'src/services/info.service';
import { ActivatedRoute } from '@angular/router';
import { DataStateService } from 'src/services/data-state.service';

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

    constructor(public infoSrc: InfoService,
                private errorSrc: ErrorHandlerService,
                public datePipe: DatePipe,
                public dataStateSrc: DataStateService,
                private spinner: NgxSpinnerService,
                private route: ActivatedRoute) {

        this.route.data.pipe(take(1))
            .subscribe(data => this.User = Object.assign({},  data.user));
        this.ModelsEqual = true;
        this.SaveBtnDisabled = false;
    }

    public OnChange(): void {
        this.ModelsEqual = this.ProfileForm.invalid ||
            this.dataStateSrc.UserProps.every(p =>
                this.propsEqual(this.dataStateSrc.User[p], this.User[p]));
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
                    err, this.dataStateSrc.User, this.ProfileForm));
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
        this.dataStateSrc.User = Object.assign({}, this.User);
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
