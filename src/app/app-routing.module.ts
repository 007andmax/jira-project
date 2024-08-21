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
    loadChildren: './components/tickets/tickets/tickets.module#TicketsModule',
    canActivate: [PermissionTicketsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/ticket/:id',
    loadChildren: './components/tickets/tickets/ticket-detail/ticket-detail.module#TicketDetailModule',
    canActivate: [PermissionTicketsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/support-page',
    loadChildren: './components/super-admin/support-page/support-page.module#SupportPageModule',
    canActivate: [PermissionSuperAdminService]
  },
  {
    path: ':domain/tech-companies',
    loadChildren: './components/super-admin/super-admin-companies/super-admin-companies.module#SuperAdminCompaniesModule',
    canActivate: [PermissionSuperAdminService]
  },
  {
    path: ':domain/knowledge-base',
    loadChildren: './components/super-admin/super-admin-knowledge-base/super-admin-knowledge-base.module#SuperAdminKnowledgeBaseModule',
    canActivate: [PermissionSuperAdminService]
  },
  {
    path: ':domain/password-manager',
    loadChildren: './components/password-manager/password-manager.module#PasswordManagerModule',
    canActivate: [PermissionPasswordManagerService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/company/:id/password-manager',
    loadChildren: './components/company-password-manager/company-password-manager.module#CompanyPasswordManagerModule',
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/company/:id/user',
    loadChildren: './components/company-user/company-user.module#CompanyUserModule',
    canActivate: [PermissionCompanyService, PermissionUsersService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/company/:id/tickets',
    loadChildren: './components/company-tickets/company-tickets.module#CompanyTicketsModule',
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/company/:id/dashboard',
    loadChildren: './components/company-dashboard/company-dashboard.module#CompanyDashboardModule',
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/quotes',
    loadChildren: './components/billing/quotes/quotes.module#QuotesModule',
    canActivate: [PermissionQuotesService, PermissionNoSuperAdminService]


  },
  {
    path: ':domain/recurring-tickets',
    loadChildren: './components/tickets/recurring-tickets/recurring-tickets.module#RecurringTicketsModule',
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/companies',
    loadChildren: './components/companies/companies.module#CompaniesModule',
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]

  }, {
    path: ':domain/users',
    loadChildren: './components/users/users.module#UsersModule',
    canActivate: [PermissionUsersService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/reports',
    loadChildren: './components/reports/reports.module#ReportsModule',
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/report/:id',
    loadChildren: './components/reports/item-report/item-report.module#ItemReportModule',
    canActivate: [PermissionReportsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/setting/myprofile',
    loadChildren: './components/setting/my-profile/my-profile.module#MyProfileModule',
    canActivate: [PermissionMyProfileService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/tags',
    loadChildren: './components/setting/manage-tags/manage-tags.module#ManageTagsModule',
    canActivate: [PermissionManageTagsService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/customer-portal',
    loadChildren: './components/setting/customer-permissions/customer-permissions.module#CustomerPermissionsModule',
    canActivate: [PermissionCustomerPermissionsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/setting/products-settings',
    loadChildren: './components/setting/products-settings/products-settings.module#ProductsSettingsModule',
    canActivate: [PermissionProductsSettingsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/setting/companyprofile',
    loadChildren: './components/setting/company-profile/company-profile.module#CompanyProfileModule',
    canActivate: [PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/techUsers',
    loadChildren: './components/setting/tech-users-settings/tech-users-settings.module#TechUsersSettingsModule',
    canActivate: [PermissionsTechUsersService, PermissionNoSuperAdminService]


  },
  {
    path: ':domain/setting/emailSetting',
    loadChildren: './components/setting/email-setting/email-setting.module#EmailSettingModule',
    canActivate: [PermissionEmailSettingService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/ticket-settings',
    loadChildren: './components/setting/ticket-settings-page/ticket-settings-page.module#TicketSettingsPageModule',
    canActivate: [PermissionTicketSettingsService, PermissionNoSuperAdminService]

  },
  /* {
     path: ':domain/setting/permission',
     loadChildren: './components/setting/permission-manage/permission-manage.module#PermissionManageModule',
     canActivate: [PermissionNoSuperAdminService]
   },*/
  {
    path: ':domain/setting/emailTemplate',
    loadChildren: './components/setting/email-template/email-template.module#EmailTemplateModule',
    canActivate: [PermissionEmailTemplateService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/setting/marketing-email',
    loadChildren: './components/setting/marketing-email/marketing-email.module#MarketingEmailModule',
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/finance',
    loadChildren: './components/setting/accounting/accounting-settings.module#AccoutingSettingsModule',
    canActivate: [PermissionAccountingSettingsService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/crm-settings',
    loadChildren: './components/setting/crm-settings/crm-settings.module#CrmSettingsModule',
    canActivate: [PermissionCrmSettingsService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/setting/commission',
    loadChildren: './components/setting/commission/commission.module#CommissionModule',
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/setting/deviceSetting',
    loadChildren: './components/setting/device-setting/device-setting.module#DeviceSettingModule',
    // canActivate: [PermissionNoSuperAdminService]
  },
  {
    path: ':domain/inventory/products',
    loadChildren: './components/inventory/inventory.module#InventoryModule',
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/documents/add',
    loadChildren: './components/documents/documents-add/documents-add.module#DocumentsAddModule',
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/documents/edit/:id',
    loadChildren: './components/documents/documents-edit/documents-edit.module#DocumentsEditModule',
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/documents/category/:id',
    loadChildren: './components/documents/documents-category/documents-category.module#DocumentsCategoryModule',
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/company/:id/documents',
    loadChildren: './components/companies/company-documents/company-documents.module#CompanyDocumentsModule',
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]


  },
  {
    path: ':domain/documents/preview/:id',
    loadChildren: './components/documents/document-preview/document-preview.module#DocumentPreviewModule',
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/company/:id/products',
    loadChildren: './components/companies/company-products/company-products.module#CompanyProductsModule',
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/billable',
    loadChildren: './components/billing/billable/billable.module#BillableModule',
    canActivate: [PermissionBillableService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/non-contract-services',
    loadChildren: './components/billing/non-contract-services/non-contract-services.module#NonContractServicesModule',
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/invoices',
    loadChildren: './components/billing/invoices/invoices.module#InvoicesModule',
    canActivate: [PermissionInvoicesService, PermissionNoSuperAdminService]


  },
  {
    path: ':domain/billable-tickets',
    loadChildren: './components/billing/billable/billable-tickets/billable-tickets.module#BillableTicketsModule',
    canActivate: [PermissionBillableService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/contracts',
    loadChildren: './components/billing/contracts/contracts.module#ContractsModule',
    canActivate: [PermissionContractsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/payments',
    loadChildren: './components/billing/payments/payments.module#PaymentsModule',
    canActivate: [PermissionNoSuperAdminService, PermissionPaymentsService]


  },
  {
    path: ':domain/device',
    loadChildren: './components/device/device-root.module#DeviceModule',
    canActivate: [PermissionTechUserService, TestPermissionService]
  },
  {
    path: ':company/device-old',
    loadChildren: './components/device-old/device-old.module#DevicesOldModule',
    canActivate: [PermissionTechUserService]
  },
  {
    path: ':domain/billing-dashboard',
    loadChildren: './components/billing/dashboard-billing/dashboard-billing.module#DashboardBillingModule',
    canActivate: [PermissionDasnboardBillingService]

  },
  {
    path: ':domain/company/:id/contracts',
    loadChildren: './components/companies/company-contracts/company-contracts.module#CompanyContractsModule',
    canActivate: [PermissionContractsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/tickets-dashboard',
    loadChildren: './components/tickets/tickets-dashboard/tickets-dashboard.module#TicketsDashboardModule',
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
    loadChildren: './components/company-network-scan/company-network-scan.module#CompanyNetworkScanModule',
    canActivate: [PermissionCompanyService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/company/:id/devices',
    loadChildren: './components/company-devices/company-devices.module#CompanyDevicesModule',
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
    loadChildren: './components/support/support.module#SupportModule',
    canActivate: [PermissionSupportService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/documents/templates',
    loadChildren: './components/documents/documents-templates/documents-templates.module#DocumentsTemplatesModule',
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]

  },
  {
    path: ':domain/documents',
    loadChildren: './components/documents/documents.module#DocumentsModule',
    canActivate: [PermissionTechUserService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/marketing',
    loadChildren: './components/marketing/marketing.module#MarketingModule',
    canActivate: [PermissionUsersService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/help-center',
    loadChildren: './components/super-admin-public/super-admin-public.module#SupperAdminPublicModule',
  },
  {
    path: ':domain/help-center/:id',
    loadChildren: './components/super-admin-public/super-admin-public-category/super-admin-public-category.module#SuperAdminPublicCategoryModule',
  },
  {
    path: ':domain/devices/reports',
    loadChildren: './components/devices/devices-report/devices-report.module#DevicesReportModule',
    //canActivate: [PermissionNoSuperAdminService]
    canActivate: [PermissionTechUserService, TestPermissionService]
  },
  {
    path: ':domain/default',
    loadChildren: './components/customer-portal/customer-portal-default/customer-portal-default.module#CustomerPortalDefaultModule',
    canActivate: [PermissionClientUserService]
  },
  {
    path: ':domain/contract-statistics',
    loadChildren: './components/billing/contracts-statistics/contracts-statistics.module#ContractsStatisticsModule',
    canActivate: [PermissionContractsService, PermissionNoSuperAdminService]
  },
  {
    path: ':domain/file-manager',
    loadChildren: './components/file-manager/file-manager.module#FileManagementModule',
    canActivate: [PermissionSupportService, PermissionNoSuperAdminService, TestPermissionService]
  },
  {
    path: ':domain/file-manager/all-customer',
    loadChildren: './components/file-manager/file-manager-all-customer/file-manager-all-customer.module#FileManagementAllCustomerModule',
    canActivate: [PermissionSupportService, PermissionNoSuperAdminService, TestPermissionService]
  },
  {
    path: ':domain/file-manager/all-customer/:id',
    loadChildren: './components/file-manager/file-manager-all-customer-company/file-manager-all-customer-company.module#FileManagementAllCustomerCompanyModule',
    canActivate: [PermissionSupportService, PermissionNoSuperAdminService, TestPermissionService]
  },
  {
    path: ':domain/file-manager/category/:id',
    loadChildren: './components/file-manager/file-manager-category/file-manager-category.module#FileManagementCategoryModule',
    canActivate: [PermissionSupportService, PermissionNoSuperAdminService, TestPermissionService]

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
