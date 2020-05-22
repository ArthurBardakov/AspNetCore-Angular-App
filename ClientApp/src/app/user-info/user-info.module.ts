import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UserInfoComponent } from './user-info.component';
import { MinValidator } from 'src/directives/min.validator.directive';
import { MaxValidator } from 'src/directives/max.validator.directive';
import { SharedModule } from '../shared.module';
import { ErrorHandlerService } from 'src/services/error-handler.service';
import { InfoService } from 'src/services/info.service';

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
    InfoService,
    ErrorHandlerService
  ]
})
export class UserInfoModule { }
