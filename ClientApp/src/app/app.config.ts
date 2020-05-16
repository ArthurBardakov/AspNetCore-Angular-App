import { InjectionToken } from '@angular/core';
import { environment } from 'src/environments/environment';

export let APP_CONFIG = new InjectionToken<string>('app.config');
export const apiBaseUrl = environment.apiUrl;
export const clientId = environment.apiUrl === window.location.origin ? 'hospital_spa' : 'hospital_spa_remote';

export interface IAppConfig {
    apiEndpoint: string;
}

export const AppConfig: IAppConfig = {
    apiEndpoint: apiBaseUrl + '/api/'
};
