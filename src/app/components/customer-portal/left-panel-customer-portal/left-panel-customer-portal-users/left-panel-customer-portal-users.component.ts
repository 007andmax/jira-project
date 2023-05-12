import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TicketsFilter } from 'src/app/components/tickets/tickets/class/tickets-filter';
import { UserCustomerCompaniesInfo } from 'src/app/components/users/class/user-customer-companies-info';
import { UserFilter } from 'src/app/components/users/class/user-filter';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { CurrentUserCustomerCompaniesInfo } from 'src/class/current-user/current-user-customer-companies-info';

@Component({
  selector: 'left-panel-customer-portal-users',
  templateUrl: './left-panel-customer-portal-users.component.html',
  styleUrls: ['./left-panel-customer-portal-users.component.scss']
})
export class LeftPanelCustomerPortalUsersComponent implements OnInit {
  currentUser: CurrentUser;
  open: boolean = false;
  filter: UserFilter = new UserFilter();
  @Input() activePage: string = "";
  sub: Subscription = new Subscription();
  @Output() onGoToLink = new EventEmitter();
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  constructor(private usersStateService: UsersStateService,
    private ticketsStateService: TicketsStateService,
    public companiesStateService: CompaniesStateService,
    public router: Router,) { }

  ngOnInit() {
    if (this.usersStateService.getCurrentUser()) this.getCurrentUser(this.usersStateService.getCurrentUser());
    this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.getCurrentUser(data)
    })
  }
  public setCompnayIdInfo(data) {
    localStorage.setItem("company_info_id", data);
  }
  getLinkSection(companyId, section) {
    return `company/${companyId}/${section}`;
  }
  public setTypeFilter(company, type) {
    this.ticketsStateService.onChangeTypeFilter(type);
    let ticketsFilter: TicketsFilter = new TicketsFilter();
    ticketsFilter.setCompany(company.clientCompany);
    if (company.customerUserRole.getPermission('VIEW_MY_TICKETS')) ticketsFilter.setUser(this.currentUser);
    this.ticketsStateService.onInitFilter(ticketsFilter);
    this.goToState('new-tickets');

  }
  public goToState(state) {
    //this.quoteStateService.goToState(state);
    this.onChangeState.emit(state);
  }
  public goToAllUsers(id) {
    this.goToState('new-users');
    this.onShowAllUsers(id);
  }
  onShowAllUsers(id) {
    this.filter.setClientType(null);
    this.filter.setCompany(id);
    this.setShowArchivedCompanies(false);
    this.usersStateService.onInitFilter(this.filter);
  }
  setShowArchivedCompanies(data) {
    this.usersStateService.setShowArchivedCompanies(data);
  }
  goToCompanySection(companyId, section) {
    console.log("goToCompanySection", companyId);
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().domain}/company/`, companyId, section]);
  }
  openPanel() {
    this.onOpenPanel.emit(null);
  }
  private getCurrentUser(data) {
    this.currentUser = data;
    console.log("this.currentUser", this.currentUser);
  }
}
