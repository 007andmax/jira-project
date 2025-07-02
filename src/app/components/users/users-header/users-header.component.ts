import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { USERS } from 'src/app/const/emails';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { UsersHeaderService } from './services/users-header.service';
import { User } from '../class/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ARCHIVE_USERS, MULTI_DELETE_USER_FROM_SUBSCRIPTION } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { TYPE_LIST_ALL_USERS, TYPE_LIST_COMPANY_USERS, TYPE_LIST_MARKETING_USERS } from 'src/app/const/users';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { AppService } from 'src/app/states/app/app.service';
import { AddUserToCompanyComponent } from '../add-user-to-company/add-user-to-company.component';
import { UserFilters } from '../class/user-filters';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';


@Component({
  selector: 'app-users-header',
  templateUrl: './users-header.component.html',
  styleUrls: ['./users-header.component.scss'],
  providers: [UsersHeaderService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersHeaderComponent implements OnInit, OnDestroy {
  @Output() onChangeFilterField = new EventEmitter<any>();
  @Output() onSelectAllUser = new EventEmitter<any>();
  @Output() onSearch = new EventEmitter<any>();
  @Input() users: Array<User> = [];
  @Output() onToggleFilter = new EventEmitter<any>();
  searchText: string = "";
  @Input() selectAll: boolean = false;
  @Input() count: number = 0;
  @Input() type: string;
  userFilter: UserFilters = new UserFilters();
  sub: Subscription = new Subscription();
  countFilter: number = 0;
  toggleFilter: boolean = false;
  currentUser: CurrentUser = new CurrentUser();
  TYPE_LIST_MARKETING_USERS = TYPE_LIST_MARKETING_USERS;
  TYPE_LIST_ALL_USERS = TYPE_LIST_ALL_USERS;
  TYPE_LIST_COMPANY_USERS = TYPE_LIST_COMPANY_USERS;
  constructor(private usersStateService: UsersStateService,
    private draftEmailStateService: DraftEmailStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public appService: AppService,
    private marketingEmailService: MarketingEmailService,
    private permissionsService: PermissionsService,
    private ref: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService,
    private marketingEmailStateService: MarketingEmailStateService,
    private usersHeaderService: UsersHeaderService) {
  }

  ngOnInit() {
    let geLefttFilter = this.usersStateService.getOnFilter().subscribe((data) => {
      this.userFilter.setData(data);
      this.onChangeCountFilter();
    })
    this.sub.add(geLefttFilter);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === MULTI_DELETE_USER_FROM_SUBSCRIPTION) {
          this.onRemoveUsersFromSubscription();
        }
      }
    })
    this.sub.add(getConfirm);
    let onToggleFilter = this.usersStateService.onToggleFilter.subscribe(data => {
      this.setToggleFilter(data);
    })
    this.sub.add(onToggleFilter);
    this.currentUser = this.usersStateService.getCurrentUser();
    this.ref.markForCheck();
  }
  public setUsers(data) {
    this.users = data;
    this.ref.markForCheck();
  }
  clearAll() {
    this.usersStateService.clearFilters();
  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.onSearch.emit(event.target.value);
  }
  clearSearch(withEvent = true) {
    this.searchText = "";
    if (withEvent) this.onSearch.emit("");
  }
  public setToggleFilter(data) {
    this.toggleFilter = data;
    this.onToggleFilter.emit(data);
  }
  public showAsideForDraftEmail() {
    this.draftEmailStateService.setAction(USERS);
    this.draftEmailStateService.resetSelectedUsers();
    if (this.userFilter.customSubscriptions.length === 1 && this.type === TYPE_LIST_MARKETING_USERS) {
      let users = this.users.filter(item => item.selected).filter(item => item.customSubscriptions.find(subscription => subscription.id === this.userFilter.customSubscriptions[0] && subscription.activated));
      this.draftEmailStateService.setSelectedUser(users);
    } else {
      this.draftEmailStateService.setSelectedUser(this.users.filter(item => item.selected));
    }
    this.draftEmailStateService.toggleAsideForAdd();
    this.ref.markForCheck();
  }
  delete() {

    this.confirmStateService.setConfirmAction(ARCHIVE_USERS);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });

    if (this.users.filter(item => item.selected).length === 1) {
      let user = this.users.filter(item => item.selected)[0];
      modalRef.componentInstance.message = `Do you want to archive ${user.firstName + ' ' + user.lastName}`;
    } else {
      modalRef.componentInstance.message = `Do you want to archive users?`;
    }
    this.usersStateService.setUsersForArchive(this.users.filter(item => item.selected));
    this.ref.markForCheck();
  }

  isExistArchiveUser() {
    return this.users.filter(item => item.selected).some(item => item.deletedAt != null);
  }
  isExistPrimaryContact() {
    return this.users.filter(item => item.selected).some(item => item.isContact);
  }
  showAddToSubscription() {
    this.marketingEmailStateService.onOpenAsige(this.users.filter(item => item.selected));
    this.ref.markForCheck();
  }
  getTextCountFilters() {
    return `Filters${(this.countFilter > 0) ? ' (' + this.countFilter + ')' : ''}`;
  }
  getSelectedCount() {
    return this.users.filter(item => item.selected).length;
  }
  public onFilter(field) {
    this.onChangeFilterField.emit(field);
    this.ref.detectChanges();
  }
  addUser() {
    if (this.type == TYPE_LIST_COMPANY_USERS) {
      const modalRef = this.modalService.open(AddUserToCompanyComponent, { windowClass: 'xs-modal user-modal add-user-to-company', backdrop: 'static', keyboard: false });
      modalRef.componentInstance.company = this.companiesStateService.getCompanies().find(item => item.id == this.userFilter.companies[0]);
    } else {
      this.usersStateService.onOpenAsige();
    }
  }
  isUserOneCustomSubscription() {
    return this.userFilter.customSubscriptions.length === 1;
  }
  removeUsersFromSubscription() {
    this.confirmStateService.setConfirmAction(MULTI_DELETE_USER_FROM_SUBSCRIPTION);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Remove subscription`;
    this.ref.markForCheck();
  }
  onRemoveUsersFromSubscription() {
    let users = this.users.filter(item => item.selected);
    forkJoin(users.map(item => this.marketingEmailService.removeUser(item.id, this.userFilter.customSubscriptions[0]).pipe(map((res) => res),
      catchError(error => of(undefined)))))
      .subscribe(
        () => {
        },
        error => {
        }
      );
  }
  onChangeCountFilter() {
    this.countFilter = 0;
    if (this.userFilter.jobTitles.length > 0) this.countFilter++;
    if (this.userFilter.companies.length > 0) this.countFilter++;
    if (this.userFilter.ticketSubscription) this.countFilter++;
    if (this.userFilter.invoiceSubscription) this.countFilter++;
    if (this.userFilter.ticketManagerSubscription) this.countFilter++;
    if (this.userFilter.tags.length > 0) this.countFilter++;
    if (this.userFilter.customSubscriptions.length > 0) this.countFilter++;
    if (this.userFilter.hasAccess) this.countFilter++;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.usersHeaderService.onUnsubscribe();
  }
}
