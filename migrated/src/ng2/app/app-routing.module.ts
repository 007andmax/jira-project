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
import { QuoteCreateComponent } from './components/billing/quotes/quote-create/quote-create.component';
import { QuotePreviewComponent } from './components/billing/quotes/quote-preview/quote-preview.component';
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
import { BillableComponent } from './components/billing/billable/billable.component';
import { BillableTicketsComponent } from './components/billing/billable/billable-tickets/billable-tickets.component';
import { InvoicesComponent } from './components/billing/invoices/invoices.component';
import { DefaultServicesComponent } from './components/billing/default-services/default-services.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/password-manager',
    component: PasswordManagerComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/company-password-manager',
    component: CompanyPasswordManagerComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/company-user',
    component: CompanyUserComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/company-tickets',
    component: CompanyTicketsComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/quotes',
    component: QuotesComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/quotes/quote-create',
    component: QuoteCreateComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng2/quotes/quote-preview',
    component: QuotePreviewComponent,
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
    path: 'ng2/company-products',
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
    path: 'ng2/services',
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
