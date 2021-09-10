import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AppComponent } from './app.component';
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
import { InvoiceTicketsComponent } from './components/setting/invoice-tickets/invoice-tickets.component';
import { CommissionComponent } from './components/setting/commission/commission.component';
import { SubscriptionComponent } from './components/setting/subscription/subscription.component';
import { CompanyPasswordManagerComponent } from './components/company-password-manager/company-password-manager.component';
import { CompanyUserComponent } from './components/company-user/company-user.component';
import { RecurringTicketsComponent } from './components/tickets/recurring-tickets/recurring-tickets.component';
import { GlNumberSettingsComponent } from './components/setting/gl-number/gl-number.component';
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
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [

  {
    path: ':company/tickets',
    loadChildren: './components/tickets/tickets/tickets.module#TicketsModule'

  },

  {
    path: ':company/password-manager',
    loadChildren: './components/password-manager/password-manager.module#PasswordManagerModule'

  },
  {
    path: ':company/company/:id/password-manager',
    loadChildren: './components/company-password-manager/company-password-manager.module#CompanyPasswordManagerModule'

  },
  {
    path: ':company/company/:id/user',
    loadChildren: './components/company-user/company-user.module#CompanyUserModule'

  },
  {
    path: ':company/company/:id/tickets',
    loadChildren: './components/company-tickets/company-tickets.module#CompanyTicketsModule'

  },
  {
    path: ':company/company/:id/dashboard',
    loadChildren: './components/company-dashboard/company-dashboard.module#CompanyDashboardModule'
  },
  {
    path: ':company/quotes',
    loadChildren: './components/billing/quotes/quotes.module#QuotesModule'

  },
  {
    path: ':company/recurring-tickets',
    loadChildren: './components/tickets/recurring-tickets/recurring-tickets.module#RecurringTicketsModule'
  },
  {
    path: ':company/companies',
    loadChildren: './components/companies/companies.module#CompaniesModule'
  }, {
    path: ':company/users',
    loadChildren: './components/users/users.module#UsersModule'
  },
  {
    path: ':company/reports',
    loadChildren: './components/reports/reports.module#ReportsModule'
  },
  {
    path: ':company/report/:id',
    loadChildren: './components/reports/item-report/item-report.module#ItemReportModule'
  },
  {
    path: ':company/setting/myprofile',
    component: MyProfileComponent,
    pathMatch: 'full'
  },
  {
    path: ':company/setting/tags',
    loadChildren: './components/setting/manage-tags/manage-tags.module#ManageTagsModule'


  },
  {
    path: ':company/setting/companyprofile',
    loadChildren: './components/setting/company-profile/company-profile.module#CompanyProfileModule'

  },
  {
    path: ':company/setting/techUsers',
    component: TechUsersComponent,
    pathMatch: 'full',
  },
  {
    path: ':company/setting/emailSetting',
    loadChildren: './components/setting/email-setting/email-setting.module#EmailSettingModule'

  },
  {
    path: ':company/setting/taxes',
    component: TaxesSettingsComponent,
    pathMatch: 'full',
  },
  {
    path: ':company/setting/glnumber',
    loadChildren: './components/setting/gl-number/gl-number-settings.module#GlNumberSettingsModule'

  },
  {
    path: ':company/setting/permission',
    component: PermissionManageComponent,
    pathMatch: 'full',
  },
  {
    path: ':company/setting/emailTemplete',
    loadChildren: './components/setting/email-templete/email-templete.module#EmailTempleteModule'

  },
  {
    path: ':company/setting/integration',
    loadChildren: './components/setting/integrations/integrations.module#IntegrationsModule'

  },
  {
    path: ':company/setting/invoiceTickets',
    loadChildren: './components/setting/invoice-tickets/invoice-tickets.module#InvoiceTicketsModule'

  },
  {
    path: ':company/setting/commission',
    loadChildren: './components/setting/commission/commission.module#CommissionModule'
  },
  {
    path: ':company/setting/subscription',
    component: SubscriptionComponent,
    pathMatch: 'full',
  },
  {
    path: ':company/inventory/products',
    loadChildren: './components/inventory/inventory.module#InventoryModule'

  },
  {
    path: ':company/documents/add',
    loadChildren: './components/documents/documents-add/documents-add.module#DocumentsAddModule'
  },
  {
    path: ':company/documents/edit/:id',
    loadChildren: './components/documents/documents-edit/documents-edit.module#DocumentsEditModule'

  },
  {
    path: ':company/documents/category/:id',
    loadChildren: './components/documents/documents-category/documents-category.module#DocumentsCategoryModule'

  },
  {
    path: ':company/company/:id/documents',
    loadChildren: './components/companies/company-documents/company-documents.module#CompanyDocumentsModule'

  },
  {
    path: ':company/documents/preview/:id',
    loadChildren: './components/documents/document-preview/document-preview.module#DocumentPreviewModule'

  },
  {
    path: ':company/company/:id/products',
    loadChildren: './components/companies/company-products/company-products.module#CompanyProductsModule'
  },

  {
    path: ':company/billable',
    loadChildren: './components/billing/billable/billable.module#BillableModule'

  },
  {
    path: ':company/default-services',
    loadChildren: './components/billing/default-services/default-services.module#DefaultServicesModule'
  },
  {
    path: ':company/invoices',
    loadChildren: './components/billing/invoices/invoices.module#InvoicesModule'

  },
  {
    path: ':company/billable-tickets',
    loadChildren: './components/billing/billable/billable-tickets/billable-tickets.module#BillableTicketsModule'

  },
  {
    path: ':company/contracts',
    loadChildren: './components/billing/contracts/contracts.module#ContractsModule'

  },
  {
    path: ':company/payments',
    loadChildren: './components/billing/payments/payments.module#PaymentsModule'

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
    loadChildren: './components/billing/dashboard-billing/dashboard-billing.module#DashboardBillingModule',
    canActivate: [PermissionDasnboardBillingService]

  },
  {
    path: ':company/company/:id/contracts',
    loadChildren: './components/companies/company-contracts/company-contracts.module#CompanyContractsModule'

  },
  {
    path: ':company/tickets-dashboard',
    loadChildren: './components/tickets/tickets-dashboard/tickets-dashboard.module#TicketsDashboardModule'

  },
  {
    path: ':company/company/:id/network-scan',
    loadChildren: './components/company-network-scan/company-network-scan.module#CompanyNetworkScanModule'

  },
  {
    path: ':company/company/:id/devices',
    loadChildren: './components/company-devices/company-devices.module#CompanyDevicesModule'

  },
  {
    path: ':company/quickSupport',
    loadChildren: './components/support/support.module#SupportModule'


  },
  {
    path: ':company/documents/templates',
    loadChildren: './components/documents/documents-templates/documents-templates.module#DocumentsTemplatesModule'

  },
  {
    path: ':company/documents',
    loadChildren: './components/documents/documents.module#DocumentsModule'

  },


];

/**
 * Route for main module
 */
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
