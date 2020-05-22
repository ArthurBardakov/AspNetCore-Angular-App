import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { HubConnection } from '@aspnet/signalr';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin, BehaviorSubject } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from './unsubscribe-adapter';

import { APP_CONFIG, IAppConfig } from '../app/app.config';
import { IUser } from 'src/interfaces/IUser';
import { Controllers } from 'src/enums/controllers.enum';
import { Roles } from 'src/enums/roles.enum';
import { DoctorModel } from 'src/models/doctor.model';
import { PatientModel } from 'src/models/patient.model';
import { IAddPrescription } from 'src/interfaces/IAddPrescription';
import { IPrescription } from 'src/interfaces/IPrescription';
import { PagingMetadata } from 'src/models/paging-metadata';
import { UserModel } from 'src/models/user.model';
import { EventsService } from './events.service';
import { DataStateService } from './data-state.service';

@Injectable()
export class UserDataService extends UnsubscribeOnDestroyAdapter {

    public RelatedUserRole: Roles;
    public Users: Array<IUser>;
    public RelatedUsers: Array<IUser>;
    public UsersUpdated = new EventEmitter<void>();
    public UsersLoaded = new BehaviorSubject<boolean>(false);
    private readonly pageSize: number;

    private pagingMetada: PagingMetadata;
    public get PagingMetada(): PagingMetadata {
        return this.pagingMetada;
    }

    public get RelatedUserProps(): string[] {
        return Object.keys(this.relatedModel)
            .map(k => k[0].toLocaleLowerCase() + k.slice(1, k.length));
    }

    private get relatedModel(): UserModel {
        return this.dataStateSrc.UserRole === Roles.patient ? new DoctorModel() : new PatientModel();
    }

    constructor(protected http: HttpClient,
                public oauthSrc: OAuthService,
                @Inject(APP_CONFIG) protected config: IAppConfig,
                private dataStateSrc: DataStateService,
                private eventsSrc: EventsService) {
        super();
        this.pageSize = 20;

        this.subs.sink = this.eventsSrc.HubConnectionEstablished
            .pipe(take(1))
            .subscribe((hubConnection) => this.registerHubHandlers(hubConnection));
    }

    private setRoleDefinedInfo(): void {
        this.RelatedUserRole = this.dataStateSrc.UserRole === Roles.patient ? Roles.doctor : Roles.patient;
    }

    public FetchUserData(): void {
        this.setRoleDefinedInfo();

        forkJoin([
            this.requestUsers(this.pageNumber),
            this.getRelatedUsers()
        ])
        .pipe(tap(([usersResp, relatedUsers]) =>
            this.indicateRelatedUsers(usersResp.body, relatedUsers)))
        .subscribe(
            ([usersResp, relatedUsers]) => {
                this.Users = usersResp.body;
                this.RelatedUsers = relatedUsers;
                this.setPagingMetadata(usersResp.headers);
                this.UsersLoaded.next(true);
            },
            (err) => this.eventsSrc.ServerNotResponding.emit({err, customMsg: ''}));
    }

    private registerHubHandlers(hubConnection: HubConnection ): void {
        hubConnection.on('OnNewUserAdded', (user: IUser) => this.onNewUserAdded(user));
        hubConnection.on('OnRelationCreated', (email: string) => this.RelationCreated(email));
        hubConnection.on('OnRelationDeleted', (email: string) => this.RelationDeleted(email));
    }

    private onNewUserAdded(user: IUser): void {
        this.Users.push(user);
        this.UsersUpdated.emit();
    }

    public RelationCreated(email: string): void {
        const user = this.Users.find(u => u.userName === email);
        user.related = true;
        this.RelatedUsers.push(user);
        this.UsersUpdated.emit();
    }

    public RelationDeleted(email: string): void {
        const index = this.RelatedUsers.findIndex(u => u.userName === email);
        this.RelatedUsers.splice(index, 1);
        this.Users.find(u => u.userName === email).related = false;
        this.UsersUpdated.emit();
    }

