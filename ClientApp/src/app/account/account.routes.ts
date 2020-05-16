import { AccountComponent } from './account.component';
import { AccountModalComponent } from './account-modal/account-modal.component';

export const ACCOUNT_ROUTES = [
    {
        path: '',
        component: AccountComponent,
        children: [
            { path: '', component: AccountModalComponent }
        ]
    }
];
