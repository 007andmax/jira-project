import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NgZone } from '@angular/core';
import { RouterModule, UrlHandlingStrategy } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
// @ts-ignore
import { UpgradeModule, downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SelectModule } from 'ng2-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSelectModule } from 'ngx-select-ex';
import { SidebarModule } from 'ng-sidebar';

import { ClickOutsideModule } from 'ng4-click-outside';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatIconModule } from "@angular/material";
import { CronEditorModule } from "cron-editor";
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxEditorModule } from 'ngx-editor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { PasswordManagerComponent } from './components/password-manager/password-manager.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { LeftPanelPasswordManagerComponent } from './components/left-panel/left-panel-password-manager/left-panel-password-manager.component';
import { MainComponent } from './components/main/main.component';
import { PasswordRecordsTypesComponent } from './components/left-panel/left-panel-password-manager/password-records-types/password-records-types.component';
import { PasswordManagerTableComponent } from './components/password-manager/password-manager-table/password-manager-table.component';
import { PasswoordManagerHeaderComponent } from './components/password-manager/passwoord-manager-header/passwoord-manager-header.component';

import { ApiPasswordManagerService } from "./services/password-manager/api-password-manager.service";

import { QuotesComponent } from './components/billing/quotes/quotes.component';
import { QuoteCreateComponent } from './components/billing/quotes/quote-create/quote-create.component';
import { QuoteCreateContentComponent } from './components/billing/quotes/quote-create/quote-create-content/quote-create-content.component';
import { QuoteCreateHeaderComponent } from './components/billing/quotes/quote-create/quote-create-header/quote-create-header.component';
import { QuoteCreateContentTopComponent } from './components/billing/quotes/quote-create/quote-create-content/quote-create-content-top/quote-create-content-top.component';
import { QuoteCreateContentBottomComponent } from './components/billing/quotes/quote-create/quote-create-content/quote-create-content-bottom/quote-create-content-bottom.component';
import { QuoteCreateContentNotesComponent } from './components/billing/quotes/quote-create/quote-create-content/quote-create-content-notes/quote-create-content-notes.component';
import { QuotePreviewComponent } from './components/billing/quotes/quote-preview/quote-preview.component';
import { UserPipe } from './pipe/user.pipe';
import { DateFormatPipe } from './pipe/date-format.pipe';
import { CompanyPipe } from './pipe/company.pipe';
import { PasswordManagerEditAsideComponent } from './components/password-manager/password-manager-edit-aside/password-manager-edit-aside.component';
import { DeviceUserPipe } from './pipe/device-user.pipe';
import { PasswordCategoryPipe } from './pipe/password-category.pipe';
import { SelectClientCompanyComponent } from './components/shared/select-client-company/select-client-company.component';
import { ProductListComponent } from './components/shared/product-list/product-list.component';
import { ServicesListComponent } from './components/shared/services-list/services-list.component';
import { ProductTableComponent } from './components/billing/quotes/quote-create/quote-create-content/quote-create-content-bottom/product-table/product-table.component';
import { AddItemComponent } from './components/billing/quotes/quote-create/quote-create-content/quote-create-content-bottom/add-item/add-item.component';
import { MultiDatepickerComponent } from './components/shared/multi-datepicker/multi-datepicker.component';
import { LeftPanelBillingComponent } from './components/left-panel/left-panel-billing/left-panel-billing.component';
import { ToNumerPipe } from './pipe/to-numer.pipe';
import { ModalQuoteComponent } from './services/modal/modal-quote/modal-quote.component';
import { RecurringTicketsComponent } from './components/tickets/recurring-tickets/recurring-tickets.component';
import { RecurringTicketsHeaderComponent } from "./components/tickets/recurring-tickets/recurring-tickets-header/recurring-tickets-header.component";
import { RecurringTicketsTableComponent } from "./components/tickets/recurring-tickets/recurring-tickets-table/recurring-tickets-table.component";
import { RecurringTicketsEditAsideComponent } from "./components/tickets/recurring-tickets/recurring-tickets-edit-aside/recurring-tickets-edit-aside.component";
import { DevicesRecurringTicketsComponent } from './components/tickets/recurring-tickets/devices-recurring-tickets/devices-recurring-tickets.component';
import { TagsComponent } from './components/shared/tags/tags.component';
import { IntervalComponent } from './components/shared/interval/interval.component';
import { DurationComponent } from './components/shared/duration/duration.component';
import { TehUsersComponent } from './components/shared/teh-users/teh-users.component';
import { numberDirective } from './directives/number.directive';
import { TextAreaDirective } from './directives/text-area.directive';
import { DatePickerComponent } from './components/shared/date-picker/date-picker.component';
import { RecurringTicketsAddAsideComponent } from './components/tickets/recurring-tickets/recurring-tickets-add-aside/recurring-tickets-add-aside.component';
import { AlertComponent } from './components/shared/alert/alert.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { LeftPanelCompaniesComponent } from './components/left-panel/left-panel-companies/left-panel-companies.component';
import { CompaniesHeaderComponent } from './components/companies/companies-header/companies-header.component';
import { CompaniesTableComponent } from './components/companies/companies-table/companies-table.component';
import { CompanyAddAsideComponent } from './components/companies/company-add-aside/company-add-aside.component';
import { ConfirmComponent } from './components/shared/confirm/confirm.component';
import { DownloadAgentComponent } from './components/companies/download-agent/download-agent.component';
import { CompanySubscriptionComponent } from './components/companies/company-subscription/company-subscription.component';
import { CompanyTimeZoneComponent } from './components/companies/company-time-zone/company-time-zone.component';
import { ImageCropperComponent } from './components/shared/image-cropper/image-cropper.component';
import { CompanyEditAsideComponent } from './components/companies/company-edit-aside/company-edit-aside.component';
import { CompanyTagsComponent } from './components/companies/company-tags/company-tags.component';
import { DraftEmailComponent } from './components/shared/draft-email/draft-email.component';
import { DraftEmailRecipientsComponent } from './components/shared/draft-email/draft-email-recipients/draft-email-recipients.component';
import { LeftPanelTagsCompaniesComponent } from './components/left-panel/left-panel-companies/left-panel-tags-companies/left-panel-tags-companies.component';
import { SelectSearchComponent } from './components/shared/select-search/select-search.component';
import { CompanyPasswordManagerComponent } from './components/company-password-manager/company-password-manager.component';
import { CompanyPasswoordManagerHeaderComponent } from './components/company-password-manager/passwoord-manager-header/passwoord-manager-header.component';
import { CompanyPasswordManagerEditAsideComponent } from './components/company-password-manager/password-manager-edit-aside/password-manager-edit-aside.component';
import { CompanyPasswordManagerTableComponent } from './components/company-password-manager/password-manager-table/password-manager-table.component';
import { FilterPipe } from './pipe/filter.pipe';
import { ClickOtsideDirective } from './directives/click-otside.directive';
import { SortByPipe } from './pipe/sort-by.pipe';
import { UsersComponent } from './components/users/users.component';
import { UsersHeaderComponent } from './components/users/users-header/users-header.component';
import { UsersTableComponent } from './components/users/users-table/users-table.component';
import { UsersAsideComponent } from './components/users/users-aside/users-aside.component';
import { LeftPanelUsersComponent } from './components/left-panel/left-panel-users/left-panel-users.component';
import { UserTableSubscriptionComponent } from './components/users/users-table/user-table-subscription/user-table-subscription.component';
import { NotificationComponent } from './components/shared/notification/notification.component';
import { UsersAsideEditComponent } from './components/users/users-aside-edit/users-aside-edit.component';
import { ModalImageCropperComponent } from './services/modal/modal-image-cropper/modal-image-cropper.component';
import { DraftEmailUserRecipientsComponent } from './components/shared/draft-email/draft-email-user-recipients/draft-email-user-recipients.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ItemReportComponent } from './components/reports/item-report/item-report.component';
import { OverviewReportComponent } from './components/reports/overview-report/overview-report.component';
import { ReportMenuComponent } from './components/reports/report-menu/report-menu.component';
import { SelectComponent } from './components/shared/select/select.component';
import { ReportAdditionalActionsComponent } from './components/reports/report-additional-actions/report-additional-actions.component';
import { ReportSendEmailComponent } from './components/reports/report-additional-actions/report-send-email/report-send-email.component';
import { CompanyUserComponent } from './components/company-user/company-user.component';
import { GlNumberComponent } from './components/reports/reports/gl-number/gl-number.component';
import { AccountsReceivableComponent } from './components/reports/reports/accounts-receivable/accounts-receivable.component';
import { ReportFooterComponent } from './components/reports/report-footer/report-footer.component';
import { TaxesReportComponent } from './components/reports/reports/taxes-report/taxes-report.component';
import { ProductSalesReportComponent } from './components/reports/reports/product-sales-report/product-sales-report.component';
import { CustomerSalesReportComponent } from './components/reports/reports/customer-sales-report/customer-sales-report.component';
import { NvD3Module } from 'ng2-nvd3';
import { InventoryComponent } from './components/inventory/inventory.component';
import { InventoryTableComponent } from './components/inventory/inventory-table/inventory-table.component';
import { InventoryAddAsideComponent } from './components/inventory/inventory-add-aside/inventory-add-aside.component';
import { TaxesComponent } from './components/shared/taxes/taxes.component';
import { InventoryEditAsideComponent } from './components/inventory/inventory-edit-aside/inventory-edit-aside.component';
import { LeftPanelInventoryComponent } from './components/left-panel/left-panel-inventory/left-panel-inventory.component';
import { AddCategoryProductComponent } from './components/left-panel/left-panel-inventory/add-category-product/add-category-product.component';