    private indicateRelatedUsers(users: IUser[], relatedUsers: IUser[]): void {
        if (relatedUsers.length > 0) {
            users.forEach(u =>
                u.related = relatedUsers
                    .findIndex(ru => ru.userName === u.userName) !== -1
            );
        }
    }

    public UploadUsers(): void {
        this.subs.sink = this.requestUsers(this.pageNumber)
            .pipe(take(1))
            .subscribe(usersResp => {
                    this.setPagingMetadata(usersResp.headers);
                    this.updateUsers(usersResp.body);
                    this.UsersLoaded.next(true);
                    this.UsersUpdated.emit();
                },
                (err) => this.eventsSrc.ServerNotResponding.emit({err, customMsg: ''}));
    }

    private setPagingMetadata(headers: HttpHeaders): void {
        this.pagingMetada = new PagingMetadata();
        const props: string[] = headers.get('X-Pagination').replace(/["{}]/g, '').split(',');
        let prop: string[];

        props.forEach(el => {
            prop = el.split(':');
            this.pagingMetada[prop[0]] = +prop[1];
        });
    }

    public UploadRemainingUsers(): void {
        const requestsToMake = new Array<number>(
            this.pagingMetada.TotalPages - this.pagingMetada.CurrentPage).fill(0);
        let pageNumber = this.pagingMetada.CurrentPage + 1;

        forkJoin(requestsToMake.map(v => this.requestUsers(pageNumber++)))
        .subscribe((pages: HttpResponse<IUser[]>[]) => {
                this.setPagingMetadata(pages[pages.length - 1].headers);
                pages.forEach(p => this.updateUsers(p.body));
                this.UsersLoaded.next(true);
                this.UsersUpdated.emit();
            },
            (err) => this.eventsSrc.ServerNotResponding.emit({err, customMsg: ''}));
    }

    private updateUsers(users: IUser[]): void {
        if (this.Users) {
            this.indicateRelatedUsers(users, this.RelatedUsers);
            this.Users.push(...users);
        }
    }

    private requestUsers(pageNumber: number): Observable<HttpResponse<IUser[]>> {
        return this.http.get<IUser[]>(
            this.config.apiEndpoint +
            Controllers[this.RelatedUserRole + 's'] + '?' +
            'pageNumber=' + pageNumber +
            '&pageSize=' + this.pageSize,
            {observe: 'response'}
        );
    }

    private get pageNumber(): number {
        return !this.pagingMetada ? 1 : (this.pagingMetada.CurrentPage + 1);
    }

    private getRelatedUsers(): Observable<IUser[]> {
        return this.http.get<IUser[]>(
            this.config.apiEndpoint +
            Controllers[this.RelatedUserRole + 's'] + '/related',
        );
    }

    public FindUsers(filterOption: number,
                    filterVal: string,
                    fetchLength: number): Observable<IUser[]> {
        return this.http.get<IUser[]>(
            this.config.apiEndpoint +
            Controllers[this.RelatedUserRole + 's'] + '/filter?' +
            'filterOption=' + filterOption +
            '&filterValue=' + filterVal +
            '&fetchLength=' + fetchLength
        );
    }

    public AddPrescription(prescription: IAddPrescription): Observable<object> {
        return this.http.post(
            this.config.apiEndpoint +
            'doctor/' + Controllers.prescription,
            prescription
        );
    }

    public FetchPrescriptions(userName: string): Observable<IPrescription[]> {
        return this.http.get<IPrescription[]>(
            this.config.apiEndpoint +
            'doctor/' + Controllers.prescription +
            '?email=' + userName
        );
    }

    public AddRelatedUser(email: string) {
        return this.http.post(
            this.config.apiEndpoint +
            Controllers[this.RelatedUserRole + 's'] + '/',
            {email}
        );
    }

    public DeleteRelatedUser(email: string) {
        return this.http.delete(
            this.config.apiEndpoint +
            Controllers[this.RelatedUserRole + 's'] + '?email=' + email
        );
    }
}
