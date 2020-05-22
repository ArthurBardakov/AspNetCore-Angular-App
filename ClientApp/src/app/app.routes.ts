import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { APP_ROUTES_NAMES } from './app.routes.names';
import { AuthorizeCallbackPage } from './account/authorize-callback/authorize-callback.page';
import { AuthorizeGuard } from './account/authorize-guard';

export const APP_ROUTES: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            { path: APP_ROUTES_NAMES.AUTH_CALLBACK, component: AuthorizeCallbackPage },
        ],
        outlet: 'body'
    },
    {
        path: APP_ROUTES_NAMES.ACCOUNT,
        loadChildren:  () => import('./account/account.module').then(a => a.AccountModule),
        outlet: 'account'
    },
    {
        path: APP_ROUTES_NAMES.SIDENAV,
        loadChildren: () => import('./sidenav/sidenav.module').then(a => a.SidenavModule),
        canActivate: [AuthorizeGuard],
        outlet: 'body'
    },
    { path: '**', redirectTo: '/' }
];
