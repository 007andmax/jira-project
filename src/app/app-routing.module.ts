import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { PasswordManagerComponent } from './components/password-manager/password-manager.component';
import { QuotesComponent } from './components/billing/quotes/quotes.component';
import { MyProfileComponent } from './components/setting/my-profile/my-profile.component';
import { ManageTagsComponent } from './components/setting/manage-tags/manage-tags.component';
import { CompanyProfileComponent } from './components/setting/company-profile/company-profile.component';
import { TechUsersComponent } from './components/setting/tech-users/tech-users.component';
import { EmailSettingComponent } from './components/setting/email-setting/email-setting.component';
import { TaxesSettingsComponent } from './components/setting/taxes/taxes.component';
import { PermissionManageComponent } from './components/setting/permission-manage/permission-manage.component';
import { EmailTempleteComponent } from './components/setting/email-templete/email-templete.component';
import { IntegrationsComponent } from './components/setting/integrations/integrations.component';
import { CommissionComponent } from './components/setting/commission/commission.component';
import { SubscriptionComponent } from './components/setting/subscription/subscription.component';
import { CompanyPasswordManagerComponent } from './components/company-password-manager/company-password-manager.component';
import { CompanyUserComponent } from './components/company-user/company-user.component';
import { RecurringTicketsComponent } from './components/tickets/recurring-tickets/recurring-tickets.component';
import { GlNumberSettingsComponent } from './components/setting/accounting/gl-number/gl-number.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { UsersComponent } from './components/users/users.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ItemReportComponent } from './components/reports/item-report/item-report.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { CompanyProductsComponent } from './components/companies/company-products/company-products.component';
import { TicketsComponent } from './components/tickets/tickets/tickets.component';
import { CompanyTicketsComponent } from './components/company-tickets/company-tickets.component';
import { CompanyDashboardComponent } from './components/company-dashboard/company-dashboard.component';
import { BillableComponent } from './components/billing/billable/billable.component';
import { BillableTicketsComponent } from './components/billing/billable/billable-tickets/billable-tickets.component';
import { ContractsComponent } from './components/billing/contracts/contracts.component';
import { InvoicesComponent } from './components/billing/invoices/invoices.component';
import { DefaultServicesComponent } from './components/billing/default-services/default-services.component';
import { PaymentsComponent } from './components/billing/payments/payments.component';
import { DashboardComponent } from './components/device/dashboard/dashboard.component';
import { HardwareComponent } from './components/device/hardware/hardware.component';
import { SoftwareComponent } from './components/device/software/software.component';
import { ServicesComponent } from './components/device/services/services.component';
import { AntivirusComponent } from './components/device/antivirus/antivirus.component';
import { TerminalComponent } from './components/device/terminal/terminal.component';
import { PasswordComponent } from './components/device/password/password.component';
import { WindowsComponent } from './components/device/windows-update/windows-update.component';
import { StartupComponent } from './components/device/startup-programes/startup-programes.component';
import { FileComponent } from './components/device/file-explorer/file-explorer.component';
import { DashboardBillingComponent } from './components/billing/dashboard-billing/dashboard-billing.component';
import { CompanyContractsComponent } from './components/companies/company-contracts/company-contracts.component';
import { PermissionDasnboardBillingService } from './services/dashboard-billing/permission-dasnboard-billing.service';
import { TicketsDashboardComponent } from './components/tickets/tickets-dashboard/tickets-dashboard.component';
import { CompanyNetworkScanComponent } from './components/company-network-scan/company-network-scan.component';
import { CompanyDevicesComponent } from './components/company-devices/company-devices.component';
import { SupportComponent } from './components/support/support.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { DocumentsAddComponent } from './components/documents/documents-add/documents-add.component';
import { DocumentsCategoryComponent } from './components/documents/documents-category/documents-category.component';
import { DocumentsTemplatesComponent } from './components/documents/documents-templates/documents-templates.component';
import { DocumentsEditComponent } from './components/documents/documents-edit/documents-edit.component';
import { DocumentPreviewComponent } from './components/documents/document-preview/document-preview.component';
import { CompanyDocumentsComponent } from './components/companies/company-documents/company-documents.component';
import { TicketSettingsPageComponent } from './components/setting/ticket-settings-page/ticket-settings-page.component';
import { ProductsSettingsComponent } from './components/setting/products-settings/products-settings.component';
import { AccountingSettingsComponent } from './components/setting/accounting/accounting-settings.component';
import { CrmSettingsComponent } from './components/setting/crm-settings/crm-settings.component';
import { PermissionManageTagsService } from './components/setting/manage-tags/permission-manage-tags.service';
import { PermissionTicketSettingsService } from './components/setting/ticket-settings-page/permission-ticket-settings.service';
import { PermissionProductsSettingsService } from './components/setting/products-settings/permission-products-settings.service';
import { PermissionCrmSettingsService } from './components/setting/crm-settings/permission-crm-settings.service';
import { PermissionsTechUsersService } from './components/setting/tech-users/permissions-tech-users.service';
import { PermissionEmailSettingService } from './components/setting/email-setting/permission-email-setting.service';
import { PermissionTaxesSettingsService } from './components/setting/taxes/permission-taxes-settings.service';
import { PermissionEmailTempleteService } from './components/setting/email-templete/permission-email-templete.service';
import { PermissionAccountingSettingsService } from './components/setting/accounting/permission-accounting-settings.service';
import { MarketingEmailComponent } from './components/setting/marketing-email/marketing-email.component';
import { MarketingComponent } from './components/marketing/marketing.component';
import { PermissionContractsService } from './components/billing/contracts/permission-contracts.service';
import { PermissionCompanyService } from './components/companies/permission-company.service';

