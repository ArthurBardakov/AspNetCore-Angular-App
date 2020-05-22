import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import { DatePipe } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { SharedModule } from 'src/app/shared.module';
import { UserDataComponent } from './user-data.component';
import { EditModalPage } from './edit-modal/edit-modal.page';
import { NormalizeWordPipe } from 'src/pipes/normalize-word.pipe';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: UserDataComponent
      }
    ]),
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  declarations: [
    UserDataComponent,
    NormalizeWordPipe,
    EditModalPage
  ],
  providers: [
    DatePipe,
    { provide: MatDialogRef, useValue: {} }
  ]
})

export class DataTableModule { }
