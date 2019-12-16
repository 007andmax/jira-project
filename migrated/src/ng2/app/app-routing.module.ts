import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { PasswordManagerComponent } from './components/password-manager/password-manager.component';
import { QuotesComponent } from './components/billing/quotes/quotes.component';
import { SettingComponent } from './components/setting/setting.component';
import { MyProfileComponent } from './components/setting/my-profile/my-profile.component';
import { ManageTagsComponent } from './components/setting/manage-tags/manage-tags.component';
import { CompanyProfileComponent } from './components/setting/company-profile/company-profile.component';
import { TechUsersComponent } from './components/setting/tech-users/tech-users.component';
import { EmailSettingComponent } from './components/setting/email-setting/email-setting.component';
import { TaxesComponent } from './components/setting/taxes/taxes.component';
import { PermissionManageComponent } from './components/setting/permission-manage/permission-manage.component';
import { EmailTempleteComponent } from './components/setting/email-templete/email-templete.component';
import { IntegrationsComponent } from './components/setting/integrations/integrations.component';
import { InvoiceTicketsComponent } from './components/setting/invoice-tickets/invoice-tickets.component';
import { CommissionComponent } from './components/setting/commission/commission.component';
import { SubscriptionComponent } from './components/setting/subscription/subscription.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    pathMatch: 'full',
  },
  {
    path: 'ng2/password-manager',
    component: PasswordManagerComponent,
    pathMatch: 'full',
  },
  {
    path: 'ng2/quotes',
    component: QuotesComponent,
    pathMatch: 'full',
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
    component: TaxesComponent,
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
