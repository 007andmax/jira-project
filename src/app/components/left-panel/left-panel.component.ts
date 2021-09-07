import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from '../../states/left-panel/left-panel-state.service';
import { LeftPanelBillingComponent } from './left-panel-billing/left-panel-billing.component';
import { LeftPanelCompaniesComponent } from './left-panel-companies/left-panel-companies.component';
import { LeftPanelCompanyComponent } from './left-panel-company/left-panel-company.component';
import { LeftPanelDocumentsComponent } from './left-panel-documents/left-panel-documents.component';
import { LeftPanelSettingsComponent } from './left-panel-settings/left-panel-settings.component';
import { LeftPanelSupportComponent } from './left-panel-support/left-panel-support.component';
import { LeftPanelTicketsComponent } from './left-panel-tickets/left-panel-tickets.component';
import { LeftPanelUsersComponent } from './left-panel-users/left-panel-users.component';

/**
 * Left panel component
 */
@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {

  toggleLeftPanel: boolean = false;
  state: string = '';
  @ViewChild('panelBilling') panelBilling: LeftPanelBillingComponent;
  @ViewChild('panelCompanies') panelCompanies: LeftPanelCompaniesComponent;

  @ViewChild('panelSettings') panelSettings: LeftPanelSettingsComponent;
  @ViewChild('panelDocuments') panelDocuments: LeftPanelDocumentsComponent;
  @ViewChild('panelSupport') panelSupport: LeftPanelSupportComponent;
  @ViewChild('panelTickets') panelTickets: LeftPanelTicketsComponent;
  @ViewChild('panelUsers') panelUsers: LeftPanelUsersComponent;


  /**
   * Creates an instance of the LeftPanelComponent with the injected services
   * @param {Router} router Service to work with router
   */
  constructor(
    private router: Router,
    private leftPanelStateService: LeftPanelStateService,
    public companiesStateService: CompaniesStateService,
    public cd: ChangeDetectorRef,
  ) { }

  /**
   * Initializes left panel. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      this.toggleLeftPanel = data;
    })
    this.router.events
      .subscribe((event) => {

        if (window.location.href.includes('report')) {
          this.leftPanelStateService.toggleLeftPanel(true);
        } else {
          this.leftPanelStateService.toggleLeftPanel(false);
        }
        if (this.state === '') {
          if (window.location.href.includes(`/companies`)) this.state = 'new-companies';
          if (window.location.href.includes(`/billing-dashboard`)) this.state = 'billing-dashboard';
          if (window.location.href.includes(`/default-services`)) this.state = 'new-services';
          if (window.location.href.includes(`/billable`)) this.state = 'new-billable';
          if (window.location.href.includes(`/invoices`)) this.state = 'new-billable-invoices';
          if (window.location.href.includes(`/quotes`)) this.state = 'quotes-component';
          if (window.location.href.includes(`/payments`)) this.state = 'new-payments-ng2';
          if (window.location.href.includes(`/contracts`)) this.state = 'new-contracts';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`dashboard`)) this.state = 'company-dashboard';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`tickets`)) this.state = 'company-tickets';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`user`)) this.state = 'company-user';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`devices`)) this.state = 'company-devices';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`network-scan`)) this.state = 'company-network-scan';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`password-manager`)) this.state = 'company-password-manager';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`products`)) this.state = 'company-products';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`contracts`)) this.state = 'company-contracts';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`documents`)) this.state = 'company-documents';

          if (window.location.href.includes(`/inventory/products`)) this.state = 'inventory';
          if (window.location.href.includes(`/password-manager`)) this.state = 'password-manager';
          if (window.location.href.includes(`/setting/myprofile`)) this.state = 'myprofile-component';
          if (window.location.href.includes(`/setting/tags`)) this.state = 'manage-tags-component';
          if (window.location.href.includes(`/setting/glnumber`)) this.state = 'glnumber-component';
          if (window.location.href.includes(`/setting/companyprofile`)) this.state = 'company-profile-component';
          if (window.location.href.includes(`/setting/techUsers`)) this.state = 'tech-component';
          if (window.location.href.includes(`/setting/emailSetting`)) this.state = 'email-setting-component';
          if (window.location.href.includes(`/setting/taxes`)) this.state = 'taxes-component';
          if (window.location.href.includes(`/setting/permission`)) this.state = 'permission-manage-component';
          if (window.location.href.includes(`/setting/emailTemplete`)) this.state = 'email-templete-component';
          if (window.location.href.includes(`/setting/integration`)) this.state = 'integrations-component';
          if (window.location.href.includes(`/setting/invoiceTickets`)) this.state = 'invoice-ticket-component';
          if (window.location.href.includes(`/setting/commission`)) this.state = 'commission-component';
          if (window.location.href.includes(`/setting/subscription`)) this.state = 'subscription-component';
          if (window.location.href.includes(`/users`)) this.state = 'new-users';
          if (window.location.href.includes(`/reports`)) this.state = 'new-reports';
          if (window.location.href.includes(`/tickets-dashboard`)) this.state = 'new-tickets-dashboard';
          if (window.location.href.includes(`/tickets`)) this.state = 'new-tickets';
          if (window.location.href.includes(`/recurring-tickets`)) this.state = 'recurring-tickets';
          if (window.location.href.includes(`/quickSupport`)) this.state = 'new-quickSupport';
          if (window.location.href.includes(`/billable-tickets`)) this.state = 'new-billable-tickets';
          if (window.location.href.includes(`/documents`)) this.state = 'new-documents';
          if (window.location.href.includes(`/documents/add`)) this.state = 'new-add-documents';
          if (window.location.href.includes(`/documents/category`)) this.state = 'new-category-documents';
          if (window.location.href.includes(`/documents/edit`)) this.state = 'new-edit-documents';
          if (window.location.href.includes(`/documents/templates`)) this.state = 'new-template-documents';
          if (window.location.href.includes(`/documents/preview`)) this.state = 'new-preview-documents';





          if (window.location.href.includes(`/report/byProducts`)) this.state = 'byProducts';
          if (window.location.href.includes(`/report/byCustomers`)) this.state = 'byCustomers';
          if (window.location.href.includes(`/report/byTaxes`)) this.state = 'byTaxes';
          if (window.location.href.includes(`/report/common-commissions`)) this.state = 'common-commissions';
          if (window.location.href.includes(`/report/detailed-commissions`)) this.state = 'detailed-commissions';
          if (window.location.href.includes(`/report/accounts-receivable`)) this.state = 'accounts-receivable';
          if (window.location.href.includes(`/report/accounting-report`)) this.state = 'accounting-report';
          if (window.location.href.includes(`/report/remote-access`)) this.state = 'remote-access';
          if (window.location.href.includes(`/report/software-summary`)) this.state = 'software-summary';
          if (window.location.href.includes(`/report/hardware-summary`)) this.state = 'hardware-summary';
          if (window.location.href.includes(`/report/device-ip-summary`)) this.state = 'device-ip-summary';
          if (window.location.href.includes(`/report/tech-sales`)) this.state = 'tech-sales';
          if (window.location.href.includes(`/report/tech-ticket`)) this.state = 'tech-ticket';
          if (window.location.href.includes(`/report/tech-service`)) this.state = 'tech-service';
          if (window.location.href.includes(`/report/ticket-report`)) this.state = 'ticket-report';
          if (window.location.href.includes(`/report/service-report`)) this.state = 'service-report';
          if (window.location.href.includes(`/report/income-accounts`)) this.state = 'income-accounts';

          if (this.state === '' && this.companiesStateService.getCurrentCompany()) this.goToDefaultPage();

          this.leftPanelStateService.firstOpen(this.state);
          this.leftPanelStateService.changeState(this.state);
          this.cd.detectChanges();
        }

      });
    this.leftPanelStateService.onGoToState.subscribe(data => {
      this.onChangeState(data);
    })
    this.leftPanelStateService.onOpenCompanyPage.subscribe(data => {
      this.panelBilling.close();

      this.panelSettings.close();
      this.panelSupport.close();
      this.panelTickets.close();
      this.panelUsers.close();
      this.panelDocuments.close();

      this.panelCompanies.openPanel();
      this.panelCompanies.togglePanel(true);
    })
    this.leftPanelStateService.onChangeStateWithoutNavigate.subscribe(data => {
      this.state = data;
      this.cd.detectChanges();
    })
    this.companiesStateService.onCurrentCompany.subscribe(data => {
      if (this.state === '') {
        this.leftPanelStateService.firstOpen(this.state);
        this.leftPanelStateService.changeState(this.state);
        this.cd.detectChanges();
        this.goToDefaultPage();
      }
    })
  }
  goToDefaultPage() {
    this.state = 'new-tickets';
    this.goToLink('tickets');
  }
  onOpenPanel() {
    this.leftPanelStateService.toggleLeftPanel(false);
  }
  onToggleLeftPanel() {
    this.toggleLeftPanel = !this.toggleLeftPanel;
    this.leftPanelStateService.toggleLeftPanel(this.toggleLeftPanel);
    this.cd.detectChanges();
  }

  public goToLink(url) {
    this.router.navigate([`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/${url}`]);
  }
  onChangeState(data) {
    console.log("data", data);
    console.log("this.state", this.state);
    if (this.state !== data) {
      this.state = data;
      if (this.state === 'new-companies') this.goToLink(`companies`);
      if (this.state === 'billing-dashboard') this.goToLink('billing-dashboard');
      if (this.state === 'new-services') this.goToLink('default-services');
      if (this.state === 'new-billable') this.goToLink('billable');
      if (this.state === 'new-billable-invoices') this.goToLink('invoices');
      if (this.state === 'quotes-component') this.goToLink('quotes');
      if (this.state === 'new-payments-ng2') this.goToLink('payments');
      if (this.state === 'new-contracts') this.goToLink('contracts');
      if (this.state === 'company-dashboard') this.goToLink(`company/dashboard/${this.companiesStateService.getSelectedCompanyId()}`);
      if (this.state === 'company-tickets') this.goToLink('company/tickets');
      if (this.state === 'company-user') this.goToLink('company/user');
      if (this.state === 'company-devices') this.goToLink('company/devices');
      if (this.state === 'company-network-scan') this.goToLink('company/network-scan');
      if (this.state === 'company-password-manager') this.goToLink('company/password-manager');
      if (this.state === 'company-products') this.goToLink('company/products');
      if (this.state === 'company-contracts') this.goToLink('company/contracts');
      if (this.state === 'inventory') this.goToLink(`inventory/products`);
      if (this.state === 'password-manager') this.goToLink(`password-manager`);
      if (this.state === 'myprofile-component') this.goToLink('setting/myprofile');
      if (this.state === 'manage-tags-component') this.goToLink('setting/tags');
      if (this.state === 'glnumber-component') this.goToLink('setting/glnumber');
      if (this.state === 'company-profile-component') this.goToLink('setting/companyprofile');
      if (this.state === 'tech-component') this.goToLink('setting/techUsers');
      if (this.state === 'email-setting-component') this.goToLink('setting/emailSetting');
      if (this.state === 'taxes-component') this.goToLink('setting/taxes');
      if (this.state === 'permission-manage-component') this.goToLink('setting/permission');
      if (this.state === 'email-templete-component') this.goToLink('setting/emailTemplete');
      if (this.state === 'integrations-component') this.goToLink('setting/integration');
      if (this.state === 'invoice-ticket-component') this.goToLink('setting/invoiceTickets');
      if (this.state === 'commission-component') this.goToLink('setting/commission');
      if (this.state === 'subscription-component') this.goToLink('setting/subscription');
      if (this.state === 'new-users') this.goToLink('users');
      if (this.state === 'new-reports') this.goToLink('reports');
      if (this.state === 'new-tickets-dashboard') this.goToLink('tickets-dashboard');
      if (this.state === 'new-tickets') this.goToLink('tickets');
      if (this.state === 'recurring-tickets') this.goToLink('recurring-tickets');
      if (this.state === 'new-quickSupport') this.goToLink('quickSupport');
      if (this.state === 'new-billable-tickets') this.goToLink('billable-tickets');
      if (this.state === 'new-documents') this.goToLink('documents');
      if (this.state === 'new-add-documents') this.goToLink('documents/add');
      if (this.state === 'new-template-documents') this.goToLink('documents/templates');
      if (this.state === 'company-documents') this.goToLink(`company/${this.companiesStateService.getSelectedCompanyId()}/documents`);


      if (this.state === 'byProducts' ||
        this.state === 'byCustomers' ||
        this.state === 'byTaxes' ||
        this.state === 'common-commissions' ||
        this.state === 'detailed-commissions' ||
        this.state === 'accounts-receivable' ||
        this.state === 'accounting-report' ||
        this.state === 'remote-access' ||
        this.state === 'software-summary' ||
        this.state === 'hardware-summary' ||
        this.state === 'device-ip-summary' ||
        this.state === 'tech-sales' ||
        this.state === 'tech-ticket' ||
        this.state === 'tech-service' ||
        this.state === 'ticket-report' ||
        this.state === 'service-report' ||
        this.state === 'income-accounts') this.goToLink('report/' + this.state);


      this.leftPanelStateService.changeState(this.state);
      this.cd.detectChanges();
    }
  }


}
