import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LeftPanelService {

  private apiUrl = environment.apiUrl;

  //allUsers = [];

  /**
   * Users api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,

  ) { }

  public getColors() {
    return this.http.get(this.apiUrl + 'data/getColors');
  }
  isSupportPage(state) {
    return (state === 'new-quickSupport');
  }
  isTicketsPage(state) {
    return (state === 'new-tickets'
      || state === 'new-tickets-dashboard'
      || state === 'recurring-tickets')
  }
  isUsersPage(state) {
    return (state === 'new-users')
  }
  isMarketingPage(state) {
    return (state === 'marketing')
  }
  public isCompanyPage(state) {
    return (state == 'new-companies'
      || state == 'company-dashboard'
      || state == 'company-tickets'
      || state == 'company-user'
      || state == 'company-devices'
      || state == 'company-network-scan'
      || state == 'company-password-manager'
      || state == 'company-products'
      || state == 'company-contracts'
      || state == 'company-documents')
  }
  isBillingState(state) {
    return (state === 'billing-dashboard'
      || state === 'new-services'
      || state === 'new-billable'
      || state === 'new-billable-tickets'
      || state === 'new-billable-invoices'
      || state === 'quotes-component'
      || state === 'new-payments-ng2'
      || state === 'new-contracts')
  }
  isInventoryState(state) {
    return (state === 'inventory')
  }
  isPasswordManagerState(state) {
    return (state === 'password-manager')
  }
  isDocumentsState(state) {
    return (state === 'new-documents' ||
      state === 'new-category-documents' ||
      state === 'new-add-documents' ||
      state === 'new-edit-documents' ||
      state === 'new-template-documents')
  }
  isReportsState(state) {
    return (state === 'new-reports')
  }
  public isSettingsPage(state) {
    return (state === 'myprofile-component'
      || state === 'manage-tags-component'
      || state === 'products-settings'
      || state === 'glnumber-component'
      || state === 'company-profile-component'
      || state === 'tech-component'
      || state === 'email-setting-component'
      || state === 'taxes-component'
      || state === 'permission-manage-component'
      || state === 'email-templete-component'
      || state === 'integrations-component'
      || state === 'invoice-ticket-component'
      || state === 'commission-component'
      || state === 'ticket-settings'
      || state === 'crm-settings'
      || state === 'marketing-email'
      || state === 'subscription-component')
  }
}
