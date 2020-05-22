import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Roles } from 'src/enums/roles.enum';
import { AccountService } from 'src/services/account.service';

@Component({
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.css']
})

export class ConfirmationPage {

  public Roles = Roles;

  constructor(private dialogRef: MatDialogRef<ConfirmationPage>,
              private accountSrc: AccountService) { }

  public OnRoleChosen(role: Roles): void {
    this.accountSrc.OnRoleChosen.emit(role);
    this.Close('role_chosen');
  }

  public Close(dialogResult = null): void {
    this.dialogRef.close(dialogResult);
  }
}
