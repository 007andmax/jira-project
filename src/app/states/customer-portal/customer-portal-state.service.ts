import { EventEmitter, Injectable } from '@angular/core';
import { InvoicesFilter } from 'src/app/components/billing/invoices/class/invoices-filter';
import { PaymentsFilter } from 'src/app/components/billing/payments/class/payments-filter';
import { QuoteFilter } from 'src/app/components/billing/quotes/class/quote-filter';
import { TicketsFilter } from 'src/app/components/tickets/tickets/class/tickets-filter';
import { UserFilter } from 'src/app/components/users/class/user-filter';

@Injectable({
  providedIn: 'root',
})
export class CustomerPortalStateService {
  isCustomerPortal: boolean = false;
  isDefaultPage: boolean = false;
  ticketsFilter: TicketsFilter = new TicketsFilter();
  invoicesFilter: InvoicesFilter = new InvoicesFilter();
  usersFilter: UserFilter = new UserFilter();
  quotesFilter: QuoteFilter = new QuoteFilter();
  paymentsFilter: PaymentsFilter = new PaymentsFilter();
  onTicketFilters: EventEmitter<any> = new EventEmitter();
  onInvoiceFilters: EventEmitter<any> = new EventEmitter();
  onQuotesFilters: EventEmitter<any> = new EventEmitter();
  onPaymentsFilters: EventEmitter<any> = new EventEmitter();
  onUsersFilters: EventEmitter<any> = new EventEmitter();
  constructor() { }
  public setCustomerPortal(data) {
    this.isCustomerPortal = data;
  }
  public setFilters(currentUser) {
    console.log("setFilters", currentUser);
    for (let i = 0; i < currentUser.customerCompaniesInfo.length; i++) {
      let item = currentUser.customerCompaniesInfo[i];
      if (item.customerUserRole == null) continue;
      if (item.customerUserRole.getPermission('VIEW_ALL_TICKETS')) {
        this.setCompnayIdInfo(item.clientCompany.id);
        this.setTicketsFilter(item, "ALL", currentUser);
      }
      if (item.customerUserRole.getPermission('VIEW_ALL_INVOICES')) {
        this.setCompnayIdInfo(item.clientCompany.id);
        this.setInvoiceFilter(item);
      }
      if (item.customerUserRole.getPermission('VIEW_MY_PROFILE')) {
        this.setCompnayIdInfo(item.clientCompany.id);
        this.setUsersFilter(item);
      }
      if (item.customerUserRole.getPermission('VIEW_ALL_DEVICES')) {
        this.setCompnayIdInfo(item.clientCompany.id);
      }
      if (item.customerUserRole.getPermission('VIEW_ALL_QUOTES')) {
        this.setCompnayIdInfo(item.clientCompany.id);
        this.setQuotesFilter(item);
      }
      if (item.customerUserRole.getPermission('VIEW_ALL_PAYMENTS')) {
        this.setCompnayIdInfo(item.clientCompany.id);
        this.setPaymentsFilter(item);
      }

    }
  }
  public getPaymentsFilter() {
    return this.paymentsFilter;
  }
  setPaymentsFilter(company) {
    this.paymentsFilter.setCompanyId(company.clientCompany.id);
    this.onPaymentsFilters.emit(this.paymentsFilter);
  }
  setQuotesFilter(company) {
    this.quotesFilter.setCompanyId(company.clientCompany.id);
    this.onQuotesFilters.emit(this.quotesFilter);
  }
  public setUsersFilter(id) {
    this.usersFilter.setClientType(null);
    this.usersFilter.setCompany(id);
    this.onUsersFilters.emit(this.usersFilter);
  }
  setInvoiceFilter(company) {
    this.invoicesFilter.setCompanyId(company.clientCompany.id);
    this.onInvoiceFilters.emit(this.invoicesFilter);
  }
  public setTicketsFilter(company, type, currentUser) {
    this.ticketsFilter.setCompany(company.clientCompany);
    this.ticketsFilter.setListType(type);
    if (company.customerUserRole.getPermission('VIEW_MY_TICKETS') && !company.customerUserRole.getPermission('VIEW_ALL_TICKETS')) this.ticketsFilter.setUser(currentUser);
    this.onTicketFilters.emit(this.ticketsFilter);
  }
  public setCompnayIdInfo(data) {
    console.log("setCompnayIdInfo", data);
    localStorage.setItem("company_info_id", data);
  }
  public getQuotesFilter() {
    return this.quotesFilter;
  }
  public getInvoicesFilter() {
    return this.invoicesFilter;
  }
  public getTicketsFilter() {
    return this.ticketsFilter;
  }
  public getUsersFilters() {
    return this.usersFilter;
  }
  public checkEditTicket(currentUser, createdUserId, companyId) {

    if (currentUser.id === createdUserId && currentUser.customerCompaniesInfo.find(item => item.clientCompany.id === companyId).customerUserRole.getPermission('VIEW_MY_TICKETS')) return true;

    if (currentUser.id !== createdUserId && currentUser.customerCompaniesInfo.find(item => item.clientCompany.id === companyId).customerUserRole.getPermission('VIEW_MY_TICKETS') &&
      currentUser.customerCompaniesInfo.find(item => item.clientCompany.id === companyId).customerUserRole.getPermission('VIEW_ALL_TICKETS') &&
      currentUser.customerCompaniesInfo.find(item => item.clientCompany.id === companyId).customerUserRole.getPermission('EDIT_OTHER_TICKETS')) {
      console.log("currentUser.customerCompaniesInfo", currentUser.customerCompaniesInfo.find(item => item.clientCompany.id === companyId));
      console.log("checkEditTicket - 2");
      return true;
    }
    return false;
  }
}
