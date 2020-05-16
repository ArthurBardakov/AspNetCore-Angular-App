import { SidenavComponent } from './sidenav.component';
import { SIDENAV_ROUTES_NAMES } from './sidenav.routes.names';
import { Routes } from '@angular/router';

export const SIDENAV_ROUTES: Routes = [
    {
        path: '',
        component: SidenavComponent,
        children: [
            {
                path: SIDENAV_ROUTES_NAMES.INFO,
                loadChildren: () => import('../user-info/user-info.module').then(a => a.UserInfoModule)
            },
            {
                path: SIDENAV_ROUTES_NAMES.DATA,
                loadChildren:  () => import('../data-table/data-table.module').then(a => a.DataTableModule),
            }
        ]
    }
];
