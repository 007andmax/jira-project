import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { User } from './class/user';
import { UsersStateService } from '../../states/users/users-state.service';
import { UserListService } from './services/user-list.service';
import { CompaniesStateService } from '../../states/company/companies-state.service';
import { ConfirmStateService } from '../shared/confirm/services/confirm-state.service';
import { ARCHIVE_USER, ARCHIVE_USERS, DEARCHIVE_USER } from '../../const/confirm';
import { UsersService } from '../../services/users/users.service';
import { UserChange } from './class/user-change';
import { WebsocketService } from '../../services/websocket/websocket.service';
import { DraftEmailStateService } from '../../states/draft-email/draft-email-state.service';
import { MODE_USERS_LIST, TYPE_LIST_ALL_USERS } from '../../const/users';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { CrmCompanyJobTitle } from '../setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
import { forkJoin, Subscription } from 'rxjs';
import { UserCustomSubscription } from './class/user-custom-subscription';
import { UsersRealTimeService } from 'src/app/states/users/users-real-time.service';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';
import { MarketingSubscriptionType } from '../setting/marketing-email/marketing-subscription-type/class/marketing-subscription-type';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UserCustomerCompaniesInfo } from './class/user-customer-companies-info';
import { Router } from '@angular/router';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { UsersHeaderComponent } from './users-header/users-header.component';
import { UserFilters } from './class/user-filters';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserDeArchiveNotificationComponent } from './user-de-archive-notification/user-de-archive-notification.component';
import { fadeInAnimation } from 'src/app/animations';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  providers: [UserListService],
})
export class UsersComponent implements OnInit, OnDestroy {
  @ViewChild('header', { static: true }) header: UsersHeaderComponent;
  idDetailUser: string = '';
  users: Array<User> = [];
  showPreloader: boolean = true;
  filter: UserFilters = new UserFilters();
  selectAll: boolean = false;
  public infiniteScrollDisabled = false;
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  TYPE_LIST_ALL_USERS = TYPE_LIST_ALL_USERS;
  sub: Subscription = new Subscription();
  listCustomSubscription: Array<MarketingSubscriptionType> = [];
  toggleFilter: boolean = false;
  showPendingPreloader: boolean = false;
  container = document.body.querySelector(".main-container");
  constructor(private usersStateService: UsersStateService,
    private userListService: UserListService,
    private confirmStateService: ConfirmStateService,
    private usersService: UsersService,
    public cd: ChangeDetectorRef,
    private draftEmailStateService: DraftEmailStateService,
    private crmStateService: CrmStateService,
    private usersRealTimeService: UsersRealTimeService,
    private marketingEmailStateService: MarketingEmailStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private websocketService: WebsocketService,
    private modalService: NgbModal,
  ) {
  }
  ngOnInit() {
    if (this.customerPortalStateService.isCustomerPortal) {
      this.filter.setCompanies(this.customerPortalStateService.getUsersFilters().companies);
    } else {
      this.filter = this.usersStateService.getFilter();
      if (this.websocketService.isInit) this.websocketService.subsribeToUsersFilters();
      let onInit = this.websocketService.onInit.subscribe(data => this.websocketService.subsribeToUsersFilters());
      this.sub.add(onInit);
    }
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.usersStateService.setModeUserFilterSubscription(MODE_USERS_LIST);
    this.filter.setIsArchive(JSON.parse(JSON.stringify(this.usersStateService.getShowArchivedCompanies())));
    this.showPreloader = true;
    this.onScroll();
    this.cd.detectChanges();
    let geLefttFilter = this.usersStateService.getOnFilter().subscribe((data) => {
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.showPreloader = true;
      if (this.filter.isArchive != this.usersStateService.getShowArchivedCompanies()) {
        this.filter.setIsArchive(JSON.parse(JSON.stringify(this.usersStateService.getShowArchivedCompanies())));
        this.filter.setClientType(null);
        this.users = [];
      }
      this.setFilters(data);
      this.onScroll();
      this.cd.detectChanges();
    });
    this.sub.add(geLefttFilter);
    let onUsersFilters = this.customerPortalStateService.onUsersFilters.subscribe(data => {
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.showPreloader = true;
      this.setFilters(this.customerPortalStateService.getUsersFilters());
      this.onScroll();
    });
    this.sub.add(onUsersFilters);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === ARCHIVE_USER) {
          this.onArchiveUser(this.usersStateService.getUserForArchive().id);
        }
        if (this.confirmStateService.getConfirmAction() === DEARCHIVE_USER) {
          this.onDeArchiveUser(this.usersStateService.getUserForDeArchive().id);
        }
        if (this.confirmStateService.getConfirmAction() === ARCHIVE_USERS) {
          this.onArchiveUsers(this.usersStateService.getUsersForArchive().map(item => item.id));
        }
      }
    })
    this.sub.add(getConfirm);
    let getChangeCompanies = this.usersStateService.getChangeUsers().subscribe((data: UserChange) => {
      if ((data.action === 'USER_SAVED' || data.action === 'USER_ARCHIVED') && data.data.accountType !== "TECH") {
        const userIndex = this.users.findIndex((item) => item.id === data.data.id);
        if (userIndex > -1) this.users[userIndex].onUpdate(data.data);
        if (!this.filter.isArchive && data.action === 'USER_ARCHIVED') {
          if (userIndex > -1) this.users.splice(userIndex, 1);
        }
      }
      if (data.action === 'USERS_DEARCHIVED' && data.data.accountType !== "TECH") {
        data.data.forEach(user => {
          if (this.filter.isArchive) {
            const userIndex = this.users.findIndex((item) => item.id === user.id);
            if (userIndex > -1) this.users.splice(userIndex, 1);
          }
        })
      }
      if (data.action === 'USER_SUBMITTED_TICKET' && data.data.accountType !== "TECH") {
        const Index = this.users.findIndex((item) => item.id === data.data.id);
        var prevValue = this.users[Index].userStatistic.ticketsSubmitted || 0;
        prevValue++;
        this.users[Index].userStatistic.ticketsSubmitted = prevValue;
        if (Index > -1) this.users[Index].userStatistic.ticketsSubmitted = prevValue;
      }
      this.header.setUsers(this.users);
      this.users = [...this.users.map(item => new User(item))];
      this.cd.detectChanges();
    })
    this.sub.add(getChangeCompanies);
    let closeDetailAside = this.usersStateService.closeDetailAside.subscribe(data => {
      this.setIdDetailUser('');
    })
    this.sub.add(closeDetailAside);
    this.onInitSubscribe();
    this.jobTitleList = this.crmStateService.getJobTitleList();
    let onGetJobTitle = this.crmStateService.onGetJobTitle.subscribe(data => {
      this.jobTitleList = data;
    })
    this.sub.add(onGetJobTitle);
    this.listCustomSubscription = this.marketingEmailStateService.getListCustomSubscription();
    let onGetListCustomSubscription = this.marketingEmailStateService.onGetListCustomSubscription.subscribe(data => {
      this.listCustomSubscription = data;
    })
    this.sub.add(onGetListCustomSubscription);
    let openDetailAside = this.usersStateService.openDetailAside.subscribe(data => {
      this.setIdDetailUser(data);
    });
    this.sub.add(openDetailAside);
  }
  onCloseFilters() {
    this.header.setToggleFilter(false);
  }
  setFilters(data) {
    this.filter.setData(data);
    this.filter.page = 0;
    this.selectAll = false;
    this.users.forEach(item => item.selected = false);
    this.header.setUsers(this.users);
    this.setDefaultScoll();
  }
  private onArchiveUsers(ids) {
    forkJoin(
      ids.map(item => this.usersService.onArchiveUsers(item))
    )
      .subscribe(res => {
      });
  }
  onClearAll() {
    this.header.clearSearch(false);
  }
  onSearch(value) {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.filter.setUserName((value !== "") ? value : null);
    this.setDefaultScoll();
    this.onScroll();
  }
  setIdDetailUser(data) {
    this.idDetailUser = data;
  }
  private onInitSubscribe() {
    setTimeout(() => {

      let stompClient = this.usersRealTimeService.changeSubscriptionsUsers.subscribe(newChange => {
        if (newChange.action === 'DEFAULT_SUBSCRIPTION_SAVED') {
          const userIndex = this.users.findIndex((item) => item.id === newChange.data.userId);
          if (userIndex > -1) {
            let index = this.users[userIndex].customerCompaniesInfo.findIndex(item => item.companyId === newChange.data.companyId);
            if (index > -1) this.users[userIndex].customerCompaniesInfo[index] = new UserCustomerCompaniesInfo(newChange.data);
          }
          this.cd.detectChanges();
        }
        if (newChange.action === 'CUSTOM_SUBSCRIPTION_SAVED') {
          const userIndex = this.users.findIndex((item) => item.id === newChange.data.userId);
          if (userIndex > -1) this.users[userIndex].changeCustomSubscriptions(newChange.data.customSubscriptions.map(item => new UserCustomSubscription(item)));
          this.cd.detectChanges();
        }
        this.header.setUsers(this.users);
      });
      this.userListService.addSubscription(stompClient);

    }, 3000);
  }
  toggleAllUser(event) {
    if (event.target.checked) {
      this.usersStateService.initSelectAllusers(true);
      this.selectAll = true;
      this.users.forEach(item => {
        item.selected = true;
      })
      this.draftEmailStateService.resetSelectedUsers();
      this.users.forEach(user => {
        if (user.selected) this.draftEmailStateService.addSelectedUser(user);
      })
    } else {
      this.usersStateService.initSelectAllusers(false);
      this.selectAll = false;
      this.users.forEach(item => {
        item.selected = false;
      })
      this.users.forEach(item => item.selected = false)
      this.draftEmailStateService.resetSelectedUsers();
    }
    this.header.setUsers(this.users);
    this.cd.detectChanges();
  }
  onSelectUser(user) {
    this.users.find(item => item.id === user.id).selected = user.selected;
    this.selectAll = (this.users.some(item => item.selected == false)) ? false : true;
    this.header.setUsers(this.users);
    this.cd.detectChanges();
  }
  private onDeArchiveUser(id) {
    let Dearchiveusers = this.usersService.onDeArchiveUsers(id).subscribe(data => {
      if (this.filter.isArchive) {
        let index = this.users.findIndex(item => item.id === id);
        if (index > -1) this.users.splice(index, 1);
      }

    }, err => {
      const modalRef = this.modalService.open(UserDeArchiveNotificationComponent, { windowClass: 'xs-modal user-modal', container: "app-users", backdrop: 'static', keyboard: false });
      modalRef.componentInstance.user = this.usersStateService.getUserForDeArchive();
      this.cd.detectChanges();
    })
    this.userListService.addSubscription(Dearchiveusers);
  }
  private onArchiveUser(id) {
    let archiveUser = this.usersService.onArchiveUsers(id).subscribe(data => {
      if (!this.filter.isArchive && this.filter.getClientType()) {
        let index = this.users.findIndex(item => item.id === id);
        if (index > -1) this.users.splice(index, 1);
      }

    })
    this.userListService.addSubscription(archiveUser);
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getUsers();
  }
  public onFilter(field) {
    this.filter.setSortBy(field);
    this.filter.page = 0;
    this.userListService.setBlockList(false);
    this.users = [];
    this.showPreloader = true;
    this.onScroll();
  }
  private getUsers() {
    if (this.userListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      this.cd.detectChanges();
      return;
    }
    if (this.filter.page > 0) this.showPendingPreloader = true;
    this.usersService.getFilterUsers(this.filter.size, this.filter.page, this.filter.getDataForRequest(), this.filter.isArchive).subscribe((data: Array<User>) => {
      this.users = [...this.users, ...data];
      this.infiniteScrollDisabled = false;
      if (data.length < this.filter.size) this.userListService.setBlockList(true);
      this.filter.page += 1;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.cd.detectChanges();
    })
    this.cd.detectChanges();
  }
  public setDefaultScoll() {
    this.filter.page = 0;
    this.userListService.setBlockList(false);
    this.users = [];
    this.cd.detectChanges();
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.userListService.onUnsubscribe();
    this.sub.unsubscribe();
    this.selectAll = false;
    this.users.forEach(item => {
      item.selected = false;
    })
    this.users.forEach(item => item.selected = false)
    this.usersStateService.clearFilterWithoutChange();
    this.filter = new UserFilters();
    this.header.setUsers(this.users);
    this.draftEmailStateService.resetSelectedUsers();
    this.usersStateService.clearGlobalFilter();
    this.websocketService.unSubsribeUsersFilters();
  }
}
