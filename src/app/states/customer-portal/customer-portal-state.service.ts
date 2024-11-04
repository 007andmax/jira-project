import { EventEmitter, Injectable } from '@angular/core';
import { InvoicesFilter } from 'src/app/components/billing/invoices/class/invoices-filter';
import { PaymentsFilter } from 'src/app/components/billing/payments/class/payments-filter';
import { QuoteFilter } from 'src/app/components/billing/quotes/class/quote-filter';
import { TicketsFilter } from 'src/app/components/tickets/tickets/class/tickets-filter';
import { UserFilter } from 'src/app/components/users/class/user-filter';
import { TicketsStateService } from '../tickets/tickets-state.service';
import { UserFilters } from 'src/app/components/users/class/user-filters';

@Injectable({
  providedIn: 'root',
})
export class CustomerPortalStateService {
  isCustomerPortal: boolean = false;
  isDefaultPage: boolean = false;





  constructor(private ticketsStateService: TicketsStateService,) { }
  public setCustomerPortal(data) {
    this.isCustomerPortal = data;
  }
  public checkEditTicket(currentUser, createdUserId, companyId) {
    if (currentUser.customerCompaniesInfo.find(item => item.companyId === companyId).customerUserRole.getPermission('EDIT_OTHER_TICKETS') ||
      currentUser.id == createdUserId) {
      return true;
    }
    return false;
  }
  getPermissionCustomerUser(currentUser, permission) {
    return currentUser.customerCompaniesInfo.some(item => item.customerUserRole.getPermission(permission));
  }
  public checkShowTabTicketsAsideUserDetail(currentUser, user) {
    if (this.isCustomerPortal && this.getPermissionCustomerUser(currentUser, 'VIEW_ALL_TICKETS')
      && currentUser.id != user.id || currentUser.id == user.id || !this.isCustomerPortal) {
      return true;
    } else {
      return false;
    }
  }
  public checkEditUser(currentUser, user) {
    if (this.isCustomerPortal
      && this.getPermissionCustomerUser(currentUser, 'EDIT_USERS')
      && currentUser.id !== user.id
      || this.isCustomerPortal
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
