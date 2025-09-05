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

const routes: Routes = [

  {
    path: ':domain/tickets',
    loadChildren: () => import('./components/tickets/tickets/tickets.module').then(m => m.TicketsModule),
    canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/ticket/:id',
    loadChildren: () => import('./components/tickets/tickets/ticket-detail/ticket-detail.module').then(m => m.TicketDetailModule),
    canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/support-page',
    loadChildren: () => import('./components/super-admin/support-page/support-page.module').then(m => m.SupportPageModule),
    canActivate: [PermissionSuperAdminService]
  },
  {
    path: ':domain/tech-companies',
    loadChildren: () => import('./components/super-admin/super-admin-companies/super-admin-companies.module').then(m => m.SuperAdminCompaniesModule),
    canActivate: [PermissionSuperAdminService]
  },
  {
    path: ':domain/knowledge-base',
    loadChildren: () => import('./components/super-admin/super-admin-knowledge-base/super-admin-knowledge-base.module').then(m => m.SuperAdminKnowledgeBaseModule),
    canActivate: [PermissionSuperAdminService]
  },
  {
    path: ':domain/password-manager',
    loadChildren: () => import('./components/password-manager/password-manager.module').then(m => m.PasswordManagerModule),
    canActivate: [PermissionPasswordManagerService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/company/:id/password-manager',
    loadChildren: () => import('./components/company-password-manager/company-password-manager.module').then(m => m.CompanyPasswordManagerModule),
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/company/:id/user',
    loadChildren: () => import('./components/company-user/company-user.module').then(m => m.CompanyUserModule),
    canActivate: [PermissionCompanyService, PermissionUsersService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/company/:id/user/:iduser',
    loadChildren: () => import('./components/companies/companies-users-details/companies-users-details.module').then(m => m.CompaniesUsersDetailsModule),
    canActivate: [PermissionCompanyService, PermissionUsersService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/company/:id/tickets',
    loadChildren: () => import('./components/company-tickets/company-tickets.module').then(m => m.CompanyTicketsModule),
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/company/:id/dashboard',
    loadChildren: () => import('./components/company-dashboard/company-dashboard.module').then(m => m.CompanyDashboardModule),
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/quotes',
    loadChildren: () => import('./components/billing/quotes/quotes.module').then(m => m.QuotesModule),
    canActivate: [PermissionQuotesService, PermissionNoSuperAdminService]


  },
  {
    path: ':domain/recurring-tickets',
    loadChildren: () => import('./components/tickets/recurring-tickets/recurring-tickets.module').then(m => m.RecurringTicketsModule),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/companies',
    loadChildren: () => import('./components/companies/companies.module').then(m => m.CompaniesModule),
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]

  }, {
    path: ':domain/users',
    loadChildren: () => import('./components/users/users.module').then(m => m.UsersModule),
    canActivate: [PermissionUsersService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/users/:id',
    loadChildren: () => import('./components/users-details/users-details.module').then(m => m.UsersDetailsModule),
    canActivate: [PermissionUsersService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/reports',
    loadChildren: () => import('./components/reports/reports.module').then(m => m.ReportsModule),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/report/:id',
    loadChildren: () => import('./components/reports/item-report/item-report.module').then(m => m.ItemReportModule),
    canActivate: [PermissionReportsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/setting/myprofile',
    loadChildren: () => import('./components/setting/my-profile/my-profile.module').then(m => m.MyProfileModule),
    canActivate: [PermissionMyProfileService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/tags',
    loadChildren: () => import('./components/setting/manage-tags/manage-tags.module').then(m => m.ManageTagsModule),
    canActivate: [PermissionManageTagsService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/customer-portal',
    loadChildren: () => import('./components/setting/customer-permissions/customer-permissions.module').then(m => m.CustomerPermissionsModule),
    canActivate: [PermissionCustomerPermissionsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/setting/products-settings',
    loadChildren: () => import('./components/setting/products-settings/products-settings.module').then(m => m.ProductsSettingsModule),
    canActivate: [PermissionProductsSettingsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/setting/companyprofile',
    loadChildren: () => import('./components/setting/company-profile/company-profile.module').then(m => m.CompanyProfileModule),
    canActivate: [PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/techUsers',
    loadChildren: () => import('./components/setting/tech-users-settings/tech-users-settings.module').then(m => m.TechUsersSettingsModule),
    canActivate: [PermissionsTechUsersService, PermissionNoSuperAdminService]


  },
  {
    path: ':domain/setting/emailSetting',
    loadChildren: () => import('./components/setting/email-setting/email-setting.module').then(m => m.EmailSettingModule),
    canActivate: [PermissionEmailSettingService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/ticket-settings',
    loadChildren: () => import('./components/setting/ticket-settings-page/ticket-settings-page.module').then(m => m.TicketSettingsPageModule),
    canActivate: [PermissionTicketSettingsService, PermissionNoSuperAdminService]

  },
  /* {
     path: ':domain/setting/permission',
     loadChildren: './components/setting/permission-manage/permission-manage.module#PermissionManageModule',
     canActivate: [PermissionNoSuperAdminService]
   },*/
  {
    path: ':domain/setting/emailTemplate',
    loadChildren: () => import('./components/setting/email-template/email-template.module').then(m => m.EmailTemplateModule),
    canActivate: [PermissionEmailTemplateService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/setting/marketing-email',
    loadChildren: () => import('./components/setting/marketing-email/marketing-email.module').then(m => m.MarketingEmailModule),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/finance',
    loadChildren: () => import('./components/setting/accounting/accounting-settings.module').then(m => m.AccoutingSettingsModule),
    canActivate: [PermissionAccountingSettingsService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/crm-settings',
    loadChildren: () => import('./components/setting/crm-settings/crm-settings.module').then(m => m.CrmSettingsModule),
    canActivate: [PermissionCrmSettingsService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/commission',
    loadChildren: () => import('./components/setting/commission/commission.module').then(m => m.CommissionModule),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/setting/deviceSetting',
    loadChildren: () => import('./components/setting/device-setting/device-setting.module').then(m => m.DeviceSettingModule),
    // canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/inventory/products',
    loadChildren: () => import('./components/inventory/inventory.module').then(m => m.InventoryModule),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/documents/add',
    loadChildren: () => import('./components/documents/documents-add/documents-add.module').then(m => m.DocumentsAddModule),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/documents/edit/:id',
    loadChildren: () => import('./components/documents/documents-edit/documents-edit.module').then(m => m.DocumentsEditModule),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/documents/category/:id',
    loadChildren: () => import('./components/documents/documents-category/documents-category.module').then(m => m.DocumentsCategoryModule),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/company/:id/documents',
    loadChildren: () => import('./components/companies/company-documents/company-documents.module').then(m => m.CompanyDocumentsModule),
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/company/:id/file-manager',
    loadChildren: () => import('./components/companies/company-file-manager/company-file-manager.module').then(m => m.CompanyFileManagerModule),
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/company/:id/file-manager/category/:categoryId',
    loadChildren: () => import('./components/companies/company-file-manager/company-file-manager-category/company-file-manager-category.module').then(m => m.CompanyFileManagerCategoryModule),
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/documents/preview/:id',
    loadChildren: () => import('./components/documents/document-preview/document-preview.module').then(m => m.DocumentPreviewModule),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/company/:id/products',
    loadChildren: () => import('./components/companies/company-products/company-products.module').then(m => m.CompanyProductsModule),
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/billable',
    loadChildren: () => import('./components/billing/billable/billable.module').then(m => m.BillableModule),
    canActivate: [PermissionBillableService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/non-contract-services',
    loadChildren: () => import('./components/billing/non-contract-services/non-contract-services.module').then(m => m.NonContractServicesModule),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/invoices',
    loadChildren: () => import('./components/billing/invoices/invoices.module').then(m => m.InvoicesModule),
    canActivate: [PermissionInvoicesService, PermissionNoSuperAdminService]


  },
  {
    path: ':domain/billable-tickets',
    loadChildren: () => import('./components/billing/billable/billable-tickets/billable-tickets.module').then(m => m.BillableTicketsModule),
    canActivate: [PermissionBillableService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/contracts',
    loadChildren: () => import('./components/billing/contracts/contracts.module').then(m => m.ContractsModule),
    canActivate: [PermissionContractsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/payments',
    loadChildren: () => import('./components/billing/payments/payments.module').then(m => m.PaymentsModule),
    canActivate: [PermissionNoSuperAdminService, PermissionPaymentsService]


  },
  {
    path: ':domain/device',
    loadChildren: () => import('./components/device/device-root.module').then(m => m.DeviceModule),
    canActivate: [PermissionTechUserService, TestPermissionService]
  },
  {
    path: ':company/device-old',
    loadChildren: () => import('./components/device-old/device-old.module').then(m => m.DevicesOldModule),
    canActivate: [PermissionTechUserService]
  },
  {
    path: ':domain/billing-dashboard',
    loadChildren: () => import('./components/billing/dashboard-billing/dashboard-billing.module').then(m => m.DashboardBillingModule),
    canActivate: [PermissionDasnboardBillingService]

  },
  {
    path: ':domain/company/:id/contracts',
    loadChildren: () => import('./components/companies/company-contracts/company-contracts.module').then(m => m.CompanyContractsModule),
    canActivate: [PermissionContractsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/tickets-dashboard',
    loadChildren: () => import('./components/tickets/tickets-dashboard/tickets-dashboard.module').then(m => m.TicketsDashboardModule),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]
  },
  /* {
     path: ':domain/company/:id/network-scan-beta',
     loadChildren: './components/company-network-scan-beta/company-network-scan-beta.module#CompanyNetworkScanBetaModule',
     // canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]
     canActivate: [TestPermissionService]
   },*/
  {
    path: ':domain/company/:id/network-scan',
    loadChildren: () => import('./components/company-network-scan/company-network-scan.module').then(m => m.CompanyNetworkScanModule),
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/company/:id/devices',
    loadChildren: () => import('./components/company-devices/company-devices.module').then(m => m.CompanyDevicesModule),
    canActivate: [PermissionNoSuperAdminService, PermissionCompanyDevicesService]
  },
  /* {
     path: ':domain/company/:id/devices-beta',
     loadChildren: './components/company-device-beta/company-device-beta.module#CompanyDeviceBetaModule',
     //canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]
     canActivate: [TestPermissionService]
   },*/
  /* {
     path: ':domain/devices',
     loadChildren: './components/devices/devices.module#DevicesModule',
     // canActivate: [PermissionNoSuperAdminService],
     canActivate: [TestPermissionService]
   },*/
  {
    path: ':domain/quickSupport',
    loadChildren: () => import('./components/support/support.module').then(m => m.SupportModule),
    canActivate: [PermissionSupportService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/documents/templates',
    loadChildren: () => import('./components/documents/documents-templates/documents-templates.module').then(m => m.DocumentsTemplatesModule),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/documents',
    loadChildren: () => import('./components/documents/documents.module').then(m => m.DocumentsModule),
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/marketing',
    loadChildren: () => import('./components/marketing/marketing.module').then(m => m.MarketingModule),
    canActivate: [PermissionUsersService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/help-center',
    loadChildren: () => import('./components/super-admin-public/super-admin-public.module').then(m => m.SupperAdminPublicModule),
  },
  {
    path: ':domain/help-center/:id',
    loadChildren: () => import('./components/super-admin-public/super-admin-public-category/super-admin-public-category.module').then(m => m.SuperAdminPublicCategoryModule),
  },
  {
    path: ':domain/devices/reports',
    loadChildren: () => import('./components/devices/devices-report/devices-report.module').then(m => m.DevicesReportModule),
    //canActivate: [PermissionNoSuperAdminService]
    canActivate: [PermissionTechUserService, TestPermissionService]
  },
  {
    path: ':domain/contract-statistics',
    loadChildren: () => import('./components/billing/contracts-statistics/contracts-statistics.module').then(m => m.ContractsStatisticsModule),
    canActivate: [PermissionContractsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/file-manager',
    loadChildren: () => import('./components/file-manager/file-manager.module').then(m => m.FileManagementModule),
    canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/file-manager/all-customer',
    loadChildren: () => import('./components/file-manager/file-manager-all-customer/file-manager-all-customer.module').then(m => m.FileManagementAllCustomerModule),
    canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/file-manager/all-customer/:id',
    loadChildren: () => import('./components/file-manager/file-manager-all-customer-company/file-manager-all-customer-company.module').then(m => m.FileManagementAllCustomerCompanyModule),
    canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/file-manager/category/:id',
    loadChildren: () => import('./components/file-manager/file-manager-category/file-manager-category.module').then(m => m.FileManagementCategoryModule),
    canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/subscription-services',
    loadChildren: () => import('./components/billing/subscription-services/subscription-services.module').then(m => m.SubscriptionServicesModule),
    canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/tasks',
    loadChildren: () => import('./components/tasks/tasks.module').then(m => m.TasksModule),
    canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/tasks-dashboard',
    loadChildren: () => import('./components/tasks-dashboard/tasks-dashboard.module').then(m => m.TasksDashboardModule),
    canActivate: [PermissionNoSuperAdminService]
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
