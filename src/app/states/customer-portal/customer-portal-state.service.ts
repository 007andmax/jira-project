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
  public setFilters(currentUser, state) {
    console.log("setFilters", currentUser);


    let item = currentUser.customerCompaniesInfo.find(item => item.companyId === localStorage.getItem('company_info_id'))
    if (item.customerUserRole == null) return;
    if (item.customerUserRole.getPermission('VIEW_ALL_TICKETS') && state == 'new-tickets') {
      // this.setCompnayIdInfo(item.companyId);
      this.setTicketsFilter(item, "ALL", currentUser);
    }
    if (item.customerUserRole.getPermission('VIEW_ALL_INVOICES') && state == 'new-billable-invoices') {
      //  this.setCompnayIdInfo(item.companyId);
      this.setInvoiceFilter(item);
    }
    if (item.customerUserRole.getPermission('VIEW_MY_PROFILE') && state == 'new-users') {
      //  this.setCompnayIdInfo(item.companyId);
      this.setUsersFilter(item.companyId);
    }
    if (item.customerUserRole.getPermission('VIEW_ALL_DEVICES') && state == 'company-devices') {
      //   this.setCompnayIdInfo(item.companyId);
    }
    if (item.customerUserRole.getPermission('VIEW_ALL_QUOTES') && state == 'quotes-component') {
      //   this.setCompnayIdInfo(item.companyId);
      this.setQuotesFilter(item);
    }
    if (item.customerUserRole.getPermission('VIEW_ALL_PAYMENTS') && state == 'new-payments-ng2') {
      //    this.setCompnayIdInfo(item.companyId);
      this.setPaymentsFilter(item);
    }


  }
  public getPaymentsFilter() {
    return this.paymentsFilter;
  }
  setPaymentsFilter(company) {
    this.paymentsFilter.setCompanyId(company.companyId);
    this.onPaymentsFilters.emit(this.paymentsFilter);
  }
  setQuotesFilter(company) {
    this.quotesFilter.setCompanyId(company.companyId);
    this.onQuotesFilters.emit(this.quotesFilter);
  }
  public setUsersFilter(id) {
    this.usersFilter.setClientType(null);
    this.usersFilter.setCompany(id);
    this.onUsersFilters.emit(this.usersFilter);
  }
  setInvoiceFilter(company) {
    this.invoicesFilter.setCompanyId(company.companyId);
    this.onInvoiceFilters.emit(this.invoicesFilter);
  }
  public setTicketsFilter(company, type, currentUser) {
    this.ticketsFilter.setCompany({ id: company.companyId });
    this.ticketsFilter.setListType(type);
    if (company.customerUserRole.getPermission('VIEW_MY_TICKETS') && !company.customerUserRole.getPermission('VIEW_ALL_TICKETS')) this.ticketsFilter.setUser(currentUser);
    if (company.customerUserRole.getPermission('VIEW_MY_TICKETS') && company.customerUserRole.getPermission('VIEW_ALL_TICKETS')) this.ticketsFilter.setUser(null);
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
    console.log(currentUser.customerCompaniesInfo.find(item => item.companyId === companyId));
    if (currentUser.id === createdUserId && currentUser.customerCompaniesInfo.find(item => item.companyId === companyId).customerUserRole.getPermission('VIEW_MY_TICKETS')) return true;

    if (currentUser.id !== createdUserId && currentUser.customerCompaniesInfo.find(item => item.companyId === companyId).customerUserRole.getPermission('VIEW_MY_TICKETS') &&
      currentUser.customerCompaniesInfo.find(item => item.companyId === companyId).customerUserRole.getPermission('VIEW_ALL_TICKETS') &&
      currentUser.customerCompaniesInfo.find(item => item.companyId === companyId).customerUserRole.getPermission('EDIT_OTHER_TICKETS')) {
      console.log("currentUser.customerCompaniesInfo", currentUser.customerCompaniesInfo.find(item => item.companyId === companyId));
      console.log("checkEditTicket - 2");
      return true;
    }
    return false;
  }
  getPermissionCustomerUser(currentUser, permission) {
    return currentUser.customerCompaniesInfo.find(item => item.companyId === localStorage.getItem('company_info_id')).customerUserRole.getPermission(permission);
  }
  public checkShowTabTicketsAsideUserDetail(currentUser, user) {
    if (this.isCustomerPortal && this.getPermissionCustomerUser(currentUser, 'VIEW_MY_TICKETS')
      && this.getPermissionCustomerUser(currentUser, 'VIEW_ALL_TICKETS')
      && this.getPermissionCustomerUser(currentUser, 'VIEW_ALL_USERS')
      && this.getPermissionCustomerUser(currentUser, 'VIEW_MY_PROFILE')
      && currentUser.id != user.id || this.isCustomerPortal && this.getPermissionCustomerUser(currentUser, 'VIEW_MY_TICKETS') && this.getPermissionCustomerUser(currentUser, 'VIEW_MY_PROFILE') && currentUser.id == user.id || !this.isCustomerPortal) {
      return true;
    } else {
      return false;
    }
  }
  public checkEditUser(currentUser, user) {
    if (this.isCustomerPortal && this.getPermissionCustomerUser(currentUser, 'VIEW_MY_TICKETS')
      && this.getPermissionCustomerUser(currentUser, 'VIEW_MY_PROFILE')
      && this.getPermissionCustomerUser(currentUser, 'EDIT_USERS')
      && currentUser.id !== user.id
      || this.isCustomerPortal && this.getPermissionCustomerUser(currentUser, 'VIEW_MY_PROFILE')
      && currentUser.id === user.id
      || !this.isCustomerPortal) {
      return true;
    } else {
      return false;
    }
  }
  public checkRemoteAccess(currentUser) {
    if (this.isCustomerPortal && this.getPermissionCustomerUser(currentUser, 'VIEW_ALL_DEVICES') &&
      this.getPermissionCustomerUser(currentUser, 'DEVICES_REMOTE_CONTROL') || !this.isCustomerPortal) {
      return true;
    } else {
      return false;
    }
  }
}
