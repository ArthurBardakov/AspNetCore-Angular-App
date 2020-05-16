import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionState } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { take } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { UnsubscribeOnDestroyAdapter } from './unsubscribe-adapter';

import { apiBaseUrl } from 'src/app/app.config';
import { EventsService } from './events.service';
import { Roles } from 'src/enums/roles.enum';
import { UserGroups } from 'src/enums/user-groups.enum';

@Injectable()
export class HubService extends UnsubscribeOnDestroyAdapter {

    private hubConnection: HubConnection | undefined;
    private group: string;

    constructor(private eventsSrc: EventsService) {
        super();
        this.subs.sink = this.eventsSrc.TokenReceived
            .pipe(take(1))
            .subscribe((token) => {
                const userGroup = this.getUserGroup(jwt_decode(token).role);
                this.ConfigHub(token, userGroup);
            });

        this.subs.sink = this.eventsSrc.ServerNotResponding
            .subscribe(() => this.disconnect());

        this.subs.sink = this.eventsSrc.LogOutClicked
            .subscribe(() => this.disconnect())
    }

    public ConfigHub(accessToken: string, group: string): void {
        this.initHubConnection(accessToken)
        .then(() => {
            this.group = group;
            this.initHubMethods();
            this.connect();
            this.eventsSrc.HubConnectionEstablished.emit(this.hubConnection);
        })
        .catch(() => console.error('error establishing HubConnection!'));
    }

    private initHubConnection(accessToken: string): Promise<void> {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(apiBaseUrl + '/connectionHub?access_token=' + accessToken)
            .configureLogging(signalR.LogLevel.None)
            .build();
        return this.hubConnection.start();
    }

    private initHubMethods(): void {
        this.hubConnection.on('OnConnectedAsync', () => {});
        this.hubConnection.on('OnDisconnectedAsync', () => {});
    }

    private connect(): void {
        if (this.hubConnection) {
            this.hubConnection.send('OnConnectedAsync', this.group);
        }
    }

    public disconnect(): void {
        if (this.hubConnection &&
            this.hubConnection.state === HubConnectionState.Connected) {
            this.hubConnection.send('OnDisconnectedAsync', this.group);
            this.hubConnection.stop();
        }
    }

    private getUserGroup(userRole: string): string {
        switch (userRole) {
            case Roles.patient:
                return UserGroups.PatientsGroup;
            case Roles.doctor:
                return UserGroups.DoctorsGroup;
            default:
                return UserGroups.AdminsGroup;
        }
    }
}
