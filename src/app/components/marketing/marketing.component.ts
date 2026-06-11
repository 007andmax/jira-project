
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { ARCHIVE_USER, DEARCHIVE_USER, ARCHIVE_USERS } from 'src/app/const/confirm';
import { MODE_MARKETING_USERS_LIST, TYPE_LIST_MARKETING_USERS } from 'src/app/const/users';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { UsersService } from 'src/app/services/users/users.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';
import { UsersRealTimeService } from 'src/app/states/users/users-real-time.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CrmCompanyJobTitle } from '../setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
import { MarketingSubscriptionType } from '../setting/marketing-email/marketing-subscription-type/class/marketing-subscription-type';
import { ConfirmStateService } from '../shared/confirm/services/confirm-state.service';
import { User } from '../users/class/user';
import { UserChange } from '../users/class/user-change';
import { UserCustomSubscription } from '../users/class/user-custom-subscription';
import { UserListService } from '../users/services/user-list.service';
import { UserCustomerCompaniesInfo } from '../users/class/user-customer-companies-info';
import { UsersHeaderComponent } from '../users/users-header/users-header.component';
import { UserFilters } from '../users/class/user-filters';
import { fadeInAnimation } from 'src/app/animations';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UsersFilterComponent } from '../users/users-header/users-filter/users-filter.component';
import { UsersTableComponent } from '../users/users-table/users-table.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TicketSortBy } from '../tickets/tickets/class/ticket-sort-by';

@Component({
  standalone: true,
  imports: [UsersFilterComponent, InfiniteScrollModule, UsersHeaderComponent, UsersTableComponent, FormsModule, CommonModule],
  selector: 'marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.scss'],
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  providers: [UserListService],

})
export class MarketingComponent implements OnInit {
  @ViewChild('header', { static: true }) header: UsersHeaderComponent;
  idDetailUser: string = '';
  users: Array<User> = [];
  showPreloader: boolean = true;
  filter: UserFilters = new UserFilters();
  selectAll: boolean = false;
  public infiniteScrollDisabled = false;
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  TYPE_LIST_MARKETING_USERS = TYPE_LIST_MARKETING_USERS;
  sub: Subscription = new Subscription();
  listCustomSubscription: Array<MarketingSubscriptionType> = [];
  toggleFilter: boolean = false;
  showPendingPreloader: boolean = false;
  container = document.body.querySelector(".main-container");
  sortBy: TicketSortBy = new TicketSortBy('NAME', 'asc');
  constructor(private usersStateService: UsersStateService,
    private userListService: UserListService,
    private confirmStateService: ConfirmStateService,
    private usersService: UsersService,
    public cd: ChangeDetectorRef,
    private draftEmailStateService: DraftEmailStateService,
    private crmStateService: CrmStateService,
    private usersRealTimeService: UsersRealTimeService,
    private marketingEmailStateService: MarketingEmailStateService,
    private customerPortalStateService: CustomerPortalStateService,
    private websocketService: WebsocketService) { }

