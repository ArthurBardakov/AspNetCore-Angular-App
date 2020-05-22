import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgxSpinnerModule } from 'ngx-spinner';

import { EmptyValidator } from '../directives/empty.validator.directive';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    NgxSpinnerModule,
    FormsModule
  ],
  declarations: [
    EmptyValidator
  ],
  exports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    NgxSpinnerModule,
    EmptyValidator,
    FormsModule
  ]
})

export class SharedModule { }