import 'd3';
import 'nvd3';
import { TicketReportComponent } from './components/reports/reports/ticket-report/ticket-report.component';
import { TechUsersListReportComponent } from './components/reports/report-menu/tech-users-list-report/tech-users-list-report.component';
import { ReportTimePipe } from './pipe/report-time.pipe';
import { ServiceReportComponent } from './components/reports/reports/service-report/service-report.component';
import { CompanyProductsComponent } from './components/companies/company-products/company-products.component';
/**
 * declare angular
 */
declare var angular: any;

/**
 * Hybrid mode
 */
export class CustomHandlingStrategy implements UrlHandlingStrategy {
  shouldProcessUrl(url) {
    return url.toString().startsWith("/ng2") || url.toString() == "/"
  }
  extract(url) { return url }
  merge(url, whole) { return url }
}


/**
 * Component downgrade
 */
angular.module('quicktech')
  .directive(
    'passwordManager',
    downgradeComponent({ component: PasswordManagerComponent }))
  .directive(
    'companyPasswordManager',
    downgradeComponent({ component: CompanyPasswordManagerComponent }))
  .directive(
    'companyUser',
    downgradeComponent({ component: CompanyUserComponent }))
  .directive(
    'leftPanelComponent',
    downgradeComponent({ component: LeftPanelComponent }))
  .directive(
    'quotesComponent',
    downgradeComponent({ component: QuotesComponent }))
  .directive(
    'quoteCreateComponent',
    downgradeComponent({ component: QuoteCreateComponent }))
  .directive(
    'quotePreviewComponent',
    downgradeComponent({ component: QuotePreviewComponent }))
  .directive(
    'recurringTicketsComponent',
    downgradeComponent({ component: RecurringTicketsComponent }))
  .directive(
    'companiesComponent',
    downgradeComponent({ component: CompaniesComponent }))
  .directive(
    'usersComponent',
    downgradeComponent({ component: UsersComponent }))
  .directive(
    'reportsComponent',
    downgradeComponent({ component: ReportsComponent }))
  .directive(
    'itemReportComponent',
    downgradeComponent({ component: ItemReportComponent }))
  .directive(
    'inventoryComponent',
    downgradeComponent({ component: InventoryComponent }))
  .directive(
    'companyProducts',
    downgradeComponent({ component: CompanyProductsComponent }))
  .factory('ngZone', downgradeInjectable(NgZone));

