import { Component, OnInit } from '@angular/core';
import { TicketsFilter } from '../../tickets/tickets/class/tickets-filter';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { LeftPanelService } from 'src/ng2/app/services/left-panel/left-panel.service';
import { TehUsersService } from 'src/ng2/app/services/teh-users/teh-users.service';

@Component({
  selector: 'app-left-panel-tickets',
  templateUrl: './left-panel-tickets.component.html',
  styleUrls: ['./left-panel-tickets.component.scss']
})
export class LeftPanelTicketsComponent implements OnInit {
  ticketsFilter: TicketsFilter = new TicketsFilter();
  listType: string = "USERS";
  selectedCompany: string = null;
  selectedTechUser: string = null;
  companies = [];
  companiesHistory = [];
  techUsersHistory = [];
  techUsersList = [];
  constructor(private ticketsStateService: TicketsStateService,
    private companiesState: CompaniesStateService,
    private tehService: TehUsersService,
    private leftPanelService: LeftPanelService) { }

  ngOnInit() {
    this.tehService.getUsersList().subscribe((data: any) => {
      this.techUsersList = data.filter(item => {
        if (item.accountType === 'TECH' && !item.deletedAt) {
          item.selected = false;
          return item;
        }
      });

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
    if (!item) {
      this.clearSelectedCompany();
      return;
    }
    
    this.selectedCompany = null;
    //  this.filter.setCompany(item.id);
    //  this.usersStateService.onInitFilter(this.filter);
    let find = this.companiesHistory.find(history => history === item.name);
    if (!find) {
      this.companiesHistory.pop();
      this.companiesHistory.unshift(item.name);
    }



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
     
   console.log("item",item);
   console.log("this.techUsersList",this.techUsersList);
    let indexTechUser = this.techUsersList.findIndex(user => `${user.firstName} ${user.lastName}` === item);
    console.log("indexTechUser",indexTechUser);
    //  this.showClearIndustry = true;
    // this.clientIndustry = item;
     
    this.selectedTechUser = `${this.techUsersList[indexTechUser].firstName} ${this.techUsersList[indexTechUser].lastName}`;
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
  }
  getTechUserList() {
    return this.techUsersList.map(item => {
      return `${item.firstName} ${item.lastName}`
    })
  }
 
  toggleFilter(event) {
    event.target.parentNode.classList.toggle('show-filter');
  }
}
