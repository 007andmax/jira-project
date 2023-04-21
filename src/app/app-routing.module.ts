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

const routes: Routes = [

  {
    path: ':company/tickets',
    loadChildren: './components/tickets/tickets/tickets.module#TicketsModule',
    canActivate: [PermissionTechUserService]
  },
  {
    path: ':company/ticket/:id',
    loadChildren: './components/tickets/tickets/ticket-detail/ticket-detail.module#TicketDetailModule',
    canActivate: [PermissionTechUserService]
  },
  {
    path: ':company/support-page',
    loadChildren: './components/super-admin/support-page/support-page.module#SupportPageModule'
  },
  {
    path: ':company/password-manager',
    loadChildren: './components/password-manager/password-manager.module#PasswordManagerModule',
    canActivate: [PermissionPasswordManagerService, PermissionTechUserService]
  },
  {
    path: ':company/company/:id/password-manager',
    loadChildren: './components/company-password-manager/company-password-manager.module#CompanyPasswordManagerModule',
    canActivate: [PermissionCompanyService, PermissionTechUserService]

  },
  {
    path: ':company/company/:id/user',
    loadChildren: './components/company-user/company-user.module#CompanyUserModule',
    canActivate: [PermissionCompanyService, PermissionUsersService, PermissionTechUserService]

  },
  {
    path: ':company/company/:id/tickets',
    loadChildren: './components/company-tickets/company-tickets.module#CompanyTicketsModule',
    canActivate: [PermissionCompanyService, PermissionTechUserService]

  },
  {
    path: ':company/company/:id/dashboard',
    loadChildren: './components/company-dashboard/company-dashboard.module#CompanyDashboardModule',
    canActivate: [PermissionCompanyService, PermissionTechUserService]
  },
  {
    path: ':company/quotes',
    loadChildren: './components/billing/quotes/quotes.module#QuotesModule',
    canActivate: [PermissionTechUserService]


  },
  {
    path: ':company/recurring-tickets',
    loadChildren: './components/tickets/recurring-tickets/recurring-tickets.module#RecurringTicketsModule',
    canActivate: [PermissionTechUserService]

  },
  {
    path: ':company/companies',
    loadChildren: './components/companies/companies.module#CompaniesModule',
    canActivate: [PermissionCompanyService, PermissionTechUserService]

  }, {
    path: ':company/users',
    loadChildren: './components/users/users.module#UsersModule',
    canActivate: [PermissionUsersService, PermissionTechUserService]

  },
  {
    path: ':company/reports',
    loadChildren: './components/reports/reports.module#ReportsModule',
    canActivate: [PermissionTechUserService]

  },
  {
    path: ':company/report/:id',
    loadChildren: './components/reports/item-report/item-report.module#ItemReportModule',
    canActivate: [PermissionReportsService, PermissionTechUserService]
  },
  {
    path: ':company/setting/myprofile',
    loadChildren: './components/setting/my-profile/my-profile.module#MyProfileModule',
    canActivate: [PermissionTechUserService]

  },
  {
    path: ':company/setting/tags',
    loadChildren: './components/setting/manage-tags/manage-tags.module#ManageTagsModule',
    canActivate: [PermissionManageTagsService, PermissionTechUserService]

  },
  {
    path: ':company/setting/customer-permissions',
    loadChildren: './components/setting/customer-permissions/customer-permissions.module#CustomerPermissionsModule',
    canActivate: [PermissionCustomerPermissionsService, PermissionTechUserService]
  },
  {
    path: ':company/setting/products-settings',
    loadChildren: './components/setting/products-settings/products-settings.module#ProductsSettingsModule',
    canActivate: [PermissionProductsSettingsService, PermissionTechUserService]
  },
  {
    path: ':company/setting/companyprofile',
    loadChildren: './components/setting/company-profile/company-profile.module#CompanyProfileModule',
    canActivate: [PermissionTechUserService]

  },
  {
    path: ':company/setting/techUsers',
    loadChildren: './components/setting/tech-users-settings/tech-users-settings.module#TechUsersSettingsModule',
    canActivate: [PermissionsTechUsersService, PermissionTechUserService]


  },
  {
    path: ':company/setting/emailSetting',
    loadChildren: './components/setting/email-setting/email-setting.module#EmailSettingModule',
    canActivate: [PermissionEmailSettingService, PermissionTechUserService]

  },
  {
    path: ':company/setting/ticket-settings',
    loadChildren: './components/setting/ticket-settings-page/ticket-settings-page.module#TicketSettingsPageModule',
    canActivate: [PermissionTicketSettingsService, PermissionTechUserService]

  },
  /* {
     path: ':company/setting/permission',
     loadChildren: './components/setting/permission-manage/permission-manage.module#PermissionManageModule',
     canActivate: [PermissionTechUserService]
   },*/
  {
    path: ':company/setting/emailTemplate',
    loadChildren: './components/setting/email-template/email-template.module#EmailTemplateModule',
    canActivate: [PermissionEmailTemplateService, PermissionTechUserService]
  },
  {
    path: ':company/setting/marketing-email',
    loadChildren: './components/setting/marketing-email/marketing-email.module#MarketingEmailModule',
    canActivate: [PermissionTechUserService]

  },
  {
    path: ':company/setting/finance',
    loadChildren: './components/setting/accounting/accounting-settings.module#AccoutingSettingsModule',
    canActivate: [PermissionAccountingSettingsService, PermissionTechUserService]

  },
  {
    path: ':company/setting/crm-settings',
    loadChildren: './components/setting/crm-settings/crm-settings.module#CrmSettingsModule',
    canActivate: [PermissionCrmSettingsService, PermissionTechUserService]

  },
  {
    path: ':company/setting/commission',
    loadChildren: './components/setting/commission/commission.module#CommissionModule',
    canActivate: [PermissionTechUserService]
  },
  /* {
     path: ':company/setting/deviceSetting',
     loadChildren: './components/setting/device-setting/device-setting.module#DeviceSettingModule',
     // canActivate: [PermissionTechUserService]
     canActivate: [TestPermissionService]
   },*/
  {
    path: ':company/inventory/products',
    loadChildren: './components/inventory/inventory.module#InventoryModule',
    canActivate: [PermissionTechUserService]

  },
  {
    path: ':company/documents/add',
    loadChildren: './components/documents/documents-add/documents-add.module#DocumentsAddModule',
    canActivate: [PermissionTechUserService]
  },
  {
    path: ':company/documents/edit/:id',
    loadChildren: './components/documents/documents-edit/documents-edit.module#DocumentsEditModule',
    canActivate: [PermissionTechUserService]

  },
  {
    path: ':company/documents/category/:id',
    loadChildren: './components/documents/documents-category/documents-category.module#DocumentsCategoryModule',
    canActivate: [PermissionTechUserService]

  },
  {
    path: ':company/company/:id/documents',
    loadChildren: './components/companies/company-documents/company-documents.module#CompanyDocumentsModule',
    canActivate: [PermissionCompanyService, PermissionTechUserService]


  },
  {
    path: ':company/documents/preview/:id',
    loadChildren: './components/documents/document-preview/document-preview.module#DocumentPreviewModule',
    canActivate: [PermissionTechUserService]

  },
  {
    path: ':company/company/:id/products',
    loadChildren: './components/companies/company-products/company-products.module#CompanyProductsModule',
    canActivate: [PermissionCompanyService, PermissionTechUserService]

  },
  {
    path: ':company/billable',
    loadChildren: './components/billing/billable/billable.module#BillableModule',
    canActivate: [PermissionBillableService, PermissionTechUserService]

  },
  {
    path: ':company/default-services',
    loadChildren: './components/billing/default-services/default-services.module#DefaultServicesModule',
    canActivate: [PermissionTechUserService]

  },
  {
    path: ':company/invoices',
    loadChildren: './components/billing/invoices/invoices.module#InvoicesModule',
    canActivate: [PermissionInvoicesService, PermissionTechUserService]


  },
  {
    path: ':company/billable-tickets',
    loadChildren: './components/billing/billable/billable-tickets/billable-tickets.module#BillableTicketsModule',
    canActivate: [PermissionBillableService, PermissionTechUserService]
  },
  {
    path: ':company/contracts',
    loadChildren: './components/billing/contracts/contracts.module#ContractsModule',
    canActivate: [PermissionContractsService, PermissionTechUserService]
  },
  {
    path: ':company/payments',
    loadChildren: './components/billing/payments/payments.module#PaymentsModule',
    canActivate: [PermissionTechUserService]


  },
  {
    path: ':company/device',
    loadChildren: './components/device/device-root.module#DeviceModule',
    canActivate: [TestPermissionService]

  },
  {
    path: ':company/billing-dashboard',
    loadChildren: './components/billing/dashboard-billing/dashboard-billing.module#DashboardBillingModule',
    canActivate: [PermissionDasnboardBillingService]

  },
  {
    path: ':company/company/:id/contracts',
    loadChildren: './components/companies/company-contracts/company-contracts.module#CompanyContractsModule',
    canActivate: [PermissionContractsService, PermissionTechUserService]
  },
  {
    path: ':company/tickets-dashboard',
    loadChildren: './components/tickets/tickets-dashboard/tickets-dashboard.module#TicketsDashboardModule',
    canActivate: [PermissionTechUserService]
  },
  /* {
     path: ':company/company/:id/network-scan-beta',
     loadChildren: './components/company-network-scan-beta/company-network-scan-beta.module#CompanyNetworkScanBetaModule',
     // canActivate: [PermissionCompanyService, PermissionTechUserService]
     canActivate: [TestPermissionService]
   },*/
  {
    path: ':company/company/:id/network-scan',
    loadChildren: './components/company-network-scan/company-network-scan.module#CompanyNetworkScanModule',
    canActivate: [PermissionCompanyService, PermissionTechUserService]
  },
  {
    path: ':company/company/:id/devices',
    loadChildren: './components/company-devices/company-devices.module#CompanyDevicesModule',
    canActivate: [PermissionCompanyService, PermissionTechUserService]
  },
  /* {
     path: ':company/company/:id/devices-beta',
     loadChildren: './components/company-device-beta/company-device-beta.module#CompanyDeviceBetaModule',
     //canActivate: [PermissionCompanyService, PermissionTechUserService]
     canActivate: [TestPermissionService]
   },*/
  /* {
     path: ':company/devices',
     loadChildren: './components/devices/devices.module#DevicesModule',
     // canActivate: [PermissionTechUserService],
     canActivate: [TestPermissionService]
   },*/
  {
    path: ':company/quickSupport',
    loadChildren: './components/support/support.module#SupportModule',
    canActivate: [PermissionSupportService, PermissionTechUserService]
  },
  {
    path: ':company/documents/templates',
    loadChildren: './components/documents/documents-templates/documents-templates.module#DocumentsTemplatesModule',
    canActivate: [PermissionTechUserService]

  },
  {
    path: ':company/documents',
    loadChildren: './components/documents/documents.module#DocumentsModule',
    canActivate: [PermissionTechUserService]
  },
  {
    path: ':company/marketing',
    loadChildren: './components/marketing/marketing.module#MarketingModule',
    canActivate: [PermissionUsersService, PermissionTechUserService]
  },
  {
    path: ':company/help-center',
    loadChildren: './components/super-admin-public/super-admin-public.module#SupperAdminPublicModule'
  },
  {
    path: ':company/help-center/:id',
    loadChildren: './components/super-admin-public/super-admin-public-category/super-admin-public-category.module#SuperAdminPublicCategoryModule'
  },
  {
    path: ':company/devices/reports',
    loadChildren: './components/devices/devices-report/devices-report.module#DevicesReportModule',
    //canActivate: [PermissionTechUserService]
    canActivate: [TestPermissionService]
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
