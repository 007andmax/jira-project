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
    component: TicketsComponent,
    pathMatch: 'full'
  },

  {
    path: ':company/password-manager',
    loadChildren: './components/password-manager/password-manager.module#PasswordManagerModule'

  },
  {
    path: ':company/company/:id/password-manager',
    component: CompanyPasswordManagerComponent,
    pathMatch: 'full'
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
    loadChildren: './components/companies/companies.module#CompaniesModule'
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
  },
  {
    path: ':company/setting/emailSetting',
    component: EmailSettingComponent,
    pathMatch: 'full',
  },
  {
    path: ':company/setting/taxes',
    component: TaxesSettingsComponent,
    pathMatch: 'full',
  },
  {
    path: ':company/setting/glnumber',
    component: GlNumberSettingsComponent,
    pathMatch: 'full',
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
  },
  {
    path: ':company/setting/integration',
    component: IntegrationsComponent,
    pathMatch: 'full',
  },
  {
    path: ':company/setting/invoiceTickets',
    component: InvoiceTicketsComponent,
    pathMatch: 'full',
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
    pathMatch: 'full'
  },
  {
    path: ':company/documents/preview/:id',
    component: DocumentPreviewComponent,
    pathMatch: 'full'
  },
  {
    path: ':company/company/:id/products',
    component: CompanyProductsComponent,
    pathMatch: 'full'
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
    component: CompanyContractsComponent
  },
  {
    path: ':company/tickets-dashboard',
    component: TicketsDashboardComponent
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
