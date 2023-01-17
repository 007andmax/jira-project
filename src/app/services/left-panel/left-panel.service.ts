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
  isTicketDetailPage(state) {
    return (state === 'ticket-detail')
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
      || state == 'company-network-scan-beta'
      || state == 'company-network-scan'
      || state == 'company-password-manager'
      || state == 'company-products'
      || state == 'company-contracts'
      || state == 'company-documents'
      || state == 'new-edit-documents-company'
      || state == 'new-add-documents-company'
      || state == 'company-devices-beta')
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
    return (state === 'new-reports' ||
      state === 'byProducts' ||
      state === 'byCustomers' ||
      state === 'byTaxes' ||
      state === 'common-commissions' ||
      state === 'detailed-commissions' ||
      state === 'accounts-receivable' ||
      state === 'accounting-report' ||
      state === 'payments-report' ||
      state === 'remote-access' ||
      state === 'tech-sales' ||
      state === 'tech-ticket' ||
      state === 'tech-service' ||
      state === 'ticket-report' ||
      state === 'service-report' ||
      state === 'income-accounts')
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
      || state === 'email-template-component'
      || state === 'invoice-ticket-component'
      || state === 'commission-component'
      || state === 'ticket-settings'
      || state === 'crm-settings'
      || state === 'marketing-email'
      || state === 'device-setting-component')
  }

  public isDevicesPage(state) {
    return (state === 'new-devices'
      || state === 'report-device-summary'
      || state === 'report-device-warranty'
      || state === 'report-device-antivirus'
      || state === 'hardware-summary-device'
      || state === 'report-device-processorram'
      || state === 'report-device-diskspace'
      || state === 'device-ip-summary-device'
      || state === 'network-ip-report'
      || state === 'network-detail-report'
      || state === 'network-adapter-report'
      || state === 'software-summary-device'
      || state === 'report-device-antivirus'
      || state === 'applicationbycompany-report'
      || state === 'report-device-warranty'
      || state === 'report-device-deploymentwarranty');
  }
}