/**
 * This module represents the main application module
 */

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
    QuoteCreateComponent,
    QuoteCreateContentComponent,
    QuoteCreateHeaderComponent,
    QuoteCreateContentTopComponent,
    QuoteCreateContentBottomComponent,
    QuoteCreateContentNotesComponent,
    QuotePreviewComponent,
    SelectClientCompanyComponent,
    ProductListComponent,
    ServicesListComponent,
    ProductTableComponent,
    AddItemComponent,
    MultiDatepickerComponent,
    LeftPanelBillingComponent,
    ToNumerPipe,
    ModalQuoteComponent,
    RecurringTicketsComponent,
    RecurringTicketsHeaderComponent,
    RecurringTicketsEditAsideComponent,
    RecurringTicketsTableComponent,
    DevicesRecurringTicketsComponent,
    TagsComponent,
    IntervalComponent,
    DurationComponent,
    TehUsersComponent,
    numberDirective,
    TextAreaDirective,
    DatePickerComponent,
    RecurringTicketsAddAsideComponent,
    AlertComponent,
    CompaniesComponent,
    LeftPanelCompaniesComponent,
    CompaniesHeaderComponent,
    CompaniesTableComponent,
    CompanyAddAsideComponent,
    ConfirmComponent,
    DownloadAgentComponent,
    CompanySubscriptionComponent,
    CompanyTimeZoneComponent,
    ImageCropperComponent,
    CompanyEditAsideComponent,
    CompanyTagsComponent,
    DraftEmailComponent,
    DraftEmailRecipientsComponent,
    LeftPanelTagsCompaniesComponent,
    SelectSearchComponent,
    CompanyPasswordManagerComponent,
    CompanyPasswoordManagerHeaderComponent,
    CompanyPasswordManagerEditAsideComponent,
    CompanyPasswordManagerTableComponent,
    FilterPipe,
    ClickOtsideDirective,
    SortByPipe,
    UsersComponent,
    UsersHeaderComponent,
    UsersTableComponent,
    UsersAsideComponent,
    LeftPanelUsersComponent,
    UserTableSubscriptionComponent,
    NotificationComponent,
    UsersAsideEditComponent,
    ModalImageCropperComponent,
    DraftEmailUserRecipientsComponent,
    ReportsComponent,
    ItemReportComponent,
    OverviewReportComponent,
    ReportMenuComponent,
    SelectComponent,
    ReportAdditionalActionsComponent,
    ReportSendEmailComponent,
    CompanyUserComponent,
    GlNumberComponent,
    AccountsReceivableComponent,
    ReportFooterComponent,
    TaxesReportComponent,
    ProductSalesReportComponent,
    CustomerSalesReportComponent,
    TicketReportComponent,
    TechUsersListReportComponent,
    ReportTimePipe,
    ServiceReportComponent,
    InventoryComponent,
    InventoryTableComponent,
    InventoryAddAsideComponent,
    TaxesComponent,
    InventoryEditAsideComponent,
    LeftPanelInventoryComponent,
    AddCategoryProductComponent,
    CompanyProductsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UpgradeModule,
    HttpClientModule,
    FormsModule,
    SelectModule,
    NgbModule,
    InfiniteScrollModule,
    ClickOutsideModule,

    NgxSelectModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SidebarModule.forRoot(),
    RouterModule.forRoot([
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
      },
      {
        path: 'ng2/company-products',
        component: CompanyProductsComponent,
        pathMatch: 'full'
      },
      {
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
        path: 'ng2/inventory/products',
        component: InventoryComponent,
        pathMatch: 'full'
      },
      {
        path: 'ng2/report/:id', component: ItemReportComponent
      }],
      {
        useHash: true,
        enableTracing: false
      }),
    CronEditorModule,
    ImageCropperModule,
    NgxEditorModule,
    FontAwesomeModule,
    NvD3Module
  ],
  entryComponents: [
    LeftPanelComponent,
    ModalQuoteComponent,
    ConfirmComponent,
    QuotesComponent,
    QuoteCreateComponent,
    QuotePreviewComponent,
    PasswordManagerComponent,
    CompaniesComponent,
    DownloadAgentComponent,
    ImageCropperComponent,
    CompanyPasswordManagerComponent,
    CompanyUserComponent,
    UsersComponent,
    AlertComponent,
    ReportsComponent,
    ItemReportComponent,
    OverviewReportComponent,
    ReportSendEmailComponent,
    InventoryComponent,
    CompanyProductsComponent
    // RecurringTicketsComponent
  ],
  providers: [
    {
      provide: '$state',
      useFactory: ($injector: any) => $injector.get('$state'),
      deps: ['$injector']
    },
    { provide: UrlHandlingStrategy, useClass: CustomHandlingStrategy },
    ApiPasswordManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
