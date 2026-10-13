import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionDasnboardBillingService } from './services/dashboard-billing/permission-dasnboard-billing.service';
import { PermissionManageTagsService } from './components/setting/manage-tags/permission-manage-tags.service';
import { PermissionTicketSettingsService } from './components/setting/ticket-settings-page/permission-ticket-settings.service';
import { PermissionProductsSettingsService } from './components/setting/products-settings/permission-products-settings.service';
import { PermissionCrmSettingsService } from './components/setting/crm-settings/permission-crm-settings.service';
import { PermissionsTechUsersService } from './components/setting/tech-users-settings/permissions-tech-users.service';
import { PermissionEmailSettingService } from './components/setting/email-setting/permission-email-setting.service';
import { PermissionEmailTemplateService } from './components/setting/email-template/permission-email-template.service';
import { PermissionAccountingSettingsService } from './components/setting/accounting/permission-accounting-settings.service';
import { PermissionContractsService } from './components/billing/contracts/permission-contracts.service';
import { PermissionCompanyService } from './components/companies/permission-company.service';
import { PermissionInvoicesService } from './components/billing/invoices/permission-invoices.service';
import { PermissionBillableService } from './components/billing/billable/permission-billable.service';
import { PermissionUsersService } from './components/users/permission-users.service';
import { PermissionPasswordManagerService } from './components/password-manager/permission-password-manager.service';
import { PermissionSupportService } from './components/support/permission-support.service';
import { PermissionReportsService } from './components/reports/permission-reports.service';
import { PermissionTechUserService } from './services/users/permission-tech-user.service';
import { TestPermissionService } from './services/test-permission/test-permission.service';
import { PermissionCustomerPermissionsService } from './components/setting/customer-permissions/permission-customer-permissions.service';
import { PermissionPaymentsService } from './components/billing/payments/permission-payments.service';
import { PermissionQuotesService } from './components/billing/quotes/permission-quotes.service';
import { PermissionTicketsService } from './components/tickets/tickets/permission-tickets.service';
import { PermissionSuperAdminService } from './services/users/permission-super-admin.service';
import { PermissionCompanyDevicesService } from './components/company-devices/permission-company-devices.service';
import { PermissionNoSuperAdminService } from './services/users/permission-no-super-admin.service';
import { PermissionClientUserService } from './services/users/permission-client-user.service';
import { PermissionMyProfileService } from './components/setting/my-profile/permission-my-profile.service';
import { PermissionIntegrationsService } from './components/integrations/integrations.service';
import { InvoicesComponent } from './components/billing/invoices/invoices.component';
import { PermissionTicketPreviewReportService } from './components/billing/ticket-preview-report/permission-ticket-preview-report.service';

