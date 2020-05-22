import { SidenavPage } from './sidenav.page';
import { SIDENAV_ROUTES_NAMES } from './sidenav.routes.names';
import { Routes } from '@angular/router';
import { UserInfoResolver } from 'src/services/user-info-resolver';

export const SIDENAV_ROUTES: Routes = [
    {
        path: '',
        component: SidenavPage,
        children: [
            {
                path: SIDENAV_ROUTES_NAMES.INFO,
                loadChildren: () => import('../user-info/user-info.module').then(a => a.UserInfoModule),
                resolve: {
                    user: UserInfoResolver
                }
            },
            {
                path: SIDENAV_ROUTES_NAMES.DATA,
                loadChildren:  () => import('../data-table/data-table.module').then(a => a.DataTableModule),
            }
        ]
    }
];
