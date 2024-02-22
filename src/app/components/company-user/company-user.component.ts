import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { UserListService } from '../users/services/user-list.service';
import { User } from '../users/class/user';
import { Company } from '../../interfaces/company/company';
import { UserFilter } from '../users/class/user-filter';
import { UsersStateService } from '../../states/users/users-state.service';
import { CompaniesStateService } from '../../states/company/companies-state.service';
import { ConfirmStateService } from '../shared/confirm/services/confirm-state.service';
import { UsersService } from '../../services/users/users.service';
import { DraftEmailStateService } from '../../states/draft-email/draft-email-state.service';
import { WebsocketService } from '../../services/websocket/websocket.service';
import { ARCHIVE_USER, DEARCHIVE_USER } from '../../const/confirm';
import { UserChange } from '../users/class/user-change';
import { LeftPanelStateService } from '../../states/left-panel/left-panel-state.service';
import { UsersHeaderComponent } from '../users/users-header/users-header.component';
import { MODE_USERS_LIST, TYPE_LIST_COMPANY_USERS } from '../../const/users';
import { ActivatedRoute } from '@angular/router';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { UsersRealTimeService } from 'src/app/states/users/users-real-time.service';
import { UserCustomSubscription } from '../users/class/user-custom-subscription';
import { UserDefaultSubscription } from '../users/class/user-default-subscription';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { CrmCompanyJobTitle } from '../setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';
import { MarketingSubscriptionType } from '../setting/marketing-email/marketing-subscription-type/class/marketing-subscription-type';
import { CrmCompanyIndustry } from '../setting/crm-settings/crm-company-industry/class/crm-company-industry';
import { UserCustomerCompaniesInfo } from '../users/class/user-customer-companies-info';
import { Subscription } from 'rxjs';
import { UserFilters } from '../users/class/user-filters';
import { UsersFilterComponent } from '../users/users-header/users-filter/users-filter.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';

@Component({
  selector: 'company-user',
  templateUrl: './company-user.component.html',
  styleUrls: ['./company-user.component.scss'],
  providers: [UserListService]
})
export class CompanyUserComponent implements OnInit {
  users: Array<User> = [];
  showPreloader: boolean = true;
  filter: UserFilters = new UserFilters();
  showArchivedUsers: boolean = false;
  public infiniteScrollDisabled = false;
  selectAll: boolean = false;
  TYPE_LIST_COMPANY_USERS = TYPE_LIST_COMPANY_USERS;
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  listCustomSubscription: Array<MarketingSubscriptionType> = [];
  toggleFilter: boolean = false;
  @ViewChild('filters') filters: UsersFilterComponent;
  @ViewChild('header') header: UsersHeaderComponent;
  sub: Subscription = new Subscription();
  showPendingPreloader: boolean = false;
  container = document.body.querySelector(".main-container");
  constructor(private usersStateService: UsersStateService,
    private userListService: UserListService,
    private companiesStateService: CompaniesStateService,
    private confirmStateService: ConfirmStateService,
    private usersService: UsersService,
    public cd: ChangeDetectorRef,
    public activateRoute: ActivatedRoute,
    private crmStateService: CrmStateService,
    private draftEmailStateService: DraftEmailStateService,
    private leftPanelStateService: LeftPanelStateService,
    private usersRealTimeService: UsersRealTimeService,
    private websocketService: WebsocketService,
    public customerPortalStateService: CustomerPortalStateService,
    private marketingEmailStateService: MarketingEmailStateService) { }

