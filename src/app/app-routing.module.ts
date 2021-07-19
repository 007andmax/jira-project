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
    path: '',

    component: HomeComponent,
  },
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
    path: 'company/:id/password-manager',
    component: CompanyPasswordManagerComponent,
    pathMatch: 'full'
  },
  {
    path: 'company/:id/user',
    component: CompanyUserComponent,
    pathMatch: 'full'
  },
  {
    path: 'company/:id/tickets',
    component: CompanyTicketsComponent,
    pathMatch: 'full'
  },
  {
    path: 'company/:id/dashboard',
    component: CompanyDashboardComponent,
    pathMatch: 'full'
  },
  {
    path: 'quotes',
    component: QuotesComponent,
    pathMatch: 'full'
  },
  {
    path: 'recurring-tickets',
    component: RecurringTicketsComponent,
    pathMatch: 'full'
  },
  {
    path: 'companies',
    component: CompaniesComponent,
  }, {
    path: 'users',
    component: UsersComponent,
    pathMatch: 'full'
  },
  {
    path: 'reports',
    component: ReportsComponent,
    pathMatch: 'full'
  },
  {
    path: 'report/:id',
    component: ItemReportComponent
  },
  {
    path: 'setting/myprofile',
    component: MyProfileComponent,
    pathMatch: 'full'
  },
  {
    path: 'setting/tags',
    component: ManageTagsComponent,
    pathMatch: 'full',

  },
  {
    path: 'setting/companyprofile',
    component: CompanyProfileComponent,
    pathMatch: 'full',
  },
  {
    path: 'setting/techUsers',
    component: TechUsersComponent,
    pathMatch: 'full',
  },
  {
    path: 'setting/emailSetting',
    component: EmailSettingComponent,
    pathMatch: 'full',
  },
  {
    path: 'setting/taxes',
    component: TaxesSettingsComponent,
    pathMatch: 'full',
  },
  {
    path: 'setting/glnumber',
    component: GlNumberSettingsComponent,
    pathMatch: 'full',
  },
  {
    path: 'setting/permission',
    component: PermissionManageComponent,
    pathMatch: 'full',
  },
  {
    path: 'setting/emailTemplete',
    component: EmailTempleteComponent,
    pathMatch: 'full',
  },
  {
    path: 'setting/integration',
    component: IntegrationsComponent,
    pathMatch: 'full',
  },
  {
    path: 'setting/invoiceTickets',
    component: InvoiceTicketsComponent,
    pathMatch: 'full',
  },
  {
    path: 'setting/commission',
    component: CommissionComponent,
    pathMatch: 'full',
  },
  {
    path: 'setting/subscription',
    component: SubscriptionComponent,
    pathMatch: 'full',
  },
  {
    path: 'inventory/products',
    component: InventoryComponent,
    pathMatch: 'full'
  },
  {
    path: 'documents/add',
    component: DocumentsAddComponent,
    pathMatch: 'full'
  },
  {
    path: 'documents/edit/:id',
    component: DocumentsEditComponent,
    pathMatch: 'full'
  },
  {
    path: 'documents/category/:id',
    component: DocumentsCategoryComponent,
    pathMatch: 'full'
  },
  {
    path: 'company/:id/documents',
    component: CompanyDocumentsComponent,
    pathMatch: 'full'
  },
  {
    path: 'documents/preview/:id',
    component: DocumentPreviewComponent,
    pathMatch: 'full'
  },
  {
    path: 'company/:id/products',
    component: CompanyProductsComponent,
    pathMatch: 'full'
  },

  {
    path: 'billable',
    component: BillableComponent,
  },
  {
    path: 'default-services',
    component: DefaultServicesComponent,
  },
  {
    path: 'invoices',
    component: InvoicesComponent,
  },
  {
    path: 'billable-tickets',
    component: BillableTicketsComponent,
  },
  {
    path: 'contracts',
    component: ContractsComponent,
  },
  {
    path: 'payments',
    component: PaymentsComponent,
  },
  {
    path: 'device/dashboard/:type/:id',
    component: DashboardComponent
  },
  {
    path: 'device/hardware/:type/:id',
    component: HardwareComponent
  },
  {
    path: 'device/software/:type/:id',
    component: SoftwareComponent
  },
  {
    path: 'device/service',
    component: ServicesComponent
  },
  {
    path: 'device/antivirus',
    component: AntivirusComponent
  },
  {
    path: 'device/terminal/:type/:id',
    component: TerminalComponent
  },
  {
    path: 'device/password',
    component: PasswordComponent
  },
  {
    path: 'device/window',
    component: WindowsComponent
  },
  {
    path: 'device/startup',
    component: StartupComponent
  },
  {
    path: 'device/file',
    component: FileComponent
  },
  {
    path: 'billing-dashboard',
    component: DashboardBillingComponent,
    canActivate: [PermissionDasnboardBillingService]

  },
  {
    path: 'company/:id/contracts',
    component: CompanyContractsComponent
  },
  {
    path: 'tickets-dashboard',
    component: TicketsDashboardComponent
  },
  {
    path: 'company/:id/network-scan',
    component: CompanyNetworkScanComponent
  },
  {
    path: 'company/:id/devices',
    component: CompanyDevicesComponent,

  },
  {
    path: 'quickSupport',
    component: SupportComponent,

  },
  {
    path: 'documents',
    component: DocumentsComponent,

  },
  {
    path: 'documents/templates',
    component: DocumentsTemplatesComponent,

  },

];

/**
 * Route for main module
 */
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
