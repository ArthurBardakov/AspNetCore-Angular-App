import { Injectable, EventEmitter } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import { OAuthSuccessEvent } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  public readonly TokenReceived = new EventEmitter<string>();
  public readonly DiscoveryDocLoaded = new EventEmitter<OAuthSuccessEvent>();
  public readonly HubConnectionEstablished = new EventEmitter<HubConnection>();
  public readonly ServerNotResponding = new EventEmitter<{err: any, customMsg: string}>();
  public readonly LogOutClicked = new EventEmitter<void>();

  constructor() { }

}
