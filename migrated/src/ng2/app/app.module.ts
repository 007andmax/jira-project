import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken, NgZone } from '@angular/core';
import { RouterModule, UrlHandlingStrategy } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
// @ts-ignore
import {
  UpgradeModule,
  downgradeComponent,
  downgradeInjectable
} from '@angular/upgrade/static';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { SelectModule } from 'ng2-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SidebarModule } from 'ng-sidebar';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { ClickOutsideModule } from 'ng4-click-outside';

import { AppComponent } from './app.component';
import { PasswordManagerComponent } from './components/password-manager/password-manager.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { LeftPanelPasswordManagerComponent } from './components/left-panel/left-panel-password-manager/left-panel-password-manager.component';
import { MainComponent } from './components/main/main.component';
import { PasswordRecordsTypesComponent } from './components/left-panel/left-panel-password-manager/password-records-types/password-records-types.component';
import { PasswordManagerTableComponent } from './components/password-manager/password-manager-table/password-manager-table.component';
import { PasswoordManagerHeaderComponent } from './components/password-manager/passwoord-manager-header/passwoord-manager-header.component';

import { ApiPasswordManagerService } from './services/password-manager/api-password-manager.service';

import { UserPipe } from './pipe/user.pipe';
import { DateFormatPipe } from './pipe/date-format.pipe';
import { CompanyPipe } from './pipe/company.pipe';
import { PasswordManagerEditAsideComponent } from './components/password-manager/password-manager-edit-aside/password-manager-edit-aside.component';
import { DeviceUserPipe } from './pipe/device-user.pipe';
import { PasswordCategoryPipe } from './pipe/password-category.pipe';
import { QuotesComponent } from './components/billing/quotes/quotes.component';
import { MyProfileComponent } from './components/setting/my-profile/my-profile.component';
import { SettingComponent } from './components/setting/setting.component';
import { ManageTagsComponent } from './components/setting/manage-tags/manage-tags.component';
import { CompanyProfileComponent } from './components/setting/company-profile/company-profile.component';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule, TypeaheadModule } from 'ngx-bootstrap';

import { LeftPanelSettingComponent } from './components/left-panel/left-panel-setting/left-panel-setting.component';

import { ImageCropperModule } from 'ngx-image-cropper';
import { TechUsersComponent } from './components/setting/tech-users/tech-users.component';
import { EmailSettingComponent } from './components/setting/email-setting/email-setting.component';
import { TaxesComponent } from './components/setting/taxes/taxes.component';
import { PermissionManageComponent } from './components/setting/permission-manage/permission-manage.component';
import { EmailTempleteComponent } from './components/setting/email-templete/email-templete.component';
import { IntegrationsComponent } from './components/setting/integrations/integrations.component';
import { InvoiceTicketsComponent } from './components/setting/invoice-tickets/invoice-tickets.component';
import { CommissionComponent } from './components/setting/commission/commission.component';
import { SubscriptionComponent } from './components/setting/subscription/subscription.component';

import { DataTablesModule } from 'angular-datatables';
import { AccountComponent } from './components/setting/my-profile/account/account.component';
import { EmailNotificationsComponent } from './components/setting/my-profile/email-notifications/email-notifications.component';
import { ActivityHistoryComponent } from './components/setting/my-profile/activity-history/activity-history.component';

import { AgmCoreModule } from '@agm/core';
import { ProfileComponent } from './components/setting/my-profile/profile/profile.component';
import { TagPipe } from './pipe/tag.pipe';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { IncomingEmailComponent } from './components/setting/email-setting/incoming-email/incoming-email.component';
import { OutgoingEmailComponent } from './components/setting/email-setting/outgoing-email/outgoing-email.component';
import { TicketSettingsComponent } from './components/setting/invoice-tickets/ticket-settings/ticket-settings.component';
import { InvoiceSettingsComponent } from './components/setting/invoice-tickets/invoice-settings/invoice-settings.component';
import { QuotesSettingsComponent } from './components/setting/invoice-tickets/quotes-settings/quotes-settings.component';
import { Onlynumber } from './helpers/Onlynumber';
import { CompanyComponent } from './components/setting/commission/company/company.component';
import { ProductComponent } from './components/setting/commission/product/product.component';
import { ContractComponent } from './components/setting/commission/contract/contract.component';
import { ServiceComponent } from './components/setting/commission/service/service.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AutocompleteComponent } from './shared/autocomplete/autocomplete.component';

