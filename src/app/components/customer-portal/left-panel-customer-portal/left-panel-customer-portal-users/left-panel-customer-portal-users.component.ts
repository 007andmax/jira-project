import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContractsFilter } from 'src/app/components/billing/contracts/class/contracts-filter';
import { InvoicesFilter } from 'src/app/components/billing/invoices/class/invoices-filter';
import { PaymentsFilter } from 'src/app/components/billing/payments/class/payments-filter';
import { QuoteFilter } from 'src/app/components/billing/quotes/class/quote-filter';
import { TicketsFilter } from 'src/app/components/tickets/tickets/class/tickets-filter';
import { UserCustomerCompaniesInfo } from 'src/app/components/users/class/user-customer-companies-info';
import { UserFilter } from 'src/app/components/users/class/user-filter';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';
import { PaymentsStateService } from 'src/app/states/payments/payments-state.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';

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
    public invoiceStateService: InvoiceStateService,
    private paymentsStateService: PaymentsStateService,
    private quoteStateService: QuoteStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private contractsStateService: ContractsStateService,
    private ticketsService: TicketsService,
    public router: Router,) { }

  ngOnInit() {
    if (this.usersStateService.getCurrentUser()) this.getCurrentUser(this.usersStateService.getCurrentUser());
    this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.getCurrentUser(data)
    })
  }
  getLinkSection(companyId, section) {
    return `company/${companyId}/${section}`;
  }
  public setTicketsFilter(company, type) {
    console.log("setTicketsFilter", type);
    this.ticketsStateService.setListType(type);
    this.customerPortalStateService.setTicketsFilter(company, "ALL", this.currentUser);
    this.goToState('new-tickets');
    this.ticketsService.getCount(this.customerPortalStateService.getTicketsFilter().getDataForRequest()).subscribe(data => {
      this.ticketsStateService.onInitCount(data);
    })
  }
  public getSelectedCompnayId() {
    return localStorage.getItem("company_info_id");
  }
  public goToState(state) {
    this.onChangeState.emit(state);
  }
  public setContractsFilter(company) {
    let filter: ContractsFilter = new ContractsFilter();
    filter.setCompany(company.clientCompany);
    this.contractsStateService.setContractsFilter(filter);
    this.goToState('new-contracts');
  }
  public setUsersFilter(id) {
    this.customerPortalStateService.setUsersFilter(id);
    this.setShowArchivedCompanies(false);
    this.goToState('new-users');
  }
  setShowArchivedCompanies(data) {
    this.usersStateService.setShowArchivedCompanies(data);
  }
  goToCompanySection(companyId, section) {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/company/`, companyId, section]);
  }
  openPanel() {
    this.onOpenPanel.emit(null);
  }
  setQuotesFilter(company) {
    this.customerPortalStateService.setQuotesFilter(company);
    this.goToState('quotes-component');
  }
  setPaymentsFilter(company) {
    this.customerPortalStateService.setPaymentsFilter(company)
    this.goToState('new-payments-ng2');
  }
  setInvoiceFilter(company) {
    this.customerPortalStateService.setInvoiceFilter(company)
    this.goToState('new-billable-invoices');
  }
  public trackById(index, item) {
    return item.id;
  }
  private getCurrentUser(data) {
    this.currentUser = data;
  }
}
