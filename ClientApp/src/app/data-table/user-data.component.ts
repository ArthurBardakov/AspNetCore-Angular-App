import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { take, finalize, filter, delay, tap, skip } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UnsubscribeOnDestroyAdapter } from 'src/services/unsubscribe-adapter';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserDataService } from 'src/services/user-data.service';
import { Roles } from 'src/enums/roles.enum';
import { IUser } from 'src/interfaces/IUser';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { FilterOptions, FilterOption } from 'src/models/filter-options';
import { EventsService } from 'src/services/events.service';

@Component({
  selector: 'app-user-data-cmp',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})

export class UserDataComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  public BtnsDisabled: boolean;
  public RelatedTable: boolean;
  private filterConfigured: boolean;
  public Roles = Roles;
  public FilterOptions: FilterOption[];
  public FilterOption: FilterOption;
  public Headers: string[];
  public TotalLength: number;
  private foundTempUsers: IUser[];
  public Users: MatTableDataSource<IUser>;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public dataSrc: UserDataService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private eventsSrc: EventsService) {
      super();
      this.BtnsDisabled = false;
      this.filterConfigured = false;
      this.FilterOptions = FilterOptions;
      this.FilterOption = FilterOptions[0];
      this.foundTempUsers = [];
      this.Headers = dataSrc.RelatedUserProps.concat('action');
      this.onUpdateData();
  }

  private onUpdateData(): void {
    this.subs.sink = this.dataSrc.UsersUpdated
      .subscribe(() => this.Users.data = this.Users.data);
  }

  ngOnInit() {
    this.subs.sink = this.route.queryParams
      .subscribe(params => this.RelatedTable = params.relatedUsers === 'true');

      this.subs.sink = this.dataSrc.UsersLoaded
      .pipe(filter(loaded => loaded), take(1))
      .subscribe(() => this.configDataTable());

    this.subs.sink = this.route.queryParams
      .pipe(skip(1))
      .subscribe(() => this.configDataTable());
  }

  private configDataTable(): void {
    this.Users = new MatTableDataSource<IUser>(this.RelatedTable ?
      this.dataSrc.RelatedUsers : this.dataSrc.Users);
    this.Users.paginator = this.paginator;
    this.Users.sort = this.sort;
    this.configFilter();
    this.setDbTotalLentgh();
  }

  private configFilter(): void {
    if (!this.filterConfigured) {
      this.Users.filterPredicate = (user: IUser, f: string) =>
          (user[this.FilterOption.Key] as string).toLowerCase().includes(f);
      this.filterConfigured = true;
    }
  }

  private setDbTotalLentgh(): void {
    this.TotalLength = 0;

    of(true).pipe(delay(1), take(1))
      .subscribe(() => {
        this.TotalLength = this.RelatedTable ?
          this.Users.data.length : this.dataSrc.PagingMetada.TotalCount
      });
  }

  public ApplyFilter(filterValue: string) {
    this.Users.filter = filterValue.trim().toLowerCase();

    if (this.paginator.pageIndex !== 1) {
      this.Users.paginator.firstPage();
    }

    if (this.hasUnloaded) {
      if (this.hasEmptyRows) {
        this.subs.sink = this.dataSrc.FindUsers(
          this.FilterOption.Index, this.Users.filter, this.paginator.pageSize)
          .pipe(take(1))
          .subscribe(foundUsers => {
            this.removeFoundUsers();
            this.foundTempUsers = this.getDistinctUsers(foundUsers);
            this.Users.data.push(...this.foundTempUsers);
            this.Users.data = this.Users.data;
          }, (err) => this.eventsSrc.ServerNotResponding.emit({err, customMsg: ''}));
      }
      if (this.Users.filter === '') {
        this.removeFoundUsers();
        this.setDbTotalLentgh();
      }
    }
  }

  private removeFoundUsers(): void {
    if (this.foundTempUsers.length > 0) {
      this.Users.data = this.Users.data
        .filter(u => !this.foundTempUsers.find(fu => fu.userName === u.userName));
      this.foundTempUsers = [];
    }
  }

  private getDistinctUsers(users: IUser[]): IUser[] {
    return users.filter(fu => !this.Users.data.find(u => u.userName === fu.userName));
  }

  private get hasEmptyRows(): boolean {
    return this.Users.filteredData.length < this.paginator.pageSize;
  }

  public get NoFilteredData(): boolean {
    return this.Users.data.length !== 0 && this.Users.filteredData.length === 0;
  }

  public AddOnClick(user: IUser): void {
    this.blockScreen();
    this.subs.sink = this.dataSrc.AddRelatedUser(user.userName)
        .pipe(take(1), finalize(() => this.unblockScreen()))
        .subscribe(
            () => {
              this.dataSrc.RelationCreated(user.userName);
              this.showMessage(' added!', '');
            },
            (err) => this.eventsSrc.ServerNotResponding.emit({err, customMsg: ''})
        );
  }

  public DeleteOnClick(user: IUser): void {
    this.blockScreen();
    this.subs.sink = this.dataSrc.DeleteRelatedUser(user.userName)
        .pipe(take(1), finalize(() => this.unblockScreen()))
        .subscribe(
            () => {
              this.dataSrc.RelationDeleted(user.userName);
              this.showMessage(' deleted!', '');
            },
            (err) => this.eventsSrc.ServerNotResponding.emit({err, customMsg: ''})
        );
  }

  private showMessage(operation: string, action: string): void {
    let role = this.dataSrc.RelatedUserRole.toString();
    role = role[0].toUpperCase() + role.slice(1);
    const message = role + ' was successfully ' +  operation;

    this.snackBar.open(message, action, {
      duration: 2000,
      panelClass: 'snackbar_msg'
    });
  }

  private blockScreen(): void {
    this.BtnsDisabled = true;
    this.spinner.show();
  }

  private unblockScreen(): void {
    this.BtnsDisabled = false;
    this.spinner.hide();
  }

  public UploadUsersIfNecessary(event: PageEvent): void {
    if (this.hasUnloaded && this.Users.filter === '') {
      const isLastPage = this.lastPageClicked(event);
      const pages = this.pagesToDisplay(event);

      if (pages === 0 || isLastPage) {
        this.dataSrc.UsersLoaded.next(false);
      }

      if (isLastPage) {
        this.dataSrc.UploadRemainingUsers();
      } else if (pages === 2) {
        this.dataSrc.UploadUsers();
      }
    }
  }

  private get hasUnloaded(): boolean {
    return this.Users.data.length < this.TotalLength;
  }

  private lastPageClicked(event: PageEvent): boolean {
    return event.pageIndex > event.previousPageIndex + 1;
  }

  private pagesToDisplay(event: PageEvent): number {
    return (this.Users.data.length - (event.pageIndex + 1) * event.pageSize) / event.pageSize + 1;
  }

  public OpenEditDialog(user: IUser): void {
    this.dialog.open(EditModalComponent, {
      width: '350px',
      maxWidth: '450px',
      height: '380px',
      maxHeight: '550px',
      hasBackdrop: true,
      backdropClass: 'edit-dialog-backdrop',
      disableClose: true,
      panelClass: 'edit-dialog-container',
      data: { user }
    });
  }
}
