import { Component, OnInit, ViewChild } from '@angular/core';
import { TicketsFilter } from '../../tickets/tickets/class/tickets-filter';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { LeftPanelService } from 'src/ng2/app/services/left-panel/left-panel.service';
import { TehUsersService } from 'src/ng2/app/services/teh-users/teh-users.service';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { SelectSearchComponent } from '../../shared/select-search/select-search.component';

@Component({
  selector: 'app-left-panel-tickets',
  templateUrl: './left-panel-tickets.component.html',
  styleUrls: ['./left-panel-tickets.component.scss']
})
export class LeftPanelTicketsComponent implements OnInit {
  @ViewChild('usersDp') usersDp: SelectSearchComponent;
  ticketsFilter: TicketsFilter = new TicketsFilter();
  listType: string = "USERS";
  selectedCompany: string = null;
  selectedTechUser: string = null;
  selectedUser: string = null;
  companies = [];
  users = [];
  usersHistory = [];
  companiesHistory = [];
  techUsersHistory = [];
  techUsersList = [];
  constructor(private ticketsStateService: TicketsStateService,
    private companiesState: CompaniesStateService,
    private usersStateService: UsersStateService,
    private companiesService: CompaniesService,
    private leftPanelService: LeftPanelService) { }

  ngOnInit() {

    if (this.usersStateService.getAllUsers().length > 0) this.onGetTechUsers(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetTechUsers(data);
    })

    this.leftPanelService.getCompaniesHistoryTicketsUser().subscribe((data: Array<string>) => {
      this.usersHistory = data;
    })
    this.leftPanelService.getCompaniesHistoryTickets().subscribe((data: Array<string>) => {
      this.companiesHistory = data;
    })
    this.leftPanelService.getCompaniesHistoryTechUsers().subscribe((data: Array<string>) => {
      this.techUsersHistory = data;
    })
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {

      this.getClientsList(data);
    })
  }
  private getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  setTypeFilter(type) {
    this.listType = type;
    this.ticketsFilter.setListType(type);
    this.ticketsStateService.onInitFilter(this.ticketsFilter);
  }
  public onSelectCompany(item) {
    this.usersDp.clearClient();
    if (!item) {
      this.clearSelectedCompany();
      return;
    }

    this.selectedCompany = null;
    this.onGetUsers(this.usersStateService.getAllUsers().filter(user => user.company.id === item.id));
    //  this.filter.setCompany(item.id);
    //  this.usersStateService.onInitFilter(this.filter);
    let find = this.companiesHistory.find(history => history === item.name);
    if (!find) {
      this.companiesHistory.pop();
      this.companiesHistory.unshift(item.name);
    }

    this.companiesService.setСustomStorage("ticketPageFilterByCompanyHistory", this.companiesHistory).subscribe(data => {

    })

  }
  onGetUsers(data) {
    this.users = data.filter(item => {
      if (item.accountType !== 'TECH' && !item.deletedAt) {
        return item;
      }
    });

  }
  onGetTechUsers(data) {
    this.techUsersList = data.filter(item => {
      if (item.accountType === 'TECH' && !item.deletedAt) {
        return item;
      }
    });
  }

  selectClientCompany(item) {


    let indexCompany = this.companiesState.getCompanies().findIndex(company => company.name === item);
    //  this.showClearIndustry = true;
    // this.clientIndustry = item;

    this.selectedCompany = this.companiesState.getCompanies()[indexCompany];
    //  this.filter.setCompany(this.companiesState.getCompanies()[indexCompany].id);
    //  this.usersStateService.onInitFilter(this.filter);
  }
  selectTechUser(item) {

    console.log("item", item);
    console.log("this.techUsersList", this.techUsersList);
    let indexTechUser = this.techUsersList.findIndex(user => `${user.firstName} ${user.lastName}` === item);
    console.log("indexTechUser", indexTechUser);
    //  this.showClearIndustry = true;
    // this.clientIndustry = item;

    this.selectedTechUser = `${this.techUsersList[indexTechUser].firstName} ${this.techUsersList[indexTechUser].lastName}`;
    //  this.filter.setCompany(this.companiesState.getCompanies()[indexCompany].id);
    //  this.usersStateService.onInitFilter(this.filter);
  }
  selectUser(item) {


    let indexhUser = this.users.findIndex(user => `${user.firstName} ${user.lastName}` === item);
    console.log("indexhUser", indexhUser);
    //  this.showClearIndustry = true;
    // this.clientIndustry = item;

    this.selectedUser = `${this.users[indexhUser].firstName} ${this.users[indexhUser].lastName}`;
    //  this.filter.setCompany(this.companiesState.getCompanies()[indexCompany].id);
    //  this.usersStateService.onInitFilter(this.filter);
  }
  clearSelectedCompany() {
    //  this.showClearIndustry = false;
    //this.selectedCompany = '';
    this.selectedCompany = null;
    // this.filter.setCompany(null);
    //  this.usersStateService.onInitFilter(this.filter);
  }
  clearSelectedTechUser() {
    //  this.showClearIndustry = false;
    //this.selectedCompany = '';
    this.selectedTechUser = null;
    // this.filter.setCompany(null);
    //  this.usersStateService.onInitFilter(this.filter);
  }
  clearSelectedUser() {
    //  this.showClearIndustry = false;
    //this.selectedCompany = '';
    this.selectedUser = null;
    // this.filter.setCompany(null);
    //  this.usersStateService.onInitFilter(this.filter);
  }
  onSelectTechUser(item) {
    if (!item) {
      this.clearSelectedTechUser();
      return;
    }
    this.selectedTechUser = null;

    //  this.filter.setCompany(item.id);
    //  this.usersStateService.onInitFilter(this.filter);
    let find = this.techUsersHistory.find(history => history === item);
    if (!find) {
      this.techUsersHistory.pop();
      this.techUsersHistory.unshift(item);
    }

    this.companiesService.setСustomStorage("ticketPageFilterByTechUsersHistory", this.techUsersHistory).subscribe(data => {

    })
  }
  onSelectUser(item) {
    if (!item) {
      this.clearSelectedUser();
      return;
    }
    this.selectedUser = null;

    //  this.filter.setCompany(item.id);
    //  this.usersStateService.onInitFilter(this.filter);
    let find = this.usersHistory.find(history => history === item);
    if (!find) {
      this.usersHistory.pop();
      this.usersHistory.unshift(item);
    }

    this.companiesService.setСustomStorage("ticketPageFilterByClientUsersHistory", this.usersHistory).subscribe(data => {

    })
  }
  getTechUserList() {
    return this.techUsersList.map(item => {
      return `${item.firstName} ${item.lastName}`
    })
  }
  getUserList() {
    return this.users.map(item => {
      return `${item.firstName} ${item.lastName}`
    })
  }

  toggleFilter(event) {
    event.target.parentNode.classList.toggle('show-filter');
  }
}
