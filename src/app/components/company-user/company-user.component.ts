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

@Component({
  selector: 'company-user',
  templateUrl: './company-user.component.html',
  styleUrls: ['./company-user.component.scss'],
  providers: [UserListService]
})
export class CompanyUserComponent implements OnInit {
  users: Array<User> = [];
  companies: Array<Company> = [];
  reqUsers: Array<User> = [];
  showPreloader: boolean = true;
  filter: UserFilter = new UserFilter();
  showArchivedUsers: boolean = false;
  public infiniteScrollDisabled = false;
  public page_number: number = 0;
  count: number = 0;
  selectAll: boolean = false;
  TYPE_LIST_COMPANY_USERS = TYPE_LIST_COMPANY_USERS;
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  listCustomSubscription: Array<MarketingSubscriptionType> = [];
  industries: Array<CrmCompanyIndustry> = [];
  @ViewChild('header') header: UsersHeaderComponent;
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
    private marketingEmailService: MarketingEmailService,
    private usersRealTimeService: UsersRealTimeService,
    private marketingEmailStateService: MarketingEmailStateService,
    private websocketService: WebsocketService) { }

  ngOnInit() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.leftPanelStateService.changeStateWithoutNavigate('company-user');
    this.usersStateService.setModeUserFilterSubscription(MODE_USERS_LIST);
    let id = this.activateRoute.snapshot.params['id'];
    if (id) this.companiesStateService.setCompanyRoutingId(id);
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      id = params['id'];
      if (id) this.companiesStateService.setCompanyRoutingId(id);
      this.onInitFilters(id);
    });


    let geLefttFilter = this.usersStateService.getOnFilter().subscribe((data) => {
      this.filter.setLeftFilters(data.clientType, data.company, data.clientIndustry, data.title, data.defaultSubscriptions, data.customSubscriptions, data.tags);
      this.selectAll = false;
      this.reqUsers.forEach(item => item.selected = false);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.userListService.addSubscription(geLefttFilter);

    if (this.companiesStateService.getCompanies().length > 0) this.companies = this.companiesStateService.getCompanies();
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {

      this.companies = data;
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

      }
    })
    this.userListService.addSubscription(getConfirm);

    let getChangeCompanies = this.usersStateService.getChangeUsers().subscribe((data: UserChange) => {

      if (data.action === 'USER_SAVED' || data.action === 'USER_ARCHIVED') {

        const reqIndex = this.reqUsers.findIndex((item) => item.id === data.data.id);
        if (reqIndex > -1) this.reqUsers[reqIndex].onUpdate(data.data);
        if (reqIndex === -1 && data.data.company.id === id) {
          this.reqUsers.unshift(new User(data.data));
          this.users.unshift(new User(data.data));


          // this.onRelaodList();
        }
        const userIndex = this.users.findIndex((item) => item.id === data.data.id);
        if (userIndex > -1) this.users[userIndex].onUpdate(data.data);

        if (!this.showArchivedUsers && data.action === 'USER_ARCHIVED') {
          const userIndex = this.users.findIndex((item) => item.id === data.data.id);
          if (userIndex > -1) this.users.splice(userIndex, 1);
        }
      }


      if (data.action === 'USERS_DEARCHIVED') {

        data.data.forEach(user => {
          const reqIndex = this.reqUsers.findIndex((item) => item.id === user.id);
          if (reqIndex > -1) this.reqUsers[reqIndex].onUpdate(user);
          if (this.showArchivedUsers) {
            const userIndex = this.users.findIndex((item) => item.id === user.id);

            if (userIndex > -1) this.users.splice(userIndex, 1);
          }
        })

      }

    })
    this.userListService.addSubscription(getChangeCompanies);
    this.jobTitleList = this.crmStateService.getJobTitleList();
    let onGetJobTitle = this.crmStateService.onGetJobTitle.subscribe(data => {
      this.jobTitleList = data;
    })
    this.userListService.addSubscription(onGetJobTitle);
    this.listCustomSubscription = this.marketingEmailStateService.getListCustomSubscription();
    let onGetListCustomSubscription = this.marketingEmailStateService.onGetListCustomSubscription.subscribe(data => {
      this.listCustomSubscription = data;
    })
    this.userListService.addSubscription(onGetListCustomSubscription);
    this.onInitSubscribe();
    this.industries = this.crmStateService.getIndustryList();
    let onGetIndustry = this.crmStateService.onGetIndustry.subscribe(data => {
      this.industries = data;
    })
    this.userListService.addSubscription(onGetIndustry);
  }
  public onInitFilters(id) {
    let company = this.companiesStateService.getCompanies().find(item => item.id === id);
    this.header.filter.companiesDp.isDisabled = true;
    this.header.filter.companiesDp.editItem = company;
    this.header.filter.filter.setCompany(id);
    this.header.filter.onChangeCounterFilter();
    this.filter.setLeftFilters(null, id, null, null, null, [], []);
    this.cd.detectChanges();
  }
  showMobileFilter() {
    document.body.querySelector('app-left-panel-users').classList.add('show');
  }
  onSelectAllUser(event) {
    if (event.target.checked) {
      this.selectAll = true;
      this.users.forEach(item => {
        item.selected = true;
      })

      this.draftEmailStateService.resetSelectedUsers();
      this.filter.getFilterList(this.reqUsers, this.companies).forEach(item => {
        this.reqUsers.find(user => user.id === item.id).selected = true;
      })

      this.reqUsers.forEach(user => {
        if (user.selected) this.draftEmailStateService.addSelectedUser(user);
      })
    } else {
      this.selectAll = false;
      this.users.forEach(item => {
        item.selected = false;
      })
      this.reqUsers.forEach(item => {
        item.selected = false;
      })
      this.draftEmailStateService.resetSelectedUsers();
    }
  }
  onSelectUser(user) {
    this.reqUsers.find(item => item.id === user.id).selected = user.selected;
    this.selectAll = (this.filter.getFilterList(this.reqUsers, this.companies).find(item => !item.selected)) ? false : true;
  }
  private onInitSubscribe() {
    setTimeout(() => {

      let stompClient = this.usersRealTimeService.changeSubscriptionsUsers.subscribe(newChange => {

        if (newChange.action === 'DEFAULT_SUBSCRIPTION_SAVED') {
          const reqIndex = this.reqUsers.findIndex((item) => item.id === newChange.data.userId);
          if (reqIndex > -1) this.reqUsers[reqIndex].changeDefaultSubscriptions(new UserDefaultSubscription(newChange.data));
          const userIndex = this.users.findIndex((item) => item.id === newChange.data.userId);
          if (userIndex > -1) this.users[userIndex].changeDefaultSubscriptions(new UserDefaultSubscription(newChange.data));
          this.cd.detectChanges();
        }
        if (newChange.action === 'CUSTOM_SUBSCRIPTION_SAVED') {
          const reqIndex = this.reqUsers.findIndex((item) => item.id === newChange.data.userId);
          if (reqIndex > -1) this.reqUsers[reqIndex].changeCustomSubscriptions(newChange.data.customSubscriptions.map(item => new UserCustomSubscription(item)));
          const userIndex = this.users.findIndex((item) => item.id === newChange.data.userId);
          if (userIndex > -1) this.users[userIndex].changeCustomSubscriptions(newChange.data.customSubscriptions.map(item => new UserCustomSubscription(item)));
          this.cd.detectChanges();
        }
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
  private getUsersList(data) {

    this.reqUsers = data.filter(item => ((!this.showArchivedUsers) ? !item.deletedAt : item.deletedAt) && item.accountType !== "TECH");

    // this.onInirCalculate();
    this.reqUsers.sort((a, b) => ((a.firstName + a.lastName).toLowerCase() > (b.firstName + b.lastName).toLowerCase()) ?
      1 : (((b.firstName + b.lastName).toLowerCase() > (a.firstName + a.lastName).toLowerCase()) ? -1 : 0));
    this.onScroll();
    this.showPreloader = false;
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getCompanies();

  }
  public onFilter(field) {
    this.filter.onFilter(field, this.reqUsers, this.companies, this.industries)
    this.page_number = 0;
    this.userListService.setBlockList(false);
    this.users = [];
    this.onScroll();
  }
  private getCompanies() {
    if (this.userListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.page_number += 1;
    let listFilter = this.filter.getFilterList(this.reqUsers, this.companies);

    this.count = listFilter.length;

    let start = (this.page_number - 1) * 30;
    let end = ((this.page_number * 30) > listFilter.length) ? listFilter.length : this.page_number * 30;
    let usersList = [];
    for (let i = start; i < end; i++) {
      usersList.push(listFilter[i]);
    }
    this.users = [...this.users, ...usersList.map(item => new User(JSON.parse(JSON.stringify(item))))];
    this.infiniteScrollDisabled = false;
    if ((this.page_number * 30) > listFilter.length) this.userListService.setBlockList(true);


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
    this.users.forEach(item => {
      item.selected = false;
    })
    this.reqUsers.forEach(item => {
      item.selected = false;
    })
    this.draftEmailStateService.resetSelectedUsers();
    this.usersStateService.clearFilter();
    this.companiesStateService.setCompanyRoutingId(null);
  }

}