  ngOnInit() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.leftPanelStateService.changeStateWithoutNavigate('company-user');
    this.usersStateService.setModeUserFilterSubscription(MODE_USERS_LIST);
    this.filter.setIsArchive(JSON.parse(JSON.stringify(this.usersStateService.getShowArchivedCompanies())));
    let id = this.activateRoute.snapshot.params['id'];
    if (id) {
      this.companiesStateService.setCompanyRoutingId(id);
      if (this.companiesStateService.getCompanies().length > 0) this.onInitFilters(id);
    }
    if (this.websocketService.isInit) this.websocketService.subsribeToUsersFilters();
    let onInit = this.websocketService.onInit.subscribe(data => this.websocketService.subsribeToUsersFilters());
    this.sub.add(onInit);
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      id = params['id'];
      if (id) this.companiesStateService.setCompanyRoutingId(id);
      if (this.companiesStateService.getCompanies().length > 0) this.onInitFilters(id);
    });
    this.sub.add(subscription);
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
    })
    this.userListService.addSubscription(geLefttFilter);
    let onUsersFilters = this.customerPortalStateService.onUsersFilters.subscribe(data => {
      console.log("onUsersFilters");
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.showPreloader = true;
      this.setFilters(this.customerPortalStateService.getUsersFilters());
      this.onScroll();
    });
    this.sub.add(onUsersFilters);
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      if (id) this.onInitFilters(id);
    })
    this.userListService.addSubscription(getOnCompanies);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === ARCHIVE_USER) {
          this.onArchiveUser(this.usersStateService.getUserForArchive().id);
        }
        if (this.confirmStateService.getConfirmAction() === DEARCHIVE_USER) {
          this.onDeArchiveUser(this.usersStateService.getUserForDeArchive().id);
        }
      }
    })
    this.userListService.addSubscription(getConfirm);
    let getChangeCompanies = this.usersStateService.getChangeUsers().subscribe((data: UserChange) => {
      if (data.action === 'USER_SAVED' || data.action === 'USER_ARCHIVED') {
        const userIndex = this.users.findIndex((item) => item.id === data.data.id);
        if (userIndex > -1) {
          if (!data.data.customerCompaniesInfo.some(clientCompany => clientCompany.companyId === id)) {
            this.users.splice(userIndex, 1);
          } else {
            this.users[userIndex].onUpdate(data.data);
          }
        } else {
          this.users.unshift(new User(data.data));
          this.header.count = this.header.count + 1;
        }
        if (!this.showArchivedUsers && data.action === 'USER_ARCHIVED') {
          const userIndex = this.users.findIndex((item) => item.id === data.data.id);
          if (userIndex > -1) this.users.splice(userIndex, 1);
        }
      }
      if (data.action === 'USERS_DEARCHIVED') {
        data.data.forEach(user => {
          if (this.showArchivedUsers) {
            const userIndex = this.users.findIndex((item) => item.id === user.id);
            if (userIndex > -1) this.users.splice(userIndex, 1);
          }
        })
      }
      this.users = [...this.users.map(item => new User(item))];
      this.header.setUsers(this.users);
      this.cd.detectChanges();
    })
    this.userListService.addSubscription(getChangeCompanies);
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
    this.onInitSubscribe();
  }
  onCloseFilters() {
    this.header.setToggleFilter(false);
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
  setFilters(data) {
    this.filter.setData(data);
    this.filter.page = 0;
    this.selectAll = false;
    this.users.forEach(item => item.selected = false);
    this.header.setUsers(this.users);
    this.setDefaultScoll();
  }
  public onInitFilters(id) {
    let company = this.companiesStateService.getCompanies().find(item => item.id === id);
    this.filters.companiesDp.selectItemsWithOutChanges([company]);
    this.filters.companiesDp.isDisabled = true;
    this.filter.setCompanies([id]);
    this.filters.filter.setCompanies([id]);
    this.header.userFilter.setCompanies([id]);
    this.filters.globalFilter.setCompanies([id]);
    this.header.onChangeCountFilter();
    this.onScroll();
    this.cd.detectChanges();
  }
  toggleAllUser(event) {
    console.log("event.target.checked", event.target.checked);
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
        this.cd.detectChanges();
      });
      this.userListService.addSubscription(stompClient);

    }, 3000);
  }
  private onDeArchiveUser(id) {
    let Dearchiveusers = this.usersService.onDeArchiveUsers(id).subscribe(data => {
      if (this.showArchivedUsers) {
        let index = this.users.findIndex(item => item.id === id);
        if (index > -1) this.users.splice(index, 1);
      }

    })
    this.userListService.addSubscription(Dearchiveusers);
  }
  private onArchiveUser(id) {
    let archiveUser = this.usersService.onArchiveUsers(id).subscribe(data => {
      if (!this.showArchivedUsers && this.filter.getClientType()) {
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
    this.selectAll = false;
    this.users = [];
    this.header.setUsers(this.users);
    this.usersStateService.clearFilter();
    this.draftEmailStateService.resetSelectedUsers();
    this.usersStateService.clearGlobalFilter();
    this.websocketService.unSubsribeUsersFilters();
    this.companiesStateService.setCompanyRoutingId(null);
  }

}
