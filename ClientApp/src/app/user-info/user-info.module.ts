import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UserInfoComponent } from './user-info.component';
import { MinValidator } from 'src/directives/min.validator.directive';
import { MaxValidator } from 'src/directives/max.validator.directive';
import { SharedModule } from '../shared.module';
import { RouterModule } from '@angular/router';
import { ErrorHandlerService } from 'src/services/errorHandler.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
          path: '',
          component: UserInfoComponent
      }
    ])
  ],
  declarations: [
    UserInfoComponent,
    MinValidator,
    MaxValidator
  ],
  providers: [
    DatePipe,
    ErrorHandlerService
  ]
})
export class UserInfoModule { }
