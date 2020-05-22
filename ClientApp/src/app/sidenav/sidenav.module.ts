import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SIDENAV_ROUTES } from './sidenav.routes';
import { UserInfoResolver } from 'src/services/user-info-resolver';
import { SidenavPage } from './sidenav.page';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SIDENAV_ROUTES)
  ],
  declarations: [SidenavPage],
  providers: [UserInfoResolver]
})
export class SidenavModule { }
