import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { APP_CONFIG, IAppConfig } from '../app/app.config';
import { AccountEndpoints } from 'src/enums/account-endpoints.enum';
import { Controllers } from 'src/enums/controllers.enum';
import { UnsubscribeOnDestroyAdapter } from './unsubscribe-adapter';

@Injectable()
export class ApiService extends UnsubscribeOnDestroyAdapter {

    constructor(protected http: HttpClient,
                @Inject(APP_CONFIG) protected config: IAppConfig) {
        super();
    }

    public UserExists(email: string): Observable<boolean> {
        return this.http.get<boolean>(
            this.config.apiEndpoint +
            Controllers.account + '/' +
            AccountEndpoints.checkUser + `/?Email=` +
            email
        );
    }
}
