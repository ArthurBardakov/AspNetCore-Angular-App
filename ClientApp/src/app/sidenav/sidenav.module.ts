import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav.component';
import { RouterModule } from '@angular/router';
import { SIDENAV_ROUTES } from './sidenav.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SIDENAV_ROUTES)
  ],
  declarations: [SidenavComponent]
})
export class SidenavModule { }