declare var angular: any;
declare var $: any;
export class CustomHandlingStrategy implements UrlHandlingStrategy {
  constructor() {}
  shouldProcessUrl(url) {
    const appType = url.toString().startsWith('/ng2/setting') ? 'ng2' : 'ng1';
    if (appType === 'ng2') {
       $('body').addClass('ng7');
       $('body').removeClass('backMenu');
    } else {
      $('body').removeClass('ng7');
    }
    return url.toString().startsWith('/ng2') || url.toString() == '/';
  }

  extract(url) {
    return url;
  }
  merge(url, whole) {
    return url;
  }
}

angular
  .module('quicktech')
  .directive(
    'passwordManager',
    downgradeComponent({ component: PasswordManagerComponent })
  )
  .directive(
    'leftPanelComponent',
    downgradeComponent({ component: LeftPanelComponent })
  )
  .directive(
    'quotesComponent',
    downgradeComponent({ component: QuotesComponent })
  )
  .directive(
    'settingComponent',
    downgradeComponent({ component: SettingComponent })
  )
  .directive(
    'myprofileComponent',
    downgradeComponent({ component: MyProfileComponent })
  )
  .directive(
    'manageTagsComponent',
    downgradeComponent({ component: ManageTagsComponent })
  )
  .directive(
    'companyProfileComponent',
    downgradeComponent({ component: CompanyProfileComponent })
  )
  .directive(
    'techComponent',
    downgradeComponent({ component: TechUsersComponent })
  )
  .directive(
    'emailSettingComponent',
    downgradeComponent({ component: EmailSettingComponent })
  )
  .directive(
    'taxesComponent',
    downgradeComponent({ component: TaxesComponent })
  )
  .directive(
    'permissionManageComponent',
    downgradeComponent({ component: PermissionManageComponent })
  )
  .directive(
    'emailTempleteComponent',
    downgradeComponent({ component: EmailTempleteComponent })
  )
  .directive(
    'integrationsComponent',
    downgradeComponent({ component: IntegrationsComponent })
  )
  .directive(
    'invoiceTicketComponent',
    downgradeComponent({ component: InvoiceTicketsComponent })
  )
  .directive(
    'commissionComponent',
    downgradeComponent({ component: CommissionComponent })
  )
  .directive(
    'subscriptionComponent',
    downgradeComponent({ component: SubscriptionComponent })
  )
  .factory('ngZone', downgradeInjectable(NgZone));

@NgModule({
  declarations: [
    AppComponent,
    PasswordManagerComponent,
    LeftPanelComponent,
    LeftPanelPasswordManagerComponent,
    MainComponent,
    CompanyPipe,
    PasswordRecordsTypesComponent,
    PasswordManagerTableComponent,
    PasswoordManagerHeaderComponent,
    UserPipe,
    DateFormatPipe,
    PasswordManagerEditAsideComponent,
    DeviceUserPipe,
    PasswordCategoryPipe,
    QuotesComponent,
    MyProfileComponent,
    SettingComponent,
    CompanyProfileComponent,
    LeftPanelSettingComponent,
    ManageTagsComponent,
    TechUsersComponent,
    EmailSettingComponent,
    TaxesComponent,
    PermissionManageComponent,
    EmailTempleteComponent,
    IntegrationsComponent,
    InvoiceTicketsComponent,
    CommissionComponent,
    SubscriptionComponent,
    AccountComponent,
    EmailNotificationsComponent,
    ActivityHistoryComponent,
    ProfileComponent,
    TagPipe,
    IncomingEmailComponent,
    OutgoingEmailComponent,
    TicketSettingsComponent,
    InvoiceSettingsComponent,
    QuotesSettingsComponent,
    Onlynumber,
    CompanyComponent,
    ProductComponent,
    ContractComponent,
    ServiceComponent,
    AutocompleteComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    UpgradeModule,
    HttpClientModule,
    FormsModule,
    AngularEditorModule ,
    NgbModule,
    ClickOutsideModule,
    ShowHidePasswordModule,
    AppRoutingModule,
    ImageCropperModule,
    DataTablesModule,
    NgSelectModule ,
    SelectDropDownModule,
    TabsModule.forRoot(),
    SidebarModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAbP4DFpz4f9YcXMWUjdkOdyArX2peNt8s'
    }),
    
    ToastrModule.forRoot({
      closeButton: true,
      preventDuplicates: true,
      timeOut: 3000
    }),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.circleSwish,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#16a4fa',
      secondaryColour: '#16a4fa',
      tertiaryColour: '#16a4fa'
    })
  ],
  entryComponents: [LeftPanelComponent],
  providers: [
    { provide: UrlHandlingStrategy, useClass: CustomHandlingStrategy },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ApiInterceptor,
    //   multi: true
    // },
    ApiPasswordManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
