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

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/ng2/tickets',
  },

  {
    path: 'ng2/password-manager',
    component: PasswordManagerComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/company/password-manager',
    component: CompanyPasswordManagerComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/company/user',
    component: CompanyUserComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/company/tickets',
    component: CompanyTicketsComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/company/dashboard/:companyId',
    component: CompanyDashboardComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/quotes',
    component: QuotesComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/recurring-tickets',
    component: RecurringTicketsComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/companies',
    component: CompaniesComponent,
  }, {
    path: 'ng2/users',
    component: UsersComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/reports',
    component: ReportsComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/report/:id',
    component: ItemReportComponent
  },
  {
    path: 'ng2/setting/myprofile',
    component: MyProfileComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/setting/tags',
    component: ManageTagsComponent,
    pathMatch: 'full',

  },
  {
    path: 'ng2/setting/companyprofile',
    component: CompanyProfileComponent,
    pathMatch: 'full',
  },
  {
    path: 'ng2/setting/techUsers',
    component: TechUsersComponent,
    pathMatch: 'full',
  },
  {
    path: 'ng2/setting/emailSetting',
    component: EmailSettingComponent,
    pathMatch: 'full',
  },
  {
    path: 'ng2/setting/taxes',
    component: TaxesSettingsComponent,
    pathMatch: 'full',
  },
  {
    path: 'ng2/setting/glnumber',
    component: GlNumberSettingsComponent,
    pathMatch: 'full',
  },
  {
    path: 'ng2/setting/permission',
    component: PermissionManageComponent,
    pathMatch: 'full',
  },
  {
    path: 'ng2/setting/emailTemplete',
    component: EmailTempleteComponent,
    pathMatch: 'full',
  },
  {
    path: 'ng2/setting/integration',
    component: IntegrationsComponent,
    pathMatch: 'full',
  },
  {
    path: 'ng2/setting/invoiceTickets',
    component: InvoiceTicketsComponent,
    pathMatch: 'full',
  },
  {
    path: 'ng2/setting/commission',
    component: CommissionComponent,
    pathMatch: 'full',
  },
  {
    path: 'ng2/setting/subscription',
    component: SubscriptionComponent,
    pathMatch: 'full',
  },
  {
    path: 'ng2/inventory/products',
    component: InventoryComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/documents/add',
    component: DocumentsAddComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/company/products',
    component: CompanyProductsComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/tickets',
    component: TicketsComponent,
  },
  {
    path: 'ng2/billable',
    component: BillableComponent,
  },
  {
    path: 'ng2/default-services',
    component: DefaultServicesComponent,
  },
  {
    path: 'ng2/invoices',
    component: InvoicesComponent,
  },
  {
    path: 'ng2/billable-tickets',
    component: BillableTicketsComponent,
  },
  {
    path: 'ng2/contracts',
    component: ContractsComponent,
  },
  {
    path: 'ng2/payments',
    component: PaymentsComponent,
  },
  {
    path: 'ng2/device/dashboard/:type/:id',
    component: DashboardComponent
  },
  {
    path: 'ng2/device/hardware/:type/:id',
    component: HardwareComponent
  },
  {
    path: 'ng2/device/software/:type/:id',
    component: SoftwareComponent
  },
  {
    path: 'ng2/device/service',
    component: ServicesComponent
  },
  {
    path: 'ng2/device/antivirus',
    component: AntivirusComponent
  },
  {
    path: 'ng2/device/terminal/:type/:id',
    component: TerminalComponent
  },
  {
    path: 'ng2/device/password',
    component: PasswordComponent
  },
  {
    path: 'ng2/device/window',
    component: WindowsComponent
  },
  {
    path: 'ng2/device/startup',
    component: StartupComponent
  },
  {
    path: 'ng2/device/file',
    component: FileComponent
  },
  {
    path: 'ng2/billing-dashboard',
    component: DashboardBillingComponent,
    canActivate: [PermissionDasnboardBillingService]

  },
  {
    path: 'ng2/company/contracts',
    component: CompanyContractsComponent
  },
  {
    path: 'ng2/tickets-dashboard',
    component: TicketsDashboardComponent
  },
  {
    path: 'ng2/company/network-scan',
    component: CompanyNetworkScanComponent
  },
  {
    path: 'ng2/company/devices',
    component: CompanyDevicesComponent,

  },
  {
    path: 'ng2/quickSupport',
    component: SupportComponent,

  },
  {
    path: 'ng2/documents',
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
      enableTracing: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
