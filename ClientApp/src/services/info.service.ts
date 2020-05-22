import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { APP_CONFIG, IAppConfig } from 'src/app/app.config';
import { Controllers } from 'src/enums/controllers.enum';
import { PatchOperation } from 'src/models/patch-operation';
import { OperationType } from 'src/enums/operation-type.enum';
import { DataStateService } from './data-state.service';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(private http: HttpClient,
              private dataStateSrc: DataStateService,
              @Inject(APP_CONFIG) protected config: IAppConfig) {}

  public EditProfile(editedUser: any) {
    return this.http.patch(
        this.config.apiEndpoint +
        Controllers[this.dataStateSrc.UserRole + 'Profile'],
        this.generatePatchDocument(editedUser)
    );
  }

  private generatePatchDocument(editedUser: any): PatchOperation[] {
    const patch: PatchOperation[] = [];
    const user = this.dataStateSrc.User;

    this.dataStateSrc.UserProps.forEach(el => {
        editedUser[el] = editedUser[el] === '' ? null : editedUser[el];

        if (user[el] === null && editedUser[el] !== null) {
            patch.push(new PatchOperation(OperationType.add, '/' + el, editedUser[el]));
        } else if (user[el] !== null && editedUser[el] === null) {
            patch.push(new PatchOperation(OperationType.remove, '/' + el));
        } else if (user[el] !== editedUser[el]) {
            patch.push(new PatchOperation(OperationType.replace, '/' + el, editedUser[el]));
        }
    });

    return patch;
  }
}