const routes: Routes = [

  {
    path: ':domain/tickets',
    loadComponent: () => import('./components/tickets/tickets/tickets.component').then(m => m.TicketsComponent),
    canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/ticket/:id',
    loadComponent: () => import('./components/tickets/tickets/ticket-detail/ticket-detail.component').then(m => m.TicketDetailComponent),
    canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/support-page',
    loadComponent: () => import('./components/super-admin/support-page/support-page.component').then(m => m.SupportPageComponent),
    canActivate: [PermissionSuperAdminService]
  },
  {
    path: ':domain/tech-companies',
    loadComponent: () => import('./components/super-admin/super-admin-companies/super-admin-companies.component').then(m => m.SuperAdminCompaniesComponent),
    canActivate: [PermissionSuperAdminService]
  },
  {
    path: ':domain/knowledge-base',
    loadComponent: () => import('./components/super-admin/super-admin-knowledge-base/super-admin-knowledge-base.component').then(m => m.SuperAdminKnowledgeBaseComponent),
    canActivate: [PermissionSuperAdminService]
  },
  {
    path: ':domain/password-manager',
    loadComponent: () => import('./components/password-manager/password-manager.component').then(m => m.PasswordManagerComponent),
    canActivate: [PermissionPasswordManagerService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/company/:id/password-manager',
    loadComponent: () => import('./components/company-password-manager/company-password-manager.component').then(m => m.CompanyPasswordManagerComponent),
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/company/:id/user',
    loadComponent: () => import('./components/company-user/company-user.component').then(m => m.CompanyUserComponent),
    canActivate: [PermissionCompanyService, PermissionUsersService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/company/:id/user/:iduser',
    loadComponent: () => import('./components/companies/companies-users-details/companies-users-details.component').then(m => m.CompaniesUsersDetailsComponent),
    canActivate: [PermissionCompanyService, PermissionUsersService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/company/:id/tickets',
    loadComponent: () => import('./components/company-tickets/company-tickets.component').then(m => m.CompanyTicketsComponent),
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/company/:id/dashboard',
    loadComponent: () => import('./components/company-dashboard/company-dashboard.component').then(m => m.CompanyDashboardComponent),
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/quotes',
    loadComponent: () => import('./components/billing/quotes/quotes.component').then(m => m.QuotesComponent),
    canActivate: [PermissionQuotesService, PermissionNoSuperAdminService]


  },
  {
    path: ':domain/recurring-tickets',
    loadComponent: () => import('./components/tickets/recurring-tickets/recurring-tickets.component').then(m => m.RecurringTicketsComponent),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/companies',
    loadComponent: () => import('./components/companies/companies.component').then(m => m.CompaniesComponent),
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]

  }, {
    path: ':domain/users',
    loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent),
    canActivate: [PermissionUsersService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/users/:id',
    loadComponent: () => import('./components/users-details/users-details.component').then(m => m.UsersDetailsComponent),
    canActivate: [PermissionUsersService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/reports',
    loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/report/:id',
    loadComponent: () => import('./components/reports/item-report/item-report.component').then(m => m.ItemReportComponent),
    canActivate: [PermissionReportsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/setting/myprofile',
    loadComponent: () => import('./components/setting/my-profile/my-profile.component').then(m => m.MyProfileComponent),
    canActivate: [PermissionMyProfileService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/tags',
    loadComponent: () => import('./components/setting/manage-tags/manage-tags.component').then(m => m.ManageTagsComponent),
    canActivate: [PermissionManageTagsService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/customer-portal',
    loadComponent: () => import('./components/setting/customer-permissions/customer-permissions.component').then(m => m.CustomerPermissionsComponent),
    canActivate: [PermissionCustomerPermissionsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/setting/products-settings',
    loadComponent: () => import('./components/setting/products-settings/products-settings.component').then(m => m.ProductsSettingsComponent),
    canActivate: [PermissionProductsSettingsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/setting/companyprofile',
    loadComponent: () => import('./components/setting/company-profile/company-profile.component').then(m => m.CompanyProfileComponent),
    canActivate: [PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/techUsers',
    loadComponent: () => import('./components/setting/tech-users-settings/tech-users-settings.component').then(m => m.TechUsersSettingsComponent),
    canActivate: [PermissionsTechUsersService, PermissionNoSuperAdminService]


  },
  {
    path: ':domain/setting/emailSetting',
    loadComponent: () => import('./components/setting/email-setting/email-setting.component').then(m => m.EmailSettingComponent),
    canActivate: [PermissionEmailSettingService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/ticket-settings',
    loadComponent: () => import('./components/setting/ticket-settings-page/ticket-settings-page.component').then(m => m.TicketSettingsPageComponent),
    canActivate: [PermissionTicketSettingsService, PermissionNoSuperAdminService]

  },
  /* {
     path: ':domain/setting/permission',
     loadComponent: './components/setting/permission-manage/permission-manage.module#PermissionManageModule',
     canActivate: [PermissionNoSuperAdminService]
   },*/
  {
    path: ':domain/setting/emailTemplate',
    loadComponent: () => import('./components/setting/email-template/email-template.component').then(m => m.EmailTempleteComponent),
    canActivate: [PermissionEmailTemplateService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/setting/marketing-email',
    loadComponent: () => import('./components/setting/marketing-email/marketing-email.component').then(m => m.MarketingEmailComponent),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/finance',
    loadComponent: () => import('./components/setting/accounting/accounting-settings.component').then(m => m.AccountingSettingsComponent),
    canActivate: [PermissionAccountingSettingsService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/crm-settings',
    loadComponent: () => import('./components/setting/crm-settings/crm-settings.component').then(m => m.CrmSettingsComponent),
    canActivate: [PermissionCrmSettingsService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/commission',
    loadComponent: () => import('./components/setting/commission/commission.component').then(m => m.CommissionComponent),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/setting/deviceSetting',
    loadComponent: () => import('./components/setting/device-setting/device-setting.component').then(m => m.DeviceSettingComponent),
    // canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/inventory/products',
    loadComponent: () => import('./components/inventory/inventory.component').then(m => m.InventoryComponent),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/documents/add',
    loadComponent: () => import('./components/documents/documents-add/documents-add.component').then(m => m.DocumentsAddComponent),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/documents/edit/:id',
    loadComponent: () => import('./components/documents/documents-edit/documents-edit.component').then(m => m.DocumentsEditComponent),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/documents/category/:id',
    loadComponent: () => import('./components/documents/documents-category/documents-category.component').then(m => m.DocumentsCategoryComponent),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/company/:id/documents',
    loadComponent: () => import('./components/companies/company-documents/company-documents.component').then(m => m.CompanyDocumentsComponent),
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/company/:id/file-manager',
    loadComponent: () => import('./components/companies/company-file-manager/company-file-manager.component').then(m => m.CompanyFileManagerComponent),
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/company/:id/file-manager/category/:categoryId',
    loadComponent: () => import('./components/companies/company-file-manager/company-file-manager-category/company-file-manager-category.component').then(m => m.CompanyFileManagerCategoryComponent),
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/documents/preview/:id',
    loadComponent: () => import('./components/documents/document-preview/document-preview.component').then(m => m.DocumentPreviewComponent),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/company/:id/products',
    loadComponent: () => import('./components/companies/company-products/company-products.component').then(m => m.CompanyProductsComponent),
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/billable',
    loadComponent: () => import('./components/billing/billable/billable.component').then(m => m.BillableComponent),
    canActivate: [PermissionBillableService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/non-contract-services',
    loadComponent: () => import('./components/billing/non-contract-services/non-contract-services.component').then(m => m.NonContractServicesComponent),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/invoices',
    component: InvoicesComponent,
    canActivate: [PermissionInvoicesService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/billable-tickets',
    loadComponent: () => import('./components/billing/billable/billable-tickets/billable-tickets.component').then(m => m.BillableTicketsComponent),
    canActivate: [PermissionBillableService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/contracts',
    loadComponent: () => import('./components/billing/contracts/contracts.component').then(m => m.ContractsComponent),
    canActivate: [PermissionContractsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/payments',
    loadComponent: () => import('./components/billing/payments/payments.component').then(m => m.PaymentsComponent),
    canActivate: [PermissionNoSuperAdminService, PermissionPaymentsService]


  },
  {
    path: ':domain/device',
    loadComponent: () => import('./components/device/device.component').then(m => m.DeviceComponent),
    children: [
      {
        path: 'dashboard/:type/:id',
        loadComponent: () => import('./components/device/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [PermissionNoSuperAdminService]
      },
      {
        path: 'hardware/:type/:id',
        loadComponent: () => import('./components/device/hardware/hardware.component').then(m => m.HardwareComponent),
        canActivate: [PermissionNoSuperAdminService]
      },
      {
        path: 'software/:type/:id',
        loadComponent: () => import('./components/device/software/software.component').then(m => m.SoftwareComponent),
        canActivate: [PermissionNoSuperAdminService]
      },
      {
        path: 'service/:type/:id',
        loadComponent: () => import('./components/device/services/services.component').then(m => m.ServicesComponent),
        canActivate: [PermissionNoSuperAdminService]
      },
      {
        path: 'terminal/:type/:id',
        loadComponent: () => import('./components/device/terminal/terminal.component').then(m => m.TerminalComponent),
        canActivate: [PermissionNoSuperAdminService]
      },
      {
        path: 'startup/:type/:id',
        loadComponent: () => import('./components/device/startup-programes/startup-programes.component').then(m => m.StartupComponent),
        canActivate: [PermissionNoSuperAdminService]
      },
      {
        path: 'windows/:type/:id',
        loadComponent: () => import('./components/device/window-updates/window-updates.component').then(m => m.WindowUpdatesComponent),
        canActivate: [PermissionNoSuperAdminService]
      },
      {
        path: 'processes/:type/:id',
        loadComponent: () => import('./components/device/processes/processes.component').then(m => m.ProcessesComponent),
        canActivate: [PermissionNoSuperAdminService]

      },
    ],
    canActivate: [PermissionTechUserService, TestPermissionService]
  },
  {
    path: ':company/device-old',
    loadComponent: () => import('./components/device-old/device-old.component').then(m => m.DeviceOldComponent),
    children: [
      {
        path: 'dashboard/:type/:id',
        loadComponent: () => import('./components/device-old/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [PermissionNoSuperAdminService]
      },
      {
        path: 'hardware/:type/:id',
        loadComponent: () => import('./components/device-old/hardware/hardware.component').then(m => m.HardwareComponent),
        canActivate: [PermissionNoSuperAdminService]
      },
      {
        path: 'software/:type/:id',
        loadComponent: () => import('./components/device-old/software/software.component').then(m => m.SoftwareComponent),
        canActivate: [PermissionNoSuperAdminService]
      },
      {
        path: 'terminal/:type/:id',
        loadComponent: () => import('./components/device-old/terminal/terminal.component').then(m => m.TerminalComponent),
        canActivate: [PermissionNoSuperAdminService]
      },
    ],
    canActivate: [PermissionTechUserService]
  },
  {
    path: ':domain/billing-dashboard',
    loadComponent: () => import('./components/billing/dashboard-billing/dashboard-billing.component').then(m => m.DashboardBillingComponent),
    canActivate: [PermissionDasnboardBillingService]

  },
  {
    path: ':domain/company/:id/contracts',
    loadComponent: () => import('./components/companies/company-contracts/company-contracts.component').then(m => m.CompanyContractsComponent),
    canActivate: [PermissionContractsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/tickets-dashboard',
    loadComponent: () => import('./components/tickets/tickets-dashboard/tickets-dashboard.component').then(m => m.TicketsDashboardComponent),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]
  },
  /* {
     path: ':domain/company/:id/network-scan-beta',
     loadComponent: './components/company-network-scan-beta/company-network-scan-beta.module#CompanyNetworkScanBetaModule',
     // canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]
     canActivate: [TestPermissionService]
   },*/
  {
    path: ':domain/company/:id/network-scan',
    loadComponent: () => import('./components/company-network-scan/company-network-scan.component').then(m => m.CompanyNetworkScanComponent),
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/company/:id/devices',
    loadComponent: () => import('./components/company-devices/company-devices.component').then(m => m.CompanyDevicesComponent),
    canActivate: [PermissionNoSuperAdminService, PermissionCompanyDevicesService]
  },
  /* {
     path: ':domain/company/:id/devices-beta',
     loadComponent: './components/company-device-beta/company-device-beta.module#CompanyDeviceBetaModule',
     //canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]
     canActivate: [TestPermissionService]
   },*/
  /* {
     path: ':domain/devices',
     loadComponent: './components/devices/devices.module#DevicesModule',
     // canActivate: [PermissionNoSuperAdminService],
     canActivate: [TestPermissionService]
   },*/
  {
    path: ':domain/quickSupport',
    loadComponent: () => import('./components/support/support.component').then(m => m.SupportComponent),
    canActivate: [PermissionSupportService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/documents/templates',
    loadComponent: () => import('./components/documents/documents-templates/documents-templates.component').then(m => m.DocumentsTemplatesComponent),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/documents',
    loadComponent: () => import('./components/documents/documents.component').then(m => m.DocumentsComponent),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/marketing',
    loadComponent: () => import('./components/marketing/marketing.component').then(m => m.MarketingComponent),
    canActivate: [PermissionUsersService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/help-center',
    loadComponent: () => import('./components/super-admin-public/super-admin-public.component').then(m => m.SuperAdminPublicComponent),
  },
  {
    path: ':domain/help-center/:id',
    loadComponent: () => import('./components/super-admin-public/super-admin-public-category/super-admin-public-category.component').then(m => m.SuperAdminPublicCategoryComponent),
  },
  {
    path: ':domain/devices/reports',
    loadComponent: () => import('./components/devices/devices-report/devices-report.component').then(m => m.DevicesReportComponent),
    //canActivate: [PermissionNoSuperAdminService]
    canActivate: [PermissionTechUserService, TestPermissionService]
  },
  {
    path: ':domain/contract-statistics',
    loadComponent: () => import('./components/billing/contracts-statistics/contracts-statistics.component').then(m => m.ContractsStatisticsComponent),
    canActivate: [PermissionContractsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/file-manager',
    loadComponent: () => import('./components/file-manager/file-manager.component').then(m => m.FileManagerComponent),
    canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/file-manager/all-customer',
    loadComponent: () => import('./components/file-manager/file-manager-all-customer/file-manager-all-customer.component').then(m => m.FileManagerAllCustomerComponent),
    canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/file-manager/all-customer/:id',
    loadComponent: () => import('./components/file-manager/file-manager-all-customer-company/file-manager-all-customer-company.component').then(m => m.FileManagerAllCustomerCompanyComponent),
    canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/file-manager/category/:id',
    loadComponent: () => import('./components/file-manager/file-manager-category/file-manager-category.component').then(m => m.FileManagerCategoryComponent),
    canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/subscription-services',
    loadComponent: () => import('./components/billing/subscription-services/subscription-services.component').then(m => m.SubscriptionServicesComponent),
    canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/tasks',
    loadComponent: () => import('./components/tasks/tasks.component').then(m => m.TasksComponent),
    canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/tasks-dashboard',
    loadComponent: () => import('./components/tasks-dashboard/tasks-dashboard.component').then(m => m.TasksDashboardComponent),
    canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/integrations',
    loadComponent: () => import('./components/integrations/integrations.component').then(m => m.IntegrationsComponent),
    children: [
      {
        path: 'all-integrations',
        loadComponent: () => import('./components/integrations/all-integrations/all-integrations.component').then(m => m.AllIntegrationsComponent),

      }
    ],
    canActivate: [PermissionNoSuperAdminService, PermissionIntegrationsService]
  },
  {
    path: ':domain/manage-cards',
    loadComponent: () => import('./components/billing/manage-cards/manage-cards.component').then(m => m.ManageCardsComponent),
    canActivate: [PermissionBillableService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/ticket-preview-report',
    loadComponent: () => import('./components/billing/ticket-preview-report/ticket-preview-report.component').then(m => m.TicketPreviewReportComponent),
    canActivate: [PermissionBillableService, PermissionNoSuperAdminService, PermissionTicketPreviewReportService]
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
