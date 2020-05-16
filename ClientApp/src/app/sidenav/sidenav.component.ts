import { Component } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

import { SIDENAV_ROUTES_NAMES } from './sidenav.routes.names';
import { Roles } from 'src/enums/roles.enum';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {

  public UserInfoLink = './' + SIDENAV_ROUTES_NAMES.INFO;
  public UserDataLink = './' + SIDENAV_ROUTES_NAMES.DATA;
  public RelatedUserRole: string;

  constructor() {
    const token = localStorage.getItem('access_token');
    this.RelatedUserRole = jwt_decode(token).role === Roles.patient ?
      Roles.doctor : Roles.patient;
  }
}
