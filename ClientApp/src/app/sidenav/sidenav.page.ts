import { Component } from '@angular/core';

import { SIDENAV_ROUTES_NAMES } from './sidenav.routes.names';
import { Roles } from 'src/enums/roles.enum';
import { DataStateService } from 'src/services/data-state.service';

@Component({
  templateUrl: './sidenav.page.html',
  styleUrls: ['./sidenav.page.css']
})
export class SidenavPage {

  public UserInfoLink = './' + SIDENAV_ROUTES_NAMES.INFO;
  public UserDataLink = './' + SIDENAV_ROUTES_NAMES.DATA;
  public RelatedUserRole: string;

  constructor(private dataStateSrc: DataStateService) {
    this.RelatedUserRole = this.dataStateSrc.UserRole === Roles.patient ?
      Roles.doctor : Roles.patient;
  }
}
