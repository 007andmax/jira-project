import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { ARCHIVE_USER, DEARCHIVE_USER, ARCHIVE_USERS } from 'src/app/const/confirm';
import { MODE_MARKETING_USERS_LIST, TYPE_LIST_MARKETING_USERS } from 'src/app/const/users';
import { Company } from 'src/app/interfaces/company/company';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { UsersService } from 'src/app/services/users/users.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';
import { UsersRealTimeService } from 'src/app/states/users/users-real-time.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CrmCompanyIndustry } from '../setting/crm-settings/crm-company-industry/class/crm-company-industry';
import { CrmCompanyJobTitle } from '../setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
import { MarketingSubscriptionType } from '../setting/marketing-email/marketing-subscription-type/class/marketing-subscription-type';
import { ConfirmStateService } from '../shared/confirm/services/confirm-state.service';
import { User } from '../users/class/user';
import { UserChange } from '../users/class/user-change';
import { UserCustomSubscription } from '../users/class/user-custom-subscription';
import { UserDefaultSubscription } from '../users/class/user-default-subscription';
import { UserFilter } from '../users/class/user-filter';
import { UserListService } from '../users/services/user-list.service';
import { UserCustomerCompaniesInfo } from '../users/class/user-customer-companies-info';
import { UsersHeaderComponent } from '../users/users-header/users-header.component';
import { UserFilters } from '../users/class/user-filters';

@Component({
  selector: 'marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.scss'],
  providers: [UserListService]
})
export class MarketingComponent implements OnInit {
  @ViewChild('header') header: UsersHeaderComponent;
  idDetailUser: string = '';
  users: Array<User> = [];
  companies: Array<Company> = [];
  reqUsers: Array<User> = [];
  showPreloader: boolean = true;
  filter: UserFilters = new UserFilters();
  selectAll: boolean = false;
  public infiniteScrollDisabled = false;
  public page_number: number = 0;
  count: number = 0;
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  TYPE_LIST_MARKETING_USERS = TYPE_LIST_MARKETING_USERS;
  sub: Subscription = new Subscription();
  listCustomSubscription: Array<MarketingSubscriptionType> = [];
  industries: Array<CrmCompanyIndustry> = [];
  container = document.body.querySelector(".main-container");
  constructor(private usersStateService: UsersStateService,
    private userListService: UserListService,
    private companiesStateService: CompaniesStateService,
    private confirmStateService: ConfirmStateService,
    private usersService: UsersService,
    public cd: ChangeDetectorRef,
    private draftEmailStateService: DraftEmailStateService,
    private crmStateService: CrmStateService,
    private marketingEmailService: MarketingEmailService,
    private usersRealTimeService: UsersRealTimeService,
    private marketingEmailStateService: MarketingEmailStateService,
    private websocketService: WebsocketService) { }

