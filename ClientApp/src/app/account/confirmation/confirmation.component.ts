import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Roles } from 'src/enums/roles.enum';
import { AccountService } from 'src/services/account.service';

@Component({
  selector: 'app-confirmation-cmp',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})

export class ConfirmationComponent {

  public Roles = Roles;

  constructor(
    private dialogRef: MatDialogRef<ConfirmationComponent>,
    private accountSrc: AccountService) { }

  public OnRoleChosen(role: Roles): void {
    this.accountSrc.OnRoleChosen.emit(role);
    this.Close('role_chosen');
  }

  public Close(dialogResult = null): void {
    this.dialogRef.close(dialogResult);
  }
}
