import { Component, Inject, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { take, finalize, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

import { UserDataService } from 'src/services/user-data.service';
import { IAddPrescription } from 'src/interfaces/IAddPrescription';
import { IUser } from 'src/interfaces/IUser';
import { IPrescription } from 'src/interfaces/IPrescription';
import { EventsService } from 'src/services/events.service';

@Component({
  templateUrl: './edit-modal.page.html',
  styleUrls: ['./edit-modal.page.css'],
  providers: [DatePipe]
})
export class EditModalPage implements OnDestroy {

  private editUser: IUser;
  public Prescriptions$: Observable<IPrescription[]>;
  private $destroyed = new Subject();
  private spinnerName = 'edit_modal_spinner';

  constructor(public dataSrc: UserDataService,
              private spinner: NgxSpinnerService,
              public datepipe: DatePipe,
              private eventsSrc: EventsService,
              private dialogRef: MatDialogRef<EditModalPage>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.editUser = data.user;
    this.Prescriptions$ = this.dataSrc.FetchPrescriptions(this.editUser.userName);
  }

  public SaveChangesOnClick(prescriptionForm: NgForm): void {
    const model = prescriptionForm.value as IAddPrescription;
    model.Email = this.editUser.userName;
    this.spinner.show(this.spinnerName);

    this.dataSrc.AddPrescription(model)
        .pipe(take(1), takeUntil(this.$destroyed),
              finalize(() => {
                prescriptionForm.reset();
                this.spinner.hide(this.spinnerName);
              }))
        .subscribe(() =>
          this.Prescriptions$ = this.dataSrc.FetchPrescriptions(this.editUser.userName),
          (err) => this.eventsSrc.ServerNotResponding.emit({err, customMsg: ''}));
  }

  public ToggleRelatedArea(area: HTMLElement): void {
    if (area.classList.contains('invisible')) {
        area.classList.remove('invisible');
    } else {
        area.classList.add('invisible');
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