  ngOnInit() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.usersStateService.setModeUserFilterSubscription(MODE_MARKETING_USERS_LIST);
    this.filter = this.usersStateService.getFilter();
    let geLefttFilter = this.usersStateService.getOnFilter().subscribe((data) => {
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.filter.setData(data);
      this.selectAll = false;
      this.reqUsers.forEach(item => item.selected = false);
      this.header.setUsers(this.reqUsers);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.userListService.addSubscription(geLefttFilter);
    if (this.companiesStateService.getCompanies().length > 0) this.companies = this.companiesStateService.getCompanies();
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.companies = data;
      this.cd.markForCheck();
    })
    this.userListService.addSubscription(getOnCompanies);
    if (this.usersStateService.getAllUsers().length > 0) this.getUsersList(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.getUsersList(data);
    })
    this.userListService.addSubscription(getOnUsers);
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
    this.userListService.addSubscription(getConfirm);
    let getChangeCompanies = this.usersStateService.getChangeUsers().subscribe((data: UserChange) => {
      if ((data.action === 'USER_SAVED' || data.action === 'USER_ARCHIVED') && data.data.accountType !== "TECH") {
        const reqIndex = this.reqUsers.findIndex((item) => item.id === data.data.id);
        if (reqIndex > -1) this.reqUsers[reqIndex].onUpdate(data.data);
        if (reqIndex === -1) {
          this.reqUsers.unshift(new User(data.data));
          this.users.unshift(new User(data.data));
          // this.onRelaodList();
        }
        const userIndex = this.users.findIndex((item) => item.id === data.data.id);
        if (userIndex > -1) this.users[userIndex].onUpdate(data.data);
        if (data.action === 'USER_ARCHIVED') {
          const userIndex = this.users.findIndex((item) => item.id === data.data.id);
          if (userIndex > -1) this.users.splice(userIndex, 1);
        }
      }
      if (data.action === 'USERS_DEARCHIVED' && data.data.accountType !== "TECH") {
        data.data.forEach(user => {
          const reqIndex = this.reqUsers.findIndex((item) => item.id === user.id);
          if (reqIndex > -1) this.reqUsers[reqIndex].onUpdate(user);
        })
      }
      if (data.action === 'USER_SUBMITTED_TICKET' && data.data.accountType !== "TECH") {
        const reqIndex = this.reqUsers.findIndex((item) => item.id === data.data.id);
        const Index = this.users.findIndex((item) => item.id === data.data.id);
        var prevValue = this.reqUsers[reqIndex].userStatistic.ticketsSubmitted || 0;
        prevValue++;
        this.reqUsers[reqIndex].userStatistic.ticketsSubmitted = prevValue;
        if (Index > -1) this.users[Index].userStatistic.ticketsSubmitted = prevValue;
      }
      this.users = [...this.users.map(item => new User(item))];
      this.header.setUsers(this.reqUsers);
      this.cd.detectChanges();
    })
    this.userListService.addSubscription(getChangeCompanies);
    this.usersStateService.closeDetailAside.subscribe(data => {
      this.setIdDetailUser('');
    })
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
    this.industries = this.crmStateService.getIndustryList();
    let onGetIndustry = this.crmStateService.onGetIndustry.subscribe(data => {
      this.industries = data;
      this.cd.markForCheck();
    })
    this.sub.add(onGetIndustry);
    this.cd.markForCheck();
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
      });
  }
  setIdDetailUser(data) {
    this.idDetailUser = data;
  }
  private onInitSubscribe() {
    setTimeout(() => {
      let stompClient = this.usersRealTimeService.changeSubscriptionsUsers.subscribe(newChange => {
        if (newChange.action === 'DEFAULT_SUBSCRIPTION_SAVED') {
          const reqIndex = this.reqUsers.findIndex((item) => item.id === newChange.data.userId);
          if (reqIndex > -1) {
            let index = this.reqUsers[reqIndex].customerCompaniesInfo.findIndex(item => item.companyId === newChange.data.companyId);
            if (index > -1) this.reqUsers[reqIndex].customerCompaniesInfo[index] = new UserCustomerCompaniesInfo(newChange.data);
          }
          const userIndex = this.users.findIndex((item) => item.id === newChange.data.userId);
          if (userIndex > -1) {
            let index = this.users[userIndex].customerCompaniesInfo.findIndex(item => item.companyId === newChange.data.companyId);
            if (index > -1) this.users[userIndex].customerCompaniesInfo[index] = new UserCustomerCompaniesInfo(newChange.data);
          }
          this.cd.detectChanges();
        }
        if (newChange.action === 'CUSTOM_SUBSCRIPTION_SAVED') {
          const reqIndex = this.reqUsers.findIndex((item) => item.id === newChange.data.userId);
          if (reqIndex > -1) this.reqUsers[reqIndex].changeCustomSubscriptions(newChange.data.customSubscriptions.map(item => new UserCustomSubscription(item)));
          const userIndex = this.users.findIndex((item) => item.id === newChange.data.userId);
          if (userIndex > -1) this.users[userIndex].changeCustomSubscriptions(newChange.data.customSubscriptions.map(item => new UserCustomSubscription(item)));
          this.cd.detectChanges();
        }
        this.header.setUsers(this.reqUsers);
      });
      this.userListService.addSubscription(stompClient);

    }, 3000);
  }
  onSelectAllUser(event) {
    if (event.target.checked) {
      this.usersStateService.initSelectAllusers(true);
      this.selectAll = true;
      this.users.forEach(item => item.selected = true);
      this.draftEmailStateService.resetSelectedUsers();
      /* this.filter.getFilterList(this.reqUsers, this.companies).forEach(item => {
         this.reqUsers.find(user => user.id === item.id).selected = true;
       })*/
      this.reqUsers.forEach(user => {
        if (user.selected) this.draftEmailStateService.addSelectedUser(user);
      })
    } else {
      this.usersStateService.initSelectAllusers(false);
      this.selectAll = false;
      this.users.forEach(item => {
        item.selected = false;
      })
      this.reqUsers.forEach(item => {
        item.selected = false;
      })
      this.draftEmailStateService.resetSelectedUsers();
    }
    this.header.setUsers(this.reqUsers);
    this.cd.detectChanges();
  }
  onSelectUser(user) {
    this.reqUsers.find(item => item.id === user.id).selected = user.selected;
    // this.selectAll = (this.filter.getFilterList(this.reqUsers, this.companies).find(item => !item.selected)) ? false : true;
    this.header.setUsers(this.reqUsers);
    this.cd.detectChanges();
  }
  private onDeArchiveUser(id) {
    let Dearchiveusers = this.usersService.onDeArchiveUsers(id).subscribe(data => {
    })
    this.userListService.addSubscription(Dearchiveusers);
  }
  private onArchiveUser(id) {
    let archiveUser = this.usersService.onArchiveUsers(id).subscribe(data => {
      if (this.filter.getClientType()) {
        let index = this.users.findIndex(item => item.id === id);
        if (index > -1) this.users.splice(index, 1);
        this.cd.markForCheck();
      }
    })
    this.userListService.addSubscription(archiveUser);
  }
  private getUsersList(data) {
    this.reqUsers = data.filter(item => !item.deletedAt && item.accountType !== "TECH");
    this.reqUsers.sort((a, b) => ((a.firstName + a.lastName).toLowerCase() > (b.firstName + b.lastName).toLowerCase()) ?
      1 : (((b.firstName + b.lastName).toLowerCase() > (a.firstName + a.lastName).toLowerCase()) ? -1 : 0));
    this.onScroll();
    this.showPreloader = false;
    this.cd.markForCheck();
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getUsers();

  }
  public onFilter(field) {
    this.filter.setSortBy(field);
    this.page_number = 0;
    this.userListService.setBlockList(false);
    this.users = [];
    this.onScroll();
  }
  private getUsers() {
    if (this.userListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.page_number += 1;
    /* let listFilter = this.filter.getFilterList(this.reqUsers, this.companies);
     this.count = listFilter.length;
     let start = (this.page_number - 1) * 30;
     let end = ((this.page_number * 30) > listFilter.length) ? listFilter.length : this.page_number * 30;
     let usersList = [];
     for (let i = start; i < end; i++) {
       usersList.push(listFilter[i]);
     }
     this.users = [...this.users, ...usersList.map(item => new User(JSON.parse(JSON.stringify(item))))];
     if (this.selectAll) this.users.forEach(item => item.selected = true);
     this.infiniteScrollDisabled = false;
     this.header.setUsers(this.reqUsers);
     if ((this.page_number * 30) > listFilter.length) this.userListService.setBlockList(true);
     this.cd.detectChanges();*/
  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.userListService.setBlockList(false);
    this.users = [];
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.userListService.onUnsubscribe();
    this.selectAll = false;
    this.users.forEach(item => {
      item.selected = false;
    })
    this.reqUsers.forEach(item => {
      item.selected = false;
    })
    this.header.setUsers(this.reqUsers);
    this.draftEmailStateService.resetSelectedUsers();
    this.usersStateService.clearFilter();
  }

}
