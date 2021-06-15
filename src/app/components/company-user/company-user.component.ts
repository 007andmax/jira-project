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
import { TYPE_LIST_COMPANY_USERS } from '../../const/users';
import { ActivatedRoute } from '@angular/router';

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
  TYPE_LIST_COMPANY_USERS = TYPE_LIST_COMPANY_USERS;
  @ViewChild('header') header: UsersHeaderComponent;
  constructor(private usersStateService: UsersStateService,
    private userListService: UserListService,
    private companiesStateService: CompaniesStateService,
    private confirmStateService: ConfirmStateService,
    private usersService: UsersService,
    public cd: ChangeDetectorRef,
    public activateRoute: ActivatedRoute,
    private draftEmailStateService: DraftEmailStateService,
    private leftPanelStateService: LeftPanelStateService,
    private websocketService: WebsocketService) { }

  ngOnInit() {
    this.leftPanelStateService.changeStateWithoutNavigate('company-user');

    let id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      id = params['id'];
      console.log("id", id);
      this.onInitFilters(id);
    });


    let geLefttFilter = this.usersStateService.getOnFilter().subscribe((data) => {
      this.filter.setLeftFilters(data.clientType, data.company, data.clientIndustry, data.title);
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
        if (reqIndex > -1) this.reqUsers[reqIndex] = new User(data.data);
        if (reqIndex === -1 && data.data.company.id === id) {
          this.reqUsers.unshift(new User(data.data));
          this.users.unshift(new User(data.data));


          // this.onRelaodList();
        }
        const userIndex = this.users.findIndex((item) => item.id === data.data.id);
        if (userIndex > -1) this.users[userIndex] = new User(data.data);

        if (!this.showArchivedUsers && data.action === 'USER_ARCHIVED') {
          const userIndex = this.users.findIndex((item) => item.id === data.data.id);
          if (userIndex > -1) this.users.splice(userIndex, 1);
        }
      }


      if (data.action === 'USERS_DEARCHIVED') {

        data.data.forEach(user => {
          const reqIndex = this.reqUsers.findIndex((item) => item.id === user.id);
          if (reqIndex > -1) this.reqUsers[reqIndex] = new User(user);
          if (this.showArchivedUsers) {
            const userIndex = this.users.findIndex((item) => item.id === user.id);

            if (userIndex > -1) this.users.splice(userIndex, 1);
          }
        })

      }

    })
    this.userListService.addSubscription(getChangeCompanies);
    this.onInitSubscribe();
  }
  public onInitFilters(id) {
    let company = this.companiesStateService.getCompanies().find(item => item.id === id);
    this.header.filter.companiesDp.isDisabled = true;
    this.header.filter.companiesDp.editItem = company;
    this.header.filter.filter.setCompany(id);
    this.header.filter.onChangeCounterFilter();
    this.filter.setLeftFilters(null, id, null, null);
    this.cd.detectChanges();
  }
  showMobileFilter() {
    document.body.querySelector('app-left-panel-users').classList.add('show');
  }
  private onInitSubscribe() {
    setTimeout(() => {

      let stompClient = this.websocketService.getClient().subscribe(`/user/watch/subscription/${this.companiesStateService.getCurrentCompany().id}`, (message) => {
        var newChange = JSON.parse(message.body);

        if (newChange.action === 'SUBSCRIPTION_SAVED') {
          const reqIndex = this.reqUsers.findIndex((item) => item.id === newChange.data.user.id);
          if (reqIndex > -1) this.reqUsers[reqIndex].changeSubscriptions(newChange.data);
          const userIndex = this.users.findIndex((item) => item.id === newChange.data.user.id);
          if (userIndex > -1) this.users[userIndex].changeSubscriptions(newChange.data);
          this.cd.detectChanges();
        }
      });
      this.userListService.addSubscription(stompClient);

    }, 3000);
  }
  onSelectAllUser(event) {
    if (event.target.checked) {
      this.users.forEach(item => {
        item.selected = true;
      })
      /* let list_user_table = document.body.querySelectorAll('app-users-table');
       list_user_table.forEach(item => {
         (<any>item.querySelector('input[type="checkbox"]')).checked = true;
 
       });*/
      this.draftEmailStateService.resetSelectedUsers();
      this.users.forEach(user => {
        this.draftEmailStateService.addSelectedUser(user);
      })
    } else {
      this.users.forEach(item => {
        item.selected = false;
      })
      this.draftEmailStateService.resetSelectedUsers();
      /* let list_user_table = document.body.querySelectorAll('app-users-table');
       list_user_table.forEach(item => {
         (<any>item.querySelector('input[type="checkbox"]')).checked = false;
 
       });*/
    }
  }
  private onDeArchiveUser(id) {
    let ids = [];
    ids.push(id);
    let Dearchiveusers = this.usersService.onDeArchiveUsers(ids).subscribe(data => {
      if (this.showArchivedUsers) {
        let index = this.users.findIndex(item => item.id === id);
        if (index > -1) this.users.splice(index, 1);
      }

    })
    this.userListService.addSubscription(Dearchiveusers);
  }
  private onArchiveUser(id) {
    let ids = [];
    ids.push(id);
    let archiveUser = this.usersService.onArchiveUsers(ids).subscribe(data => {
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
    this.filter.onFilter(field, this.reqUsers, this.companies)
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
  }

}