  ngOnInit() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.usersStateService.setModeUserFilterSubscription(MODE_MARKETING_USERS_LIST);
    this.filter = this.usersStateService.getFilter();
    if (this.websocketService.isInit && !this.customerPortalStateService.isCustomerPortal) this.websocketService.subsribeToUsersFilters();
    let onInit = this.websocketService.onInit.subscribe(data => {
      if (!this.customerPortalStateService.isCustomerPortal) this.websocketService.subsribeToUsersFilters()
    });
    this.sub.add(onInit);
    this.showPreloader = true;
    this.onScroll();
    this.cd.detectChanges();
    let geLefttFilter = this.usersStateService.getOnFilter().subscribe((data) => {
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.showPreloader = true;
      this.setFilters(data);
      this.onScroll();
      this.cd.detectChanges();
    })
    this.sub.add(geLefttFilter);
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
    let onFastAdd = this.usersStateService.onFastAdd.subscribe(res => {
      this.onUpdateUser(res);
    })
    this.sub.add(onFastAdd);
    let onFastEdit = this.usersStateService.onFastEdit.subscribe(res => {
      this.onUpdateUser(res);
    })
    this.sub.add(onFastEdit);
    let onFastArchive = this.usersStateService.onFastArchive.subscribe(res => {
      this.onFastArchiveUser(res);
    })
    this.sub.add(onFastArchive);
    let onFastDeArchive = this.usersStateService.onFastDeArchive.subscribe(res => {
      this.onFastDeArchiveUser(res);
    })
    this.sub.add(onFastDeArchive);
    let getChangeCompanies = this.usersStateService.getChangeUsers().subscribe((data: UserChange) => {
      if ((data.action === 'USER_SAVED') && data.data.accountType !== "TECH") this.onUpdateUser(data.data);
      if (data.action === 'USER_ARCHIVED' && data.data.accountType !== "TECH") this.onFastArchiveUser(data.data);
      if (data.action === 'USERS_DEARCHIVED' && data.data.accountType !== "TECH") this.onFastDeArchiveUser(data.data);
      if (data.action === 'USER_SUBMITTED_TICKET' && data.data.accountType !== "TECH") {

        const Index = this.users.findIndex((item) => item.id === data.data.id);
        var prevValue = this.users[Index].userStatistic.ticketsSubmitted || 0;
        prevValue++;
        this.users[Index].userStatistic.ticketsSubmitted = prevValue;
        if (Index > -1) this.users[Index].userStatistic.ticketsSubmitted = prevValue;
      }
      this.users = [...this.users.map(item => new User(item))];
      this.header.setUsers(this.users);
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
      this.cd.markForCheck();
    })
    this.sub.add(onGetJobTitle);
    this.listCustomSubscription = this.marketingEmailStateService.getListCustomSubscription();
    let onGetListCustomSubscription = this.marketingEmailStateService.onGetListCustomSubscription.subscribe(data => {
      this.listCustomSubscription = data;
      this.cd.markForCheck();
    })
    this.sub.add(onGetListCustomSubscription);
    this.cd.markForCheck();
  }
  onUpdateUser(data) {
    const userIndex = this.users.findIndex((item) => item.id === data.id);
    if (userIndex > -1) this.users[userIndex].onUpdate(data);
    if (userIndex === -1) this.users.unshift(new User(data));
  }
  onFastArchiveUser(data) {
    const userIndex = this.users.findIndex((item) => item.id === data.id);
    if (userIndex > -1) this.users[userIndex].onUpdate(data);
    if (!this.filter.isArchive) {
      if (userIndex > -1) this.users.splice(userIndex, 1);
    }
  }
  onFastDeArchiveUser(data) {
    data.forEach(user => {
      if (this.filter.isArchive) {
        const userIndex = this.users.findIndex((item) => item.id === user.id);
        if (userIndex > -1) this.users.splice(userIndex, 1);
      }
    })
  }
  onCloseFilters() {
    this.header.setToggleFilter(false);
  }
  setFilters(data) {
    this.filter.setData(data);
    this.filter.page = 0;
    this.selectAll = false;
    this.users.forEach(item => item.selected = false);
    if (this.header) this.header.setUsers(this.users);
    this.setDefaultScoll();
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
  private onArchiveUsers(ids) {
    forkJoin(
      ids.map(item => this.usersService.onArchiveUsers(item))
    )
      .subscribe(res => {
        this.confirmStateService.initRequest(false);
        res.forEach(item => {
          this.usersStateService.fastArchiveUser(item);
        })
      }, err => {
        this.confirmStateService.initRequest(false);
      });
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
      this.confirmStateService.initRequest(false);
      this.usersStateService.fastDeArchive([data]);
    }, err => {
      this.confirmStateService.initRequest(false);
    })
    this.userListService.addSubscription(Dearchiveusers);
  }
  private onArchiveUser(id) {
    let archiveUser = this.usersService.onArchiveUsers(id).subscribe(data => {
      this.confirmStateService.initRequest(false);
      this.usersStateService.fastArchiveUser(data);
      if (this.filter.getClientType()) {
        let index = this.users.findIndex(item => item.id === id);
        if (index > -1) this.users.splice(index, 1);
        this.cd.markForCheck();
      }
    }, err => {
      this.confirmStateService.initRequest(false);
    })
    this.userListService.addSubscription(archiveUser);
  }

  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getUsers();
  }
  public onFilter(field) {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.sortBy.sortBy = field;
    if (this.sortBy.sortDirection === 'desc') {
      this.sortBy.sortDirection = 'asc';
    } else {
      this.sortBy.sortDirection = 'desc';
    }
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
