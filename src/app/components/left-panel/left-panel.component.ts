import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { Company } from 'src/app/interfaces/company/company';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { AppService } from 'src/app/states/app/app.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { PasswordManagerStateService } from 'src/app/states/password-manager/password-manager-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { LeftPanelStateService } from '../../states/left-panel/left-panel-state.service';
import { TicketStateService } from '../tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { User } from '../users/class/user';
import { LeftPanelBillingComponent } from './left-panel-billing/left-panel-billing.component';
import { LeftPanelCompaniesComponent } from './left-panel-companies/left-panel-companies.component';
import { LeftPanelCompanyComponent } from './left-panel-company/left-panel-company.component';
import { LeftPanelDevicesComponent } from './left-panel-devices/left-panel-devices.component';
import { LeftPanelDocumentsComponent } from './left-panel-documents/left-panel-documents.component';
import { LeftPanelInventoryComponent } from './left-panel-inventory/left-panel-inventory.component';
import { LeftPanelMarketingComponent } from './left-panel-marketing/left-panel-marketing.component';
import { LeftPanelPasswordManagerComponent } from './left-panel-password-manager/left-panel-password-manager.component';
import { LeftPanelSettingsComponent } from './left-panel-settings/left-panel-settings.component';
import { LeftPanelSupportComponent } from './left-panel-support/left-panel-support.component';
import { LeftPanelTicketsComponent } from './left-panel-tickets/left-panel-tickets.component';
import { LeftPanelUsersComponent } from './left-panel-users/left-panel-users.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';

/**
 * Left panel component
 */
