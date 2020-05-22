import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionState } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { UnsubscribeOnDestroyAdapter } from './unsubscribe-adapter';

import { apiBaseUrl } from 'src/app/app.config';
import { EventsService } from './events.service';
import { Roles } from 'src/enums/roles.enum';
import { UserGroups } from 'src/enums/user-groups.enum';
import { DataStateService } from './data-state.service';

@Injectable()
export class HubService extends UnsubscribeOnDestroyAdapter {

    private hubConnection: HubConnection | undefined;
    private group: string;

    constructor(private eventsSrc: EventsService,
                private dataStateSrc: DataStateService) {
        super();

        this.subs.sink = this.eventsSrc.ServerNotResponding
            .subscribe(() => this.disconnect());

        this.subs.sink = this.eventsSrc.LogOutClicked
            .subscribe(() => this.disconnect())
    }

    public ConfigHub(accessToken: string): void {
        this.initHubConnection(accessToken)
        .then(() => {
            this.group = this.userGroup;
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

    private get userGroup(): string {
        switch (this.dataStateSrc.UserRole) {
            case Roles.patient:
                return UserGroups.PatientsGroup;
            case Roles.doctor:
                return UserGroups.DoctorsGroup;
            default:
                return UserGroups.AdminsGroup;
        }
    }
}