const routes: Routes = [

  {
    path: ':company/tickets',
    component: TicketsComponent,
    pathMatch: 'full'
  },

  {
    path: ':company/password-manager',
    component: PasswordManagerComponent,

  },
  {
    path: ':company/company/:id/password-manager',
    component: CompanyPasswordManagerComponent,
    pathMatch: 'full',
    canActivate: [PermissionCompanyService]
  },
  {
    path: ':company/company/:id/user',
    component: CompanyUserComponent,
    pathMatch: 'full',
    canActivate: [PermissionCompanyService]
  },
  {
    path: ':company/company/:id/tickets',
    component: CompanyTicketsComponent,
    pathMatch: 'full',
    canActivate: [PermissionCompanyService]
  },
  {
    path: ':company/company/:id/dashboard',
    component: CompanyDashboardComponent,
    pathMatch: 'full',
    canActivate: [PermissionCompanyService]
  },
  {
    path: ':company/quotes',
    component: QuotesComponent,
    pathMatch: 'full'
  },
  {
    path: ':company/recurring-tickets',
    component: RecurringTicketsComponent,
    pathMatch: 'full'
  },
  {
    path: ':company/companies',
    component: CompaniesComponent,
    canActivate: [PermissionCompanyService]
  }, {
    path: ':company/users',
    component: UsersComponent,
    pathMatch: 'full'
  },
  {
    path: ':company/reports',
    component: ReportsComponent,
    pathMatch: 'full'
  },
  {
    path: ':company/report/:id',
    component: ItemReportComponent
  },
  {
    path: ':company/setting/myprofile',
    component: MyProfileComponent,
    pathMatch: 'full'
  },
  {
    path: ':company/setting/tags',
    component: ManageTagsComponent,
    pathMatch: 'full',
    canActivate: [PermissionManageTagsService]

  },
  {
    path: ':company/setting/products-settings',
    component: ProductsSettingsComponent,
    pathMatch: 'full',
    canActivate: [PermissionProductsSettingsService]
  },
  {
    path: ':company/setting/companyprofile',
    component: CompanyProfileComponent,
    pathMatch: 'full',
  },
  {
    path: ':company/setting/techUsers',
    component: TechUsersComponent,
    pathMatch: 'full',
    canActivate: [PermissionsTechUsersService]
  },
  {
    path: ':company/setting/emailSetting',
    component: EmailSettingComponent,
    pathMatch: 'full',
    canActivate: [PermissionEmailSettingService]
  },
  {
    path: ':company/setting/taxes',
    component: TaxesSettingsComponent,
    pathMatch: 'full',
    canActivate: [PermissionTaxesSettingsService]
  },
  {
    path: ':company/setting/ticket-settings',
    component: TicketSettingsPageComponent,
    pathMatch: 'full',
    canActivate: [PermissionTicketSettingsService]
  },
  {
    path: ':company/setting/permission',
    component: PermissionManageComponent,
    pathMatch: 'full',
  },
  {
    path: ':company/setting/emailTemplete',
    component: EmailTempleteComponent,
    pathMatch: 'full',
    canActivate: [PermissionEmailTempleteService]
  },
  {
    path: ':company/setting/integration',
    component: IntegrationsComponent,
    pathMatch: 'full',
  },
  {
    path: ':company/setting/marketing-email',
    component: MarketingEmailComponent,
    pathMatch: 'full',
  },
  {
    path: ':company/setting/accounting',
    component: AccountingSettingsComponent,
    pathMatch: 'full',
    canActivate: [PermissionAccountingSettingsService]
  },
  {
    path: ':company/setting/crm-settings',
    component: CrmSettingsComponent,
    pathMatch: 'full',
    canActivate: [PermissionCrmSettingsService]
  },
  {
    path: ':company/setting/commission',
    component: CommissionComponent,
    pathMatch: 'full',
  },
  {
    path: ':company/setting/subscription',
    component: SubscriptionComponent,
    pathMatch: 'full',
  },
  {
    path: ':company/inventory/products',
    component: InventoryComponent,
    pathMatch: 'full'
  },
  {
    path: ':company/documents/add',
    component: DocumentsAddComponent,
    pathMatch: 'full'
  },
  {
    path: ':company/documents/edit/:id',
    component: DocumentsEditComponent,
    pathMatch: 'full'
  },
  {
    path: ':company/documents/category/:id',
    component: DocumentsCategoryComponent,
    pathMatch: 'full'
  },
  {
    path: ':company/company/:id/documents',
    component: CompanyDocumentsComponent,
    pathMatch: 'full',
    canActivate: [PermissionCompanyService]
  },
  {
    path: ':company/documents/preview/:id',
    component: DocumentPreviewComponent,
    pathMatch: 'full'
  },
  {
    path: ':company/company/:id/products',
    component: CompanyProductsComponent,
    pathMatch: 'full',
    canActivate: [PermissionCompanyService]
  },

  {
    path: ':company/billable',
    component: BillableComponent,
  },
  {
    path: ':company/default-services',
    component: DefaultServicesComponent,
  },
  {
    path: ':company/invoices',
    component: InvoicesComponent,
  },
  {
    path: ':company/billable-tickets',
    component: BillableTicketsComponent,
  },
  {
    path: ':company/contracts',
    component: ContractsComponent,
    canActivate: [PermissionContractsService]
  },
  {
    path: ':company/payments',
    component: PaymentsComponent,
  },
  {
    path: ':company/device/dashboard/:type/:id',
    component: DashboardComponent
  },
  {
    path: ':company/device/hardware/:type/:id',
    component: HardwareComponent
  },
  {
    path: ':company/device/software/:type/:id',
    component: SoftwareComponent
  },
  {
    path: ':company/device/service',
    component: ServicesComponent
  },
  {
    path: ':company/device/antivirus',
    component: AntivirusComponent
  },
  {
    path: ':company/device/terminal/:type/:id',
    component: TerminalComponent
  },
  {
    path: ':company/device/password',
    component: PasswordComponent
  },
  {
    path: ':company/device/window',
    component: WindowsComponent
  },
  {
    path: ':company/device/startup',
    component: StartupComponent
  },
  {
    path: ':company/device/file',
    component: FileComponent
  },
  {
    path: ':company/billing-dashboard',
    component: DashboardBillingComponent,
    canActivate: [PermissionDasnboardBillingService]

  },
  {
    path: ':company/company/:id/contracts',
    component: CompanyContractsComponent,
    canActivate: [PermissionContractsService]

  },
  {
    path: ':company/tickets-dashboard',
    component: TicketsDashboardComponent
  },
  {
    path: ':company/company/:id/network-scan',
    component: CompanyNetworkScanComponent,
    canActivate: [PermissionCompanyService]
  },
  {
    path: ':company/company/:id/devices',
    component: CompanyDevicesComponent,
    canActivate: [PermissionCompanyService]

  },
  {
    path: ':company/quickSupport',
    component: SupportComponent,

  },
  {
    path: ':company/documents/templates',
    component: DocumentsTemplatesComponent,

  },
  {
    path: ':company/documents',
    component: DocumentsComponent,

  },
  {
    path: ':company/marketing',
    component: MarketingComponent,
    pathMatch: 'full'
  },

];

/**
 * Route for main module
 */
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