@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {
  currentCompany: Company;
  currentUser: User;
  toggleLeftPanel: boolean = false;
  state: string = '';
  page: string = '';
  showMobTab = false;
  isInitPopStateNaviate: boolean = false;
  @ViewChild('panelBilling') panelBilling: LeftPanelBillingComponent;
  @ViewChild('panelCompanies') panelCompanies: LeftPanelCompaniesComponent;
  @ViewChild('panelSettings') panelSettings: LeftPanelSettingsComponent;
  @ViewChild('panelDocuments') panelDocuments: LeftPanelDocumentsComponent;
  @ViewChild('panelSupport') panelSupport: LeftPanelSupportComponent;
  @ViewChild('panelTickets') panelTickets: LeftPanelTicketsComponent;
  @ViewChild('panelUsers') panelUsers: LeftPanelUsersComponent;
  @ViewChild('panelDevices') panelDevices: LeftPanelDevicesComponent;
  @ViewChild('panelInventory') panelInventory: LeftPanelInventoryComponent;
  @ViewChild('panelMarketing') panelMarketing: LeftPanelMarketingComponent;
  @ViewChild('panelPasswordManager') panelPasswordManager: LeftPanelPasswordManagerComponent;


  /**
   * Creates an instance of the LeftPanelComponent with the injected services
   * @param {Router} router Service to work with router
   */
  constructor(
    private router: Router,
    private leftPanelStateService: LeftPanelStateService,
    public companiesStateService: CompaniesStateService,
    private ticketStateService: TicketStateService,
    private usersStateService: UsersStateService,
    private appService: AppService,
    private permissionsService: PermissionsService,
    private leftPanelService: LeftPanelService,
    public cd: ChangeDetectorRef,
    private ticketsStateService: TicketsStateService,
    private passwordManagerStateService: PasswordManagerStateService,
    private customerPortalStateService: CustomerPortalStateService,
  ) { }

  /**
   * Initializes left panel. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    if (this.usersStateService.getCurrentUser()) this.getCurrentUser(this.usersStateService.getCurrentUser());
    this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.getCurrentUser(data)
    })
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    this.companiesStateService.getOnCurrentCompany().subscribe(data => {
      this.currentCompany = this.companiesStateService.getCurrentCompany();
    });

    this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      this.toggleLeftPanel = data;
    });

    this.router.events
      .subscribe((event: any) => {
        if (event.navigationTrigger === "popstate") this.isInitPopStateNaviate = true;
        if (this.state === '' || (event instanceof NavigationEnd && this.isInitPopStateNaviate)) {
          if (window.location.href.includes(`/companies`)) this.state = 'new-companies';
          if (window.location.href.includes(`/billing-dashboard`)) this.state = 'billing-dashboard';
          if (window.location.href.includes(`/non-contract-services`)) this.state = 'non-contract-services';
          if (window.location.href.includes(`/billable`)) this.state = 'new-billable';
          if (window.location.href.includes(`/invoices`)) this.state = 'new-billable-invoices';
          if (window.location.href.includes(`/quotes`)) this.state = 'quotes-component';
          if (window.location.href.includes(`/payments`)) this.state = 'new-payments-ng2';
          if (window.location.href.includes(`/contracts`)) this.state = 'new-contracts';
          if (window.location.href.includes(`/default`)) this.state = 'default';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`dashboard`)) this.state = 'company-dashboard';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`tickets`)) this.state = 'company-tickets';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`user`)) this.state = 'company-user';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`devices`)) this.state = 'company-devices';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`devices-beta`)) this.state = 'company-devices-beta';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`network-scan-beta`)) this.state = 'company-network-scan-beta';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`network-scan`)) this.state = 'company-network-scan';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`password-manager`)) this.state = 'company-password-manager';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`products`)) this.state = 'company-products';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`contracts`)) this.state = 'company-contracts';
          if (window.location.href.includes(`/company/`) && window.location.href.includes(`documents`)) this.state = 'company-documents';


          if (window.location.href.includes(`/inventory/products`)) this.state = 'inventory';
          if (window.location.href.includes(`/password-manager`)) this.state = 'password-manager';
          if (window.location.href.includes(`/setting/myprofile`)) this.state = 'myprofile-component';
          if (window.location.href.includes(`/setting/tags`)) this.state = 'manage-tags-component';
          if (window.location.href.includes(`/setting/products-settings`)) this.state = 'products-settings';
          if (window.location.href.includes(`/setting/glnumber`)) this.state = 'glnumber-component';
          if (window.location.href.includes(`/setting/companyprofile`)) this.state = 'company-profile-component';
          if (window.location.href.includes(`/setting/techUsers`)) this.state = 'tech-component';
          if (window.location.href.includes(`/setting/emailSetting`)) this.state = 'email-setting-component';
          if (window.location.href.includes(`/setting/taxes`)) this.state = 'taxes-component';
          if (window.location.href.includes(`/setting/permission`)) this.state = 'permission-manage-component';
          if (window.location.href.includes(`/setting/emailTemplate`)) this.state = 'email-template-component';
          if (window.location.href.includes(`/setting/finance`)) this.state = 'invoice-ticket-component';
          if (window.location.href.includes(`/setting/commission`)) this.state = 'commission-component';
          if (window.location.href.includes(`/setting/subscription`)) this.state = 'subscription-component';
          if (window.location.href.includes(`/setting/deviceSetting`)) this.state = 'device-setting-component';
          if (window.location.href.includes(`/setting/ticket-settings`)) this.state = 'ticket-settings';
          if (window.location.href.includes(`/setting/crm-settings`)) this.state = 'crm-settings';
          if (window.location.href.includes(`/setting/marketing-email`)) this.state = 'marketing-email';
          if (window.location.href.includes(`/setting/customer-portal`)) this.state = 'customer-portal';

          if (window.location.href.includes(`/contract-statistics`)) this.state = 'contract-statistics';
          if (window.location.href.includes(`/support-page`)) this.state = 'support-page';
          if (window.location.href.includes(`/tech-companies`)) this.state = 'tech-companies';
          if (window.location.href.includes(`/knowledge-base`)) this.state = 'knowledge-base';

          if (window.location.href.includes(`/users`)) this.state = 'new-users';
          if (!window.location.href.includes(`/setting/marketing-email`) && window.location.href.includes(`/marketing`)) this.state = 'marketing';
          if (window.location.href.includes(`/reports`)) this.state = 'new-reports';
          if (window.location.href.includes(`/tickets-dashboard`)) this.state = 'new-tickets-dashboard';
          if (window.location.href.includes(`/tickets`) && !window.location.href.includes(`/tickets-dashboard`)) this.state = 'new-tickets';
          if (window.location.href.includes(`/ticket/`)) {
            this.state = 'ticket-detail';
          }
          if (window.location.href.includes(`/recurring-tickets`)) this.state = 'recurring-tickets';
          if (window.location.href.includes(`/quickSupport`)) this.state = 'new-quickSupport';
          if (window.location.href.includes(`/billable-tickets`) && !window.location.href.includes(`/billable`)) this.state = 'new-billable-tickets';
          if (window.location.href.includes(`/documents`)) this.state = 'new-documents';
          if (window.location.href.includes(`/documents/add`)) this.state = 'new-add-documents';
          if (window.location.href.includes(`/documents/add`) && this.companiesStateService.getCompanyRoutingId()) this.state = 'new-add-documents-company';
          if (window.location.href.includes(`/documents/category`)) this.state = 'new-category-documents';
          if (window.location.href.includes(`/documents/edit`)) this.state = 'new-edit-documents';
          if (window.location.href.includes(`/documents/edit`) && this.companiesStateService.getCompanyRoutingId()) this.state = 'new-edit-documents-company';
          if (window.location.href.includes(`/documents/templates`)) this.state = 'new-template-documents';
          if (window.location.href.includes(`/documents/preview`)) this.state = 'new-preview-documents';



          if (window.location.href.includes(`/report/byProducts`)) this.state = 'byProducts';
          if (window.location.href.includes(`/report/byCustomers`)) this.state = 'byCustomers';
          if (window.location.href.includes(`/report/block-time-report`)) this.state = 'block-time-report';
          if (window.location.href.includes(`/report/byTaxes`)) this.state = 'byTaxes';
          if (window.location.href.includes(`/report/common-commissions`)) this.state = 'common-commissions';
          if (window.location.href.includes(`/report/detailed-commissions`)) this.state = 'detailed-commissions';
          if (window.location.href.includes(`/report/accounts-receivable`)) this.state = 'accounts-receivable';
          if (window.location.href.includes(`/report/customer-transaction-history`)) this.state = 'customer-transaction-history';
          if (window.location.href.includes(`/report/payments-report`)) this.state = 'payments-report';
          if (window.location.href.includes(`/report/remote-access`)) this.state = 'remote-access';
          if (window.location.href.includes(`/report/software-summary`)) this.state = 'software-summary';
          if (window.location.href.includes(`/report/software-summary-device`)) this.state = 'software-summary-device';
          if (window.location.href.includes(`/report/hardware-summary`)) this.state = 'hardware-summary';
          if (window.location.href.includes(`/report/hardware-summary-device`)) this.state = 'hardware-summary-device';
          if (window.location.href.includes(`/report/report-device-warranty`)) this.state = 'report-device-warranty';
          if (window.location.href.includes(`/report/report-device-antivirus`)) this.state = 'report-device-antivirus';
          if (window.location.href.includes(`/report/network-ip-report`)) this.state = 'network-ip-report';
          if (window.location.href.includes(`/report/device-ip-summary`)) this.state = 'device-ip-summary';
          if (window.location.href.includes(`/report/device-ip-summary-device`)) this.state = 'device-ip-summary-device';
          if (window.location.href.includes(`/report/report-device-summary`)) this.state = 'report-device-summary';
          if (window.location.href.includes(`/report/network-detail-report`)) this.state = 'network-detail-report';
          if (window.location.href.includes(`/report/network-adapter-report`)) this.state = 'network-adapter-report';
          if (window.location.href.includes(`/report/report-device-deploymentwarranty`)) this.state = 'report-device-deploymentwarranty';
          if (window.location.href.includes(`/report/report-device-processorram`)) this.state = 'report-device-processorram';
          if (window.location.href.includes(`/report/report-device-diskspace`)) this.state = 'report-device-diskspace';
          if (window.location.href.includes(`/report/applicationbycompany-report`)) this.state = 'applicationbycompany-report';
          if (window.location.href.includes(`/report/tech-sales`)) this.state = 'tech-sales';
          if (window.location.href.includes(`/report/tech-ticket`)) this.state = 'tech-ticket';
          if (window.location.href.includes(`/report/tech-service`)) this.state = 'tech-service';
          if (window.location.href.includes(`/report/ticket-report`)) this.state = 'ticket-report';
          if (window.location.href.includes(`/report/service-report`)) this.state = 'service-report';
          if (window.location.href.includes(`/report/income-accounts`)) this.state = 'income-accounts';
          if (window.location.href.includes(`/devices`)) this.state = 'new-devices';
          if (window.location.href.includes(`/devices/reports`)) this.state == 'new-device-summary';
          if (window.location.href.includes(`/help-center`)) this.state = 'help-center';
          if (window.location.href.includes(`/device/`)) this.state = 'new-device';
          if (this.state === '' && this.companiesStateService.getCurrentCompany() && this.usersStateService.getCurrentUser().role !== "SUPER_ADMIN" && !this.customerPortalStateService.isCustomerPortal) this.goToDefaultPage();
          this.leftPanelStateService.firstOpen(this.state);
          this.leftPanelStateService.changeState(this.state);
          if (!this.cd['destroyed']) {
            this.cd.detectChanges();
          }
          this.updatePage(this.state);
          if (this.isInitPopStateNaviate) this.leftPanelStateService.toggleLeftPanel(false);
          this.isInitPopStateNaviate = false;
        }
      });

    this.leftPanelStateService.onGoToState.subscribe(data => {
      this.onChangeState(data);
    })
    this.leftPanelStateService.onOpenCompanyPage.subscribe(data => {
      if (this.panelBilling) this.panelBilling.close();

      if (this.panelSettings) this.panelSettings.close();
      if (this.panelSupport) this.panelSupport.close();
      if (this.panelTickets) this.panelTickets.close();
      if (this.panelUsers) this.panelUsers.close();
      if (this.panelDocuments) this.panelDocuments.close();
      if (this.panelDevices) this.panelDevices.close();

      if (this.panelCompanies) this.panelCompanies.openPanel();
      if (this.panelCompanies) this.panelCompanies.togglePanel(true);
    })
    this.leftPanelStateService.onChangeStateWithoutNavigate.subscribe(data => {
      this.state = data;
      if (!this.cd['destroyed']) {
        this.updatePage(this.state);
        this.cd.detectChanges();
      }
    })
    /* this.companiesStateService.onCurrentCompany.subscribe(data => {
       if (this.state === '') {
         this.leftPanelStateService.firstOpen(this.state);
         this.leftPanelStateService.changeState(this.state);
         this.cd.detectChanges();
         this.goToDefaultPage();
       }
     })*/
  }
  private getCurrentUser(data) {
    this.currentUser = data;
  }
  goToDefaultPage() {
    this.state = 'new-tickets';
    this.goToLink('tickets');
  }
  updatePage(data) {
    if (this.leftPanelService.isSupportPage(data)) this.page = "SUPPORT";
    if (this.leftPanelService.isTicketsPage(data)) this.page = "TICKETS";
    if (this.leftPanelService.isTicketDetailPage(data)) this.page = "TICKET-DETAIL";
    if (this.leftPanelService.isUsersPage(data)) {
      this.page = "USERS";
      if (this.panelUsers) this.panelUsers.getUsersCount();
    }
    if (this.leftPanelService.isMarketingPage(data)) this.page = "MARKETING";
    if (this.leftPanelService.isCompanyPage(data)) this.page = "COMPANIES";
    if (this.leftPanelService.isBillingState(data)) this.page = "BILLING";
    if (this.leftPanelService.isInventoryState(data)) this.page = "INVENTORY";
    if (this.leftPanelService.isPasswordManagerState(data)) this.page = "PASSWORD_MANAGER";
    if (this.leftPanelService.isDocumentsState(data)) this.page = "DOCUMENTS";
    if (this.leftPanelService.isReportsState(data)) this.page = "REPORTS";
    if (this.leftPanelService.isSettingsPage(data)) this.page = "SETTINGS";
    if (this.leftPanelService.isDevicesPage(data)) this.page = "DEVICES";
  }
  setDefaultTypeFilter() {
    this.panelTickets.setTypeFilter(this.currentUser.startPage == "MY_TICKETS" ? "USERS" : this.currentUser.startPage)
    this.ticketsStateService.onChangeTypeFilter(this.currentUser.startPage == "MY_TICKETS" ? "USERS" : this.currentUser.startPage);
    this.ticketsStateService.onChangeLeftPanelFilter(this.currentUser.startPage == "MY_TICKETS" ? "USERS" : this.currentUser.startPage);
  }
  changePage(page) {
    this.page = page;
    if (this.page === "PASSWORD_MANAGER" && this.passwordManagerStateService.getCategories().length === 0) this.passwordManagerStateService.onInit();
  }
  onOpenPanel() {
    this.showMobTab = !this.showMobTab;
    this.leftPanelStateService.toggleLeftPanel(false);
  }
  onToggleLeftPanel() {
    this.toggleLeftPanel = !this.toggleLeftPanel;
    this.leftPanelStateService.toggleLeftPanel(this.toggleLeftPanel);
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
  onHideLeftPanel() {
    this.toggleLeftPanel = true;
    this.leftPanelStateService.toggleLeftPanel(this.toggleLeftPanel);
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
  public logOut() {
    window.location.href = '/logout';
    window.location.hash = '';
  }
  public goToLink(url) {
    this.router.navigate([`${this.companiesStateService.getCurrentCompany().techDomain}/${url}`]);
  }
  onChangeState(data) {
    if (this.state !== data) {
      this.state = data;
      if (this.state === 'contract-statistics') this.goToLink(`contract-statistics`);
      if (this.state === 'new-companies') this.goToLink(`companies`);
      if (this.state === 'billing-dashboard') this.goToLink('billing-dashboard');
      if (this.state === 'non-contract-services') this.goToLink('non-contract-services');
      if (this.state === 'default') this.goToLink('default');
      if (this.state === 'new-billable') this.goToLink('billable');
      if (this.state === 'new-billable-invoices') this.goToLink('invoices');
      if (this.state === 'quotes-component') this.goToLink('quotes');
      if (this.state === 'new-payments-ng2') this.goToLink('payments');
      if (this.state === 'new-contracts') this.goToLink('contracts');
      if (this.state === 'company-dashboard') this.goToLink(`company/dashboard/${this.companiesStateService.getCompanyRoutingId()}`);
      if (this.state === 'company-tickets') this.goToLink('company/tickets');
      if (this.state === 'company-user') this.goToLink('company/user');
      if (this.state === 'company-devices') this.goToLink('company/devices');
      if (this.state === 'company-network-scan-beta') this.goToLink('company/network-scan-beta');
      if (this.state === 'company-network-scan') this.goToLink('company/network-scan');
      if (this.state === 'company-password-manager') this.goToLink('company/password-manager');
      if (this.state === 'company-products') this.goToLink('company/products');
      if (this.state === 'company-contracts') this.goToLink('company/contracts');
      if (this.state === 'inventory') this.goToLink(`inventory/products`);
      if (this.state === 'password-manager') this.goToLink(`password-manager`);
      if (this.state === 'myprofile-component') this.goToLink('setting/myprofile');
      if (this.state === 'manage-tags-component') this.goToLink('setting/tags');
      if (this.state === 'products-settings') this.goToLink('setting/products-settings');
      if (this.state === 'glnumber-component') this.goToLink('setting/glnumber');
      if (this.state === 'company-profile-component') this.goToLink('setting/companyprofile');
      if (this.state === 'tech-component') this.goToLink('setting/techUsers');
      if (this.state === 'email-setting-component') this.goToLink('setting/emailSetting');
      if (this.state === 'taxes-component') this.goToLink('setting/taxes');
      if (this.state === 'permission-manage-component') this.goToLink('setting/permission');
      if (this.state === 'email-template-component') this.goToLink('setting/emailTemplate');
      if (this.state === 'invoice-ticket-component') this.goToLink('setting/finance');
      if (this.state === 'crm-settings') this.goToLink('setting/crm-settings');
      if (this.state === 'commission-component') this.goToLink('setting/commission');
      if (this.state === 'subscription-component') this.goToLink('setting/subscription');
      if (this.state === 'device-setting-component') this.goToLink('setting/deviceSetting');
      if (this.state === 'ticket-settings') this.goToLink('setting/ticket-settings');
      if (this.state === 'marketing-email') this.goToLink('setting/marketing-email');
      if (this.state === 'customer-portal') this.goToLink('setting/customer-portal');

      if (this.state === 'new-users') this.goToLink('users');
      if (this.state === 'marketing') this.goToLink('marketing');
      if (this.state === 'new-reports') this.goToLink('reports');
      if (this.state === 'new-tickets-dashboard') this.goToLink('tickets-dashboard');
      if (this.state === 'new-tickets') this.goToLink('tickets');
      if (this.state === 'ticket-detail') {
        this.goToLink(`ticket/${this.ticketStateService.getTicketRoutingId()}`);
        this.onHideLeftPanel();
      }
      if (this.state === 'recurring-tickets') this.goToLink('recurring-tickets');
      if (this.state === 'new-quickSupport') this.goToLink('quickSupport');
      if (this.state === 'new-billable-tickets') this.goToLink('billable-tickets');
      if (this.state === 'new-documents') this.goToLink('documents');
      if (this.state === 'new-add-documents') this.goToLink('documents/add');
      if (this.state === 'new-template-documents') this.goToLink('documents/templates');
      if (this.state === 'support-page') this.goToLink('support-page');
      if (this.state === 'tech-companies') this.goToLink('tech-companies');
      if (this.state === 'knowledge-base') this.goToLink('knowledge-base');

      if (this.state === 'company-documents') this.goToLink(`company/${this.companiesStateService.getCompanyRoutingId()}/documents`);
      if (this.state === 'new-devices') this.goToLink('devices');
      if (this.state === 'new-device-summary') this.goToLink('devices/reports');

      if (this.state === 'byProducts' ||
        this.state === 'byCustomers' ||
        this.state === 'block-time-report' ||
        this.state === 'byTaxes' ||
        this.state === 'common-commissions' ||
        this.state === 'detailed-commissions' ||
        this.state === 'accounts-receivable' ||
        this.state === 'customer-transaction-history' ||
        this.state === 'payments-report' ||
        this.state === 'remote-access' ||
        this.state === 'software-summary' ||
        this.state === 'software-summary-device' ||
        this.state === 'hardware-summary' ||
        this.state === 'hardware-summary-device' ||
        this.state === 'device-ip-summary' ||
        this.state === 'device-ip-summary-device' ||
        this.state === 'report-device-summary' ||
        this.state === 'report-device-warranty' ||
        this.state === 'report-device-antivirus' ||
        this.state === 'network-ip-report' ||
        this.state === 'network-detail-report' ||
        this.state === 'network-adapter-report' ||
        this.state === 'report-device-deploymentwarranty' ||
        this.state === 'report-device-processorram' ||
        this.state === 'applicationbycompany-report' ||
        this.state === 'tech-sales' ||
        this.state === 'tech-ticket' ||
        this.state === 'tech-service' ||
        this.state === 'ticket-report' ||
        this.state === 'service-report' ||
        this.state === 'report-device-diskspace' ||
        this.state === 'income-accounts') this.goToLink('report/' + this.state);

      this.updatePage(this.state);
      this.leftPanelStateService.changeState(this.state);
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
      if (this.panelTickets) this.panelTickets.clearSelectedGlobalFilter();
    }
  }
  public getCurrentUserName() {
    let user = this.usersStateService.getCurrentUser();
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  getShortCompanyName() {
    if (!this.currentCompany) return '';
    return `${this.currentCompany.name[0].toUpperCase()}`
  }
  checkLogo() {
    if (this.currentUser && this.currentUser.avatar) return `/users/${this.currentUser.id}/image.jpg?t=${this.currentUser.avatar.updatedAt}`;
    return null;
  }
  public getAccessReports() {
    return this.getPermissions("VIEW_SALES_REPORT") ||
      this.getPermissions("VIEW_FINANCIAL_REPORT") ||
      this.getPermissions("VIEW_PERFORMANCE_REPORT") ||
      this.getPermissions("VIEW_TICKET_REPORT") ||
      this.getPermissions("VIEW_REMOTE_ACCESS_REPORT") ||
      this.getPermissions("VIEW_TAXES_REPORT") ||
      this.getPermissions("VIEW_DEVICES_REPORTS") ||
      this.getPermissions("VIEW_DEVICES_REPORTS")
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
}