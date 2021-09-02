import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NgZone } from '@angular/core';
import { UrlHandlingStrategy } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { NgxMaskModule } from 'ngx-mask'
// @ts-ignore
import {
  UpgradeModule,
  downgradeComponent,
  downgradeInjectable
} from '@angular/upgrade/static';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IgxTimePickerModule } from 'igniteui-angular';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ClickOutsideModule } from 'ng4-click-outside';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatIconModule } from '@angular/material';
import { ImageCropperModule } from 'ngx-image-cropper';
// import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { AppComponent } from './app.component';
import { PasswordManagerComponent } from './components/password-manager/password-manager.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { LeftPanelPasswordManagerComponent } from './components/left-panel/left-panel-password-manager/left-panel-password-manager.component';
import { MainComponent } from './components/main/main.component';
import { PasswordManagerTableComponent } from './components/password-manager/password-manager-table/password-manager-table.component';
import { PasswoordManagerHeaderComponent } from './components/password-manager/passwoord-manager-header/passwoord-manager-header.component';
import { QuotesComponent } from './components/billing/quotes/quotes.component';
import { UserPipe } from './pipe/user.pipe';
import { DateFormatPipe } from './pipe/date-format.pipe';
import { CompanyPipe } from './pipe/company.pipe';
import { PasswordManagerEditAsideComponent } from './components/password-manager/password-manager-edit-aside/password-manager-edit-aside.component';
import { DeviceUserPipe } from './pipe/device-user.pipe';
import { PasswordCategoryPipe } from './pipe/password-category.pipe';
import { SanitizeHtmlPipe } from './pipe/sanitize-html.pipe';
import { SelectClientCompanyComponent } from './components/shared/select-client-company/select-client-company.component';
import { ProductListComponent } from './components/shared/product-list/product-list.component';
import { ServicesListComponent } from './components/shared/services-list/services-list.component';
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
import { SelectSearchComponent } from './components/shared/select-search/select-search.component';
import { CompanyPasswordManagerComponent } from './components/company-password-manager/company-password-manager.component';
import { FilterPipe } from './pipe/filter.pipe';
import { ClickOtsideDirective } from './directives/click-otside.directive';
import { SortByPipe } from './pipe/sort-by.pipe';
import { UsersComponent } from './components/users/users.component';
import { UsersHeaderComponent } from './components/users/users-header/users-header.component';
import { UsersTableComponent } from './components/users/users-table/users-table.component';
import { UsersAsideComponent } from './components/users/users-aside/users-aside.component';
import { LeftPanelUsersComponent } from './components/left-panel/left-panel-users/left-panel-users.component';
import { UserTableSubscriptionComponent } from './components/users/users-table/user-table-subscription/user-table-subscription.component';
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
import { TicketsComponent } from './components/tickets/tickets/tickets.component';
import { TicketsTableComponent } from './components/tickets/tickets/tickets-table/tickets-table.component';
import { TicketsHeaderComponent } from './components/tickets/tickets/tickets-header/tickets-header.component';
import { TicketAddAsideComponent } from './components/tickets/tickets/ticket-add-aside/ticket-add-aside.component';
import { UploadAreaComponent } from './components/shared/upload-area/upload-area.component';
import { TicketEditAsideComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-edit-aside.component';
import { TicketsPrioritiesComponent } from './components/tickets/tickets-priorities/tickets-priorities.component';
import { LeftPanelTicketsComponent } from './components/left-panel/left-panel-tickets/left-panel-tickets.component';
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
import { InventoryEditAsideComponent } from './components/inventory/inventory-edit-aside/inventory-edit-aside.component';
import { LeftPanelInventoryComponent } from './components/left-panel/left-panel-inventory/left-panel-inventory.component';
import { AddCategoryProductComponent } from './components/left-panel/left-panel-inventory/add-category-product/add-category-product.component';
import { MyProfileComponent } from './components/setting/my-profile/my-profile.component';
import { SettingComponent } from './components/setting/setting.component';
import { ManageTagsComponent } from './components/setting/manage-tags/manage-tags.component';
import { CompanyProfileComponent } from './components/setting/company-profile/company-profile.component';
import { TicketReportComponent } from './components/reports/reports/ticket-report/ticket-report.component';
import { TechUsersListReportComponent } from './components/reports/report-menu/tech-users-list-report/tech-users-list-report.component';
import { ReportTimePipe } from './pipe/report-time.pipe';
import { ServiceReportComponent } from './components/reports/reports/service-report/service-report.component';
import { CompanyProductsComponent } from './components/companies/company-products/company-products.component';
/**
 * declare angular
 */
declare var angular: any;
import { TechUsersComponent } from './components/setting/tech-users/tech-users.component';
import { EmailSettingComponent } from './components/setting/email-setting/email-setting.component';
import { TaxesSettingsComponent } from './components/setting/taxes/taxes.component';
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
import { NgxUploaderModule } from 'ngx-uploader';
import { ToastrModule } from 'ngx-toastr';
// import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { IncomingEmailComponent } from './components/setting/email-setting/incoming-email/incoming-email.component';
import { OutgoingEmailComponent } from './components/setting/email-setting/outgoing-email/outgoing-email.component';
import { TicketSettingsComponent } from './components/setting/invoice-tickets/ticket-settings/ticket-settings.component';
import { InvoiceSettingsComponent } from './components/setting/invoice-tickets/invoice-settings/invoice-settings.component';
import { QuotesSettingsComponent } from './components/setting/invoice-tickets/quotes-settings/quotes-settings.component';
import { GlNumberSettingsComponent } from './components/setting/gl-number/gl-number.component';
import { Onlynumber } from './helpers/Onlynumber';
import { CompanyComponent } from './components/setting/commission/company/company.component';
import { ProductComponent } from './components/setting/commission/product/product.component';
import { ContractComponent } from './components/setting/commission/contract/contract.component';
import { ServiceComponent } from './components/setting/commission/service/service.component';
// import { AngularEditorModule } from '@kolkov/angular-editor';
import { AutocompleteComponent } from './shared/autocomplete/autocomplete.component';
import { PhonePipe } from './pipe/phone.pipe';
import { OrderByPipe } from './pipe/order-by.pipe';
import { TaxesComponent } from './components/shared/taxes/taxes.component';
import { TicketsTableItemComponent } from './components/tickets/tickets/tickets-table/tickets-table-item/tickets-table-item.component';
import { TicketEditAsideCompanyInfoComponent } from './components/tickets/tickets/ticket-edit-aside-company-info/ticket-edit-aside-company-info.component';
import { TicketEditAsideDevicesComponent } from './components/tickets/tickets/ticket-edit-aside-devices/ticket-edit-aside-devices.component';
import { TicketEditAsideUsersComponent } from './components/tickets/tickets/ticket-edit-aside-users/ticket-edit-aside-users.component';
import { TicketsStatusComponent } from './components/left-panel/left-panel-tickets/tickets-status/tickets-status.component';
import { UploadAreaProgressComponent } from './components/shared/upload-area/upload-area-progress/upload-area-progress.component';
import { DndDirective } from './directives/dnd.directive';
import { AddAssignedUserComponent } from './components/tickets/tickets/ticket-edit-aside/add-assigned-user/add-assigned-user.component';
import { TicketEditTagsComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-edit-tags/ticket-edit-tags.component';
import { TicketProfileActionsComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-actions/ticket-profile-actions.component';
import { TicketClaimInfoComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-claim-info/ticket-claim-info.component';
import { TicketProfileFormUpdateComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-form-update/ticket-profile-form-update.component';
import { TicketProfileFormUpdateProductsComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-form-update/ticket-profile-form-update-products/ticket-profile-form-update-products.component';
import { TicketProfileFormUpdateServicesComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-form-update/ticket-profile-form-update-services/ticket-profile-form-update-services.component';
import { TicketMessageComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-message/ticket-message.component';
import { TicketProfileUpdatesComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates.component';
import { TicketProfileUpdatesNoteComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-note/ticket-profile-updates-note.component';
import { TicketProfileUpdatesProductComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-product/ticket-profile-updates-product.component';
import { TicketProfileUpdatesFooterComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-footer/ticket-profile-updates-footer.component';
import { TicketProfileUpdatesServiceComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service/ticket-profile-updates-service.component';
import { TicketProfileUpdatesServiceDurationComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-duration/ticket-profile-updates-service-duration.component';
import { TicketProfileUpdatesServiceTimepickerComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.component';
import { TicketProfileUpdatesServiceInfoComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service/ticket-profile-updates-service-info/ticket-profile-updates-service-info.component';
import { TicketProfileUpdatesServiceEditComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service/ticket-profile-updates-service-edit/ticket-profile-updates-service-edit.component';
import { TicketProfileUpdatesServiceItemComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service/ticket-profile-updates-service-item/ticket-profile-updates-service-item.component';
import { TicketProfileUpdatesProductItemComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-product/ticket-profile-updates-product-item/ticket-profile-updates-product-item.component';
import { TicketProfileUpdatesProductInfoComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-product/ticket-profile-updates-product-info/ticket-profile-updates-product-info.component';
import { TicketProfileUpdatesProductEditComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-product/ticket-profile-updates-product-edit/ticket-profile-updates-product-edit.component';
import { TicketChangeStatusComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-change-status/ticket-change-status.component';
import { PreloaderTicketComponent } from './components/tickets/tickets/preloader-ticket/preloader-ticket.component';
import { TicketProfileAttachmentsComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-attachments/ticket-profile-attachments.component';
import { PreviewAttachmentComponent } from './components/tickets/tickets/ticket-edit-aside/preview-attachment/preview-attachment.component';
import { TicketProfileUpdatesNoteItemComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-note/ticket-profile-updates-note-item/ticket-profile-updates-note-item.component';
import { TicketProfileUpdatesNoteInfoComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-note/ticket-profile-updates-note-info/ticket-profile-updates-note-info.component';
import { TicketProfileUpdatesNoteEditComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-note/ticket-profile-updates-note-edit/ticket-profile-updates-note-edit.component';
import { ToFixedDirective } from './directives/to-fixed.directive';
import { MapModalComponent } from './components/shared/map-modal/map-modal.component';
import { CompanyInfoHistoryComponent } from './components/tickets/tickets/ticket-edit-aside-company-info/company-info-history/company-info-history.component';
import { TicketEditAsideRightPanelComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-edit-aside-right-panel/ticket-edit-aside-right-panel.component';
import { CompanyTicketsComponent } from './components/company-tickets/company-tickets.component';
import { CompanyDashboardComponent } from './components/company-dashboard/company-dashboard.component';
import { InventoryAddBodyComponent } from './components/inventory/inventory-add-aside/inventory-add-body/inventory-add-body.component';
import { ServicePipe } from './pipe/service.pipe';
import { LeftPanelSettingsComponent } from './components/left-panel/left-panel-settings/left-panel-settings.component';
import { BillableComponent } from './components/billing/billable/billable.component';
import { BillableItemComponent } from './components/billing/billable/billable-item/billable-item.component';
import { BillableAsideComponent } from './components/billing/billable/billable-aside/billable-aside.component';
import { InvoiceFormComponent } from './components/billing/billable/billable-aside/invoice-form/invoice-form.component';
import { BillableTicketsComponent } from './components/billing/billable/billable-tickets/billable-tickets.component';
import { InvoiceFormEditCustomerComponent } from './components/billing/billable/billable-aside/invoice-form/invoice-form-edit-customer/invoice-form-edit-customer.component';
import { InvoicePreviewComponent } from './components/billing/billable/billable-aside/invoice-preview/invoice-preview.component';
import { InvoiceAddNoteComponent } from './components/billing/billable/billable-aside/invoice-form/invoice-add-note/invoice-add-note.component';
import { InvoiceSelectNoteComponent } from './components/billing/billable/billable-aside/invoice-form/invoice-select-note/invoice-select-note.component';
import { InvoiceRegularNoteComponent } from './components/billing/billable/billable-aside/invoice-form/invoice-regular-note/invoice-regular-note.component';
import { TicketsFilterComponent } from './components/tickets/tickets/tickets-header/tickets-filter/tickets-filter.component';
import { DisabledBtnModule } from './modules/disabled-btn/disabled-btn.module';
import { InvoiceFormTicketInfoComponent } from './components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-info/invoice-form-ticket-info.component';
import { InvoiceFormTicketEditComponent } from './components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit.component';
import { InvoiceFormTicketEditServiceComponent } from './components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-service/invoice-form-ticket-edit-service.component';
import { InvoiceFormTicketEditProductComponent } from './components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-product/invoice-form-ticket-edit-product.component';
import { InvoiceFormTicketEditTaxesComponent } from './components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.component';
import { InvoiceDiscountComponent } from './components/billing/billable/billable-aside/invoice-form/invoice-discount/invoice-discount.component';
import { ContractsComponent } from './components/billing/contracts/contracts.component';
import { CreateContractsComponent } from './components/billing/contracts/create-contracts/create-contracts.component';
import { ContractsHeaderComponent } from './components/billing/contracts/contracts-header/contracts-header.component';
import { ContractsTableComponent } from './components/billing/contracts/contracts-table/contracts-table.component';
import { ContractsAsideComponent } from './components/billing/contracts/contracts-aside/contracts-aside.component';
import { InvoicesComponent } from './components/billing/invoices/invoices.component';
import { InvoicesAsideComponent } from './components/billing/invoices/invoices-aside/invoices-aside.component';
import { InvoicesItemComponent } from './components/billing/invoices/invoices-item/invoices-item.component';
import { InvoicesHeaderComponent } from './components/billing/invoices/invoices-header/invoices-header.component';
import { InvoicesFilterComponent } from './components/billing/invoices/invoices-header/invoices-filter/invoices-filter.component';
import { InvoicesAsidePreviewComponent } from './components/billing/invoices/invoices-aside-preview/invoices-aside-preview.component';
import { PaymentsComponent } from './components/billing/payments/payments.component';
import { PaymentsHeaderComponent } from './components/billing/payments/payments-header/payments-header.component';
import { PaymentItemComponent } from './components/billing/payments/payment-item/payment-item.component';
import { PaymentsFilterComponent } from './components/billing/payments/payments-header/payments-filter/payments-filter.component';
import { PaymentsAsideComponent } from './components/billing/payments/payments-aside/payments-aside.component';
import { RefundPaymentComponent } from './components/billing/payments/refund-payment/refund-payment.component';
import { EditPaymentComponent } from './components/billing/payments/edit-payment/edit-payment.component';
import { TechServiceReportComponent } from './components/reports/reports/tech-service-report/tech-service-report.component';
import { AccountingReportComponent } from './components/reports/reports/accounting-report/accounting-report.component';
import { ContractsTableItemComponent } from './components/billing/contracts/contracts-table/contracts-table-item/contracts-table-item.component';
import { ContractsAsideSelectTypeComponent } from './components/billing/contracts/contracts-aside/contracts-aside-select-type/contracts-aside-select-type.component';
import { ContractsAsideHourlyBillingComponent } from './components/billing/contracts/contracts-aside/contracts-aside-hourly-billing/contracts-aside-hourly-billing.component';
import { ContractsAsideBlockTimeBillingComponent } from './components/billing/contracts/contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing.component';
import { ContractsAsideUserDeviceBillingComponent } from './components/billing/contracts/contracts-aside/contracts-aside-user-device-billing/contracts-aside-user-device-billing.component';
import { ContractsAsideProductServiceContractsComponent } from './components/billing/contracts/contracts-aside/contracts-aside-product-service-contracts/contracts-aside-product-service-contracts.component';
import { ContractsFilterComponent } from './components/billing/contracts/contracts-filter/contracts-filter.component';
import { ContractsAsideTopComponent } from './components/billing/contracts/contracts-aside/contracts-aside-top/contracts-aside-top.component';
import { ContractsAsideHourlyBillingDefaultServiceComponent } from './components/billing/contracts/contracts-aside/contracts-aside-hourly-billing/contracts-aside-hourly-billing-default-service/contracts-aside-hourly-billing-default-service.component';
import { ContractsAsideHourlyBillingAddServiceComponent } from './components/billing/contracts/contracts-aside/contracts-aside-hourly-billing/contracts-aside-hourly-billing-add-service/contracts-aside-hourly-billing-add-service.component';
import { DefaultServicesComponent } from './components/billing/default-services/default-services.component';
import { DefaultServicesAddComponent } from './components/billing/default-services/default-services-add/default-services-add.component';
import { DefaultServicesItemComponent } from './components/billing/default-services/default-services-item/default-services-item.component';
import { DefaultServicesContractsComponent } from './components/billing/default-services/default-services-contracts/default-services-contracts.component';
import { DefaultServicesEditComponent } from './components/billing/default-services/default-services-edit/default-services-edit.component';
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
import { DeviceComponent } from './components/device/device.component';
import { NavComponent } from './components/device/nav/nav.component';
import { TicketTaskComponent } from './components/device/ticket-task/ticket-task.component';
import { searchTextPipe } from './components/device/_pipe/searchText.pipe';
import { SoftwarePipe } from './pipe/software.pipe';
import { DropDownComponent } from './components/shared/drop-down/drop-down.component';
import { ContractsAsideHourlyBillingPreviewComponent } from './components/billing/contracts/contracts-preview/contracts-aside-hourly-billing-preview/contracts-aside-hourly-billing-preview.component';
import { ContractsPreviewComponent } from './components/billing/contracts/contracts-preview/contracts-preview.component';
import { ContractsEditComponent } from './components/billing/contracts/contracts-edit/contracts-edit.component';
import { ContractsAsideHourlyEditComponent } from './components/billing/contracts/contracts-edit/contracts-aside-hourly-edit/contracts-aside-hourly-edit.component';
import { ContractsAsideHourlyBillingEditDefaultServiceComponent } from './components/billing/contracts/contracts-edit/contracts-aside-hourly-edit/contracts-aside-hourly-billing-edit-default-service/contracts-aside-hourly-billing-edit-default-service.component';
import { ContractsAsideBlockTimeBillingCustomerServiceComponent } from './components/billing/contracts/contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-customer-service/contracts-aside-block-time-billing-customer-service.component';
import { DecimalNumberDirective } from './directives/decimal-number.directive';
import { ContractsAsideBlockTimeBillingDefaultServiceComponent } from './components/billing/contracts/contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-default-service/contracts-aside-block-time-billing-default-service.component';
import { ContractsAsideBlockTimeBillingAddDefaultServiceComponent } from './components/billing/contracts/contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-add-default-service/contracts-aside-block-time-billing-add-default-service.component';
import { ContractsAsideBlockTimeBillingUsersComponent } from './components/billing/contracts/contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-users/contracts-aside-block-time-billing-users.component';
import { ContractsConfirmComponent } from './components/billing/contracts/contracts-confirm/contracts-confirm.component';
import { ContractsAsideEditHourlyAddDefaultServiceComponent } from './components/billing/contracts/contracts-edit/contracts-aside-hourly-edit/contracts-aside-edit-hourly-add-default-service/contracts-aside-edit-hourly-add-default-service.component';
import { ContractsAsideBlockTimeBillingPreviewComponent } from './components/billing/contracts/contracts-preview/contracts-aside-block-time-billing-preview/contracts-aside-block-time-billing-preview.component';
import { ContractsAsideBlockTimeEditComponent } from './components/billing/contracts/contracts-edit/contracts-aside-block-time-edit/contracts-aside-block-time-edit.component';
import { ContractsAsideBlockTimeEditCustomerServiceComponent } from './components/billing/contracts/contracts-edit/contracts-aside-block-time-edit/contracts-aside-block-time-edit-customer-service/contracts-aside-block-time-edit-customer-service.component';
import { ContractsAsideUserDeviceServiceComponent } from './components/billing/contracts/contracts-aside/contracts-aside-user-device-billing/contracts-aside-user-device-service/contracts-aside-user-device-service.component';
import { ContractsAsideUserDeviceBillingPreviewComponent } from './components/billing/contracts/contracts-preview/contracts-aside-user-device-billing-preview/contracts-aside-user-device-billing-preview.component';
import { ContractsAsideUserDeviceEditComponent } from './components/billing/contracts/contracts-edit/contracts-aside-user-device-edit/contracts-aside-user-device-edit.component';
import { ContractsAsideOtherProductComponent } from './components/billing/contracts/contracts-aside/contracts-aside-product-service-contracts/contracts-aside-other-product/contracts-aside-other-product.component';
import { ContractsAsideOtherServiceComponent } from './components/billing/contracts/contracts-aside/contracts-aside-product-service-contracts/contracts-aside-other-service/contracts-aside-other-service.component';
import { ContractsAsideProductServicePreviewComponent } from './components/billing/contracts/contracts-preview/contracts-aside-product-service-preview/contracts-aside-product-service-preview.component';
import { ContractsAsideProductServiceEditComponent } from './components/billing/contracts/contracts-edit/contracts-aside-product-service-edit/contracts-aside-product-service-edit.component';
import { ContractsAsideOtherServiceEditComponent } from './components/billing/contracts/contracts-edit/contracts-aside-product-service-edit/contracts-aside-other-service-edit/contracts-aside-other-service-edit.component';
import { DashboardBillingComponent } from './components/billing/dashboard-billing/dashboard-billing.component';
import 'd3';
import 'nvd3';
import { InvoiceRevenueComponent } from './components/billing/dashboard-billing/invoice-revenue/invoice-revenue.component';
import { MultiDatepickerDashboardComponent } from './components/billing/dashboard-billing/multi-datepicker-dashboard/multi-datepicker-dashboard.component';
import { ContractsDashboardComponent } from './components/billing/dashboard-billing/contracts-dashboard/contracts-dashboard.component';
import { TopDashboardComponent } from './components/billing/dashboard-billing/top-dashboard/top-dashboard.component';
import { TopProductDashboardComponent } from './components/billing/dashboard-billing/top-product-dashboard/top-product-dashboard.component';
import { DashboardStatsComponent } from './components/billing/dashboard-billing/dashboard-stats/dashboard-stats.component';
import { DashboardQuotesComponent } from './components/billing/dashboard-billing/dashboard-quotes/dashboard-quotes.component';
import { DashboardSalesAnalyticsComponent } from './components/billing/dashboard-billing/dashboard-sales-analytics/dashboard-sales-analytics.component';
import { CompanyContractsComponent } from './components/companies/company-contracts/company-contracts.component';
import { QuotesTableComponent } from './components/billing/quotes/quotes-table/quotes-table.component';
import { QuotesHeaderComponent } from './components/billing/quotes/quotes-header/quotes-header.component';
import { QuotesItemComponent } from './components/billing/quotes/quotes-table/quotes-item/quotes-item.component';
import { QuotesFilterComponent } from './components/billing/quotes/quotes-header/quotes-filter/quotes-filter.component';
import { QuoteAsidePreviewComponent } from './components/billing/quotes/quote-aside-preview/quote-aside-preview.component';
import { QuoteAsidePreviewBodyComponent } from './components/billing/quotes/quote-aside-preview/quote-aside-preview-body/quote-aside-preview-body.component';
import { QuoteAsideAddComponent } from './components/billing/quotes/quote-aside-add/quote-aside-add.component';
import { QuoteAsideAddBodyComponent } from './components/billing/quotes/quote-aside-add/quote-aside-add-body/quote-aside-add-body.component';
import { ProductListQuoteComponent } from './components/billing/quotes/quote-aside-add/product-list-quote/product-list-quote.component';
import { ServiceListQuoteComponent } from './components/billing/quotes/quote-aside-add/service-list-quote/service-list-quote.component';
import { ProductItemQuoteComponent } from './components/billing/quotes/quote-aside-add/product-item-quote/product-item-quote.component';
import { QuoteAsideEditComponent } from './components/billing/quotes/quote-aside-edit/quote-aside-edit.component';
import { ProductItemQuoteEditComponent } from './components/billing/quotes/quote-aside-edit/product-item-quote-edit/product-item-quote-edit.component';
import { QuoteAsideEditBodyComponent } from './components/billing/quotes/quote-aside-edit/quote-aside-edit-body/quote-aside-edit-body.component';
import { ServiceItemQuoteComponent } from './components/billing/quotes/quote-aside-add/service-item-quote/service-item-quote.component';
import { PermissionDasnboardBillingService } from './services/dashboard-billing/permission-dasnboard-billing.service';
import { TicketsDashboardComponent } from './components/tickets/tickets-dashboard/tickets-dashboard.component';
import { RecurringTicketWidgetComponent } from './components/tickets/tickets-dashboard/recurring-ticket-widget/recurring-ticket-widget.component';
import { TicketsAnalyticsWidgetComponent } from './components/tickets/tickets-dashboard/tickets-analytics-widget/tickets-analytics-widget.component';
import { TicketPriorityWidgetComponent } from './components/tickets/tickets-dashboard/ticket-priority-widget/ticket-priority-widget.component';
import { TimeOnTicketsWidgetComponent } from './components/tickets/tickets-dashboard/time-on-tickets-widget/time-on-tickets-widget.component';
import { TicketsBillableHoursWidgetComponent } from './components/tickets/tickets-dashboard/tickets-billable-hours-widget/tickets-billable-hours-widget.component';
import { TechTicketsWidgetComponent } from './components/tickets/tickets-dashboard/tech-tickets-widget/tech-tickets-widget.component';
import { CompanyNetworkScanComponent } from './components/company-network-scan/company-network-scan.component';
import { CompanyDevicesComponent } from './components/company-devices/company-devices.component';
import { CompanyDevicesItemComponent } from './components/company-devices/company-devices-item/company-devices-item.component';
import { CompanyDevicesHeaderComponent } from './components/company-devices/company-devices-header/company-devices-header.component';
import { CompanyDevicesRemoteAccessComponent } from './components/company-devices/company-devices-remote-access/company-devices-remote-access.component';
import { CompanyDevicesEditNameComponent } from './components/company-devices/company-devices-edit-name/company-devices-edit-name.component';
import { CompanyDevicesAsideComponent } from './components/company-devices/company-devices-aside/company-devices-aside.component';
import { CompanyDevicesAsideDeviceIconComponent } from './components/company-devices/company-devices-aside/company-devices-aside-device-icon/company-devices-aside-device-icon.component';
import { CompanyDevicesAsideSystemComponent } from './components/company-devices/company-devices-aside/company-devices-aside-system/company-devices-aside-system.component';
import { CompanyDevicesAsideNetworkTabComponent } from './components/company-devices/company-devices-aside/company-devices-aside-network-tab/company-devices-aside-network-tab.component';
import { CompanyDevicesAsideSoftwareComponent } from './components/company-devices/company-devices-aside/company-devices-aside-software/company-devices-aside-software.component';
import { CompanyDevicesAsideUpdatesComponent } from './components/company-devices/company-devices-aside/company-devices-aside-updates/company-devices-aside-updates.component';
import { CompanyDevicesExistRemoteSessionsComponent } from './components/company-devices/company-devices-item/company-devices-exist-remote-sessions/company-devices-exist-remote-sessions.component';
import { CompanyDevicesNoExistRemoteSessionsComponent } from './components/company-devices/company-devices-item/company-devices-no-exist-remote-sessions/company-devices-no-exist-remote-sessions.component';
import { CompanyDevicesEditLabelComponent } from './components/company-devices/company-devices-edit-label/company-devices-edit-label.component';
import { CompanyDevicesAsideTooltipComponent } from './components/company-devices/company-devices-aside/company-devices-aside-tooltip/company-devices-aside-tooltip.component';
import { CompanyNetworkScanNoExistDevicesComponent } from './components/company-network-scan/company-network-scan-no-exist-devices/company-network-scan-no-exist-devices.component';
import { NetworkScanCredentialsAsideComponent } from './components/company-network-scan/network-scan-credentials-aside/network-scan-credentials-aside.component';
import { NetworkScanCredentialsAddComponent } from './components/company-network-scan/network-scan-credentials-add/network-scan-credentials-add.component';
import { NetworkScanCredentialsAsideItemComponent } from './components/company-network-scan/network-scan-credentials-aside/network-scan-credentials-aside-item/network-scan-credentials-aside-item.component';
import { CompanyNetworkScanItemComponent } from './components/company-network-scan/company-network-scan-item/company-network-scan-item.component';
import { CompanyNetworkScanItemTooltipComponent } from './components/company-network-scan/company-network-scan-item/company-network-scan-item-tooltip/company-network-scan-item-tooltip.component';
import { CompanyDashDetailComponent } from './components/company-dashboard/company-dash-detail/company-dash-detail.component';
import { CompanyDashStatsComponent } from './components/company-dashboard/company-dash-stats/company-dash-stats.component';
import { CompanyDashTicketComponent } from './components/company-dashboard/company-dash-ticket/company-dash-ticket.component';
import { CompanyDashRevenueComponent } from './components/company-dashboard/company-dash-revenue/company-dash-revenue.component';
import { CompanyDashInvoiceComponent } from './components/company-dashboard/company-dash-invoice/company-dash-invoice.component';
import { CompanyDashContractComponent } from './components/company-dashboard/company-dash-contract/company-dash-contract.component';
import { LeftPanelCompanyComponent } from './components/left-panel/left-panel-company/left-panel-company.component';
import { UsersFilterComponent } from './components/users/users-header/users-filter/users-filter.component';
import { SupportComponent } from './components/support/support.component';
import { SupportItemComponent } from './components/support/support-item/support-item.component';
import { DynamicTooltipComponent } from './components/shared/dynamic-tooltip/dynamic-tooltip.component';
import { TicketProfileFormUpdateSupportComponent } from './components/tickets/tickets/ticket-edit-aside/ticket-profile-form-update/ticket-profile-form-update-support/ticket-profile-form-update-support.component';
import { LeftPanelSupportComponent } from './components/left-panel/left-panel-support/left-panel-support.component';
import { HeaderComponent } from './components/header/header.component';
import { GlobalSearchComponent } from './components/header/global-search/global-search.component';
import { ReportListItemComponent } from './components/reports/report-list-item/report-list-item.component';
import { LeftPanelReportsComponent } from './components/left-panel/left-panel-reports/left-panel-reports.component';
import { BreadcrumbsComponent } from './components/shared/breadcrumbs/breadcrumbs.component';
import { DetailedCommissionsReportComponent } from './components/reports/reports/detailed-commissions-report/detailed-commissions-report.component';
import { ToFixedPipe } from './pipe/to-fixed.pipe';
import { CommonCommissionsReportComponent } from './components/reports/reports/common-commissions-report/common-commissions-report.component';
import { SoftwareSummaryReportComponent } from './components/reports/reports/software-summary-report/software-summary-report.component';
import { SoftwareSummaryDevicesDroDownComponent } from './components/reports/reports/software-summary-report/software-summary-devices-dro-down/software-summary-devices-dro-down.component';
import { HardwareSummaryReportComponent } from './components/reports/reports/hardware-summary-report/hardware-summary-report.component';
import { DeviceIpSummaryReportComponent } from './components/reports/reports/device-ip-summary-report/device-ip-summary-report.component';
import { RemoteConnectionReportComponent } from './components/reports/reports/remote-connection-report/remote-connection-report.component';
import { TechSalesReportComponent } from './components/reports/reports/tech-sales-report/tech-sales-report.component';
import { TechTicketReportComponent } from './components/reports/reports/tech-ticket-report/tech-ticket-report.component';
import { ModalLockScreenComponent } from './services/modal/modal-lock-screen/modal-lock-screen.component';
import { HttpInterceptorService } from './services/http/http-interceptor.service';
import { ModalSessionScreenComponent } from './services/modal/modal-session-screen/modal-session-screen.component';
import { KeyUpEnterDirective } from './directives/key-up-enter.directive';
import { InventoryAddCategoryComponent } from './components/inventory/inventory-add-category/inventory-add-category.component';
import { InventoryHeaderComponent } from './components/inventory/inventory-header/inventory-header.component';
import { InventoryFilterComponent } from './components/inventory/inventory-header/inventory-filter/inventory-filter.component';
import { PasswordManagerAddCategoryComponent } from './components/password-manager/password-manager-add-category/password-manager-add-category.component';
import { PasswordManagerAddAsideComponent } from './components/password-manager/password-manager-add-aside/password-manager-add-aside.component';
import { PasswoordManagerDevicesUsersComponent } from './components/password-manager/passwoord-manager-devices-users/passwoord-manager-devices-users.component';
import { PasswoordManagerFiltersComponent } from './components/password-manager/passwoord-manager-header/passwoord-manager-filters/passwoord-manager-filters.component';
import { PasswordManagerEditLinkedComponent } from './components/password-manager/password-manager-edit-aside/password-manager-edit-linked/password-manager-edit-linked.component';
import { AfterViewInitDirective } from './directives/after-view-init.directive';
import { TicketsFilterTagsComponent } from './components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-tags/tickets-filter-tags.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { LeftPanelDocumentsComponent } from './components/left-panel/left-panel-documents/left-panel-documents.component';

// Import all Froala Editor plugins.
import 'froala-editor/js/plugins.pkgd.min.js';

// Import a single Froala Editor plugin.
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/code_view.min.js';

// Import a Froala Editor language file.
import 'froala-editor/js/languages/de.js';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/file.min.js';

// Import a third-party plugin.
import 'froala-editor/js/third_party/font_awesome.min';
import 'froala-editor/js/third_party/image_tui.min';
import 'froala-editor/js/third_party/spell_checker.min';
import 'froala-editor/js/third_party/embedly.min';
import { DocumentsAddComponent } from './components/documents/documents-add/documents-add.component';
import { DocumentsAddBodyComponent } from './components/documents/documents-add/documents-add-body/documents-add-body.component';
import { DocumentsAddHeaderComponent } from './components/documents/documents-add/documents-add-header/documents-add-header.component';
import { DocumentsAddFooterComponent } from './components/documents/documents-add/documents-add-footer/documents-add-footer.component';
import { DocumentsAddInfoComponent } from './components/documents/documents-add/documents-add-info/documents-add-info.component';
import { DocumentsAddEditCategoriesComponent } from './components/documents/documents-add/documents-add-info/documents-add-edit-categories/documents-add-edit-categories.component';
import { DocumentsTableComponent } from './components/documents/documents-table/documents-table.component';
import { DocumentsHeaderComponent } from './components/documents/documents-header/documents-header.component';
import { DocumentsFilterComponent } from './components/documents/documents-header/documents-filter/documents-filter.component';
import { DocumentsCategoryComponent } from './components/documents/documents-category/documents-category.component';
import { PasswordManagerLinkedComponent } from './components/password-manager/password-manager-add-aside/password-manager-linked/password-manager-linked.component';
import { DocumentsLinkedComponent } from './components/documents/documents-add/documents-add-info/documents-linked/documents-linked.component';
import { DocumentsTemplatesComponent } from './components/documents/documents-templates/documents-templates.component';
import { DocumentsEditComponent } from './components/documents/documents-edit/documents-edit.component';
import { DocumentsEditInfoComponent } from './components/documents/documents-edit/documents-edit-info/documents-edit-info.component';
import { DocumentsTemplatesHeaderComponent } from './components/documents/documents-templates/documents-templates-header/documents-templates-header.component';
import { DocumentsTemplatesFilterComponent } from './components/documents/documents-templates/documents-templates-header/documents-templates-filter/documents-templates-filter.component';
import { DocumentsTemplatesInfoComponent } from './components/documents/documents-templates/documents-templates-info/documents-templates-info.component';
import { DocumentsTemplatesItemComponent } from './components/documents/documents-templates/documents-templates-item/documents-templates-item.component';
import { DocumentsEditHistoryComponent } from './components/documents/documents-edit/documents-edit-history/documents-edit-history.component';
import { FindWithinDocumentComponent } from './components/documents/documents-edit/find-within-document/find-within-document.component';
import { DocumentPreviewComponent } from './components/documents/document-preview/document-preview.component';
import { CompanyDocumentsComponent } from './components/companies/company-documents/company-documents.component';
import { CompanyDocumentsTableComponent } from './components/companies/company-documents/company-documents-table/company-documents-table.component';
import { CompaniesFilterComponent } from './components/companies/companies-header/companies-filter/companies-filter.component';
import { CompanyAddAsideShortComponent } from './components/companies/company-add-aside/company-add-aside-short/company-add-aside-short.component';
import { CompanyAddAsideFullComponent } from './components/companies/company-add-aside/company-add-aside-full/company-add-aside-full.component';
import { CommonModule, HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { CompanyDeviceBetaComponent } from './components/company-device-beta/company-device-beta.component';
import { DeviceBeta } from './pipe/device-beta.pipe';


declare var $: any;
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
    PasswordManagerTableComponent,
    PasswoordManagerHeaderComponent,
    UserPipe,
    DateFormatPipe,
    PasswordManagerEditAsideComponent,
    DeviceUserPipe,
    PasswordCategoryPipe,
    SanitizeHtmlPipe,
    QuotesComponent,
    SelectClientCompanyComponent,
    ProductListComponent,
    ServicesListComponent,
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
    CompanyDashDetailComponent,
    CompanyDashStatsComponent,
    CompanyDashTicketComponent,
    CompanyDashRevenueComponent,
    CompanyDashInvoiceComponent,
    CompanyDashContractComponent,
    DraftEmailComponent,
    DraftEmailRecipientsComponent,
    SelectSearchComponent,
    CompanyPasswordManagerComponent,
    FilterPipe,
    ClickOtsideDirective,
    SortByPipe,
    UsersComponent,
    UsersHeaderComponent,
    UsersTableComponent,
    UsersAsideComponent,
    LeftPanelUsersComponent,
    UserTableSubscriptionComponent,
    UsersAsideEditComponent,
    ModalImageCropperComponent,
    DraftEmailUserRecipientsComponent,
    MyProfileComponent,
    SettingComponent,
    CompanyProfileComponent,
    ManageTagsComponent,
    TechUsersComponent,
    EmailSettingComponent,
    TaxesSettingsComponent,
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
    AutocompleteComponent,
    PhonePipe,
    OrderByPipe,
    ReportsComponent,
    ItemReportComponent,
    OverviewReportComponent,
    ReportMenuComponent,
    SelectComponent,
    ReportAdditionalActionsComponent,
    ReportSendEmailComponent,
    CompanyUserComponent,
    TicketsComponent,
    TicketsTableComponent,
    TicketsHeaderComponent,
    TicketAddAsideComponent,
    UploadAreaComponent,
    TicketEditAsideComponent,
    TicketsPrioritiesComponent,
    LeftPanelTicketsComponent,
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
    TaxesSettingsComponent,
    InventoryEditAsideComponent,
    LeftPanelInventoryComponent,
    AddCategoryProductComponent,
    CompanyProductsComponent,
    TaxesComponent,
    GlNumberSettingsComponent,
    TicketsTableItemComponent,
    TicketEditAsideCompanyInfoComponent,
    TicketEditAsideDevicesComponent,
    TicketEditAsideUsersComponent,
    TicketsStatusComponent,
    UploadAreaProgressComponent,
    DndDirective,
    AddAssignedUserComponent,
    TicketEditTagsComponent,
    TicketProfileActionsComponent,
    TicketClaimInfoComponent,
    TicketProfileFormUpdateComponent,
    TicketProfileFormUpdateProductsComponent,
    TicketProfileFormUpdateServicesComponent,
    TicketMessageComponent,
    TicketProfileUpdatesComponent,
    TicketProfileUpdatesNoteComponent,
    TicketProfileUpdatesProductComponent,
    TicketProfileUpdatesFooterComponent,
    TicketProfileUpdatesServiceComponent,
    TicketProfileUpdatesServiceDurationComponent,
    TicketProfileUpdatesServiceTimepickerComponent,
    TicketProfileUpdatesServiceInfoComponent,
    TicketProfileUpdatesServiceEditComponent,
    TicketProfileUpdatesServiceItemComponent,
    TicketProfileUpdatesProductItemComponent,
    TicketProfileUpdatesProductInfoComponent,
    TicketProfileUpdatesProductEditComponent,
    TicketChangeStatusComponent,
    PreloaderTicketComponent,
    TicketProfileAttachmentsComponent,
    PreviewAttachmentComponent,
    TicketProfileUpdatesNoteItemComponent,
    TicketProfileUpdatesNoteInfoComponent,
    TicketProfileUpdatesNoteEditComponent,
    ToFixedDirective,
    MapModalComponent,
    CompanyInfoHistoryComponent,
    TicketEditAsideRightPanelComponent,
    CompanyTicketsComponent,
    CompanyDashboardComponent,
    InventoryAddBodyComponent,
    ServicePipe,
    LeftPanelSettingsComponent,
    BillableComponent,
    BillableItemComponent,
    BillableAsideComponent,
    InvoiceFormComponent,
    BillableTicketsComponent,
    InvoiceFormEditCustomerComponent,
    InvoicePreviewComponent,
    InvoiceAddNoteComponent,
    InvoiceSelectNoteComponent,
    InvoiceRegularNoteComponent,
    TicketsFilterComponent,
    InvoiceFormTicketInfoComponent,
    InvoiceFormTicketEditComponent,
    InvoiceFormTicketEditServiceComponent,
    InvoiceFormTicketEditProductComponent,
    InvoiceFormTicketEditTaxesComponent,
    InvoiceDiscountComponent,
    ContractsComponent,
    CreateContractsComponent,
    ContractsHeaderComponent,
    ContractsTableComponent,
    ContractsAsideComponent,
    InvoicesComponent,
    InvoicesAsideComponent,
    InvoicesItemComponent,
    InvoicesHeaderComponent,
    InvoicesFilterComponent,
    InvoicesAsidePreviewComponent,
    DefaultServicesComponent,
    DefaultServicesAddComponent,
    DefaultServicesItemComponent,
    DefaultServicesContractsComponent,
    DefaultServicesEditComponent,
    PaymentsComponent,
    PaymentsHeaderComponent,
    PaymentItemComponent,
    PaymentsFilterComponent,
    PaymentsAsideComponent,
    RefundPaymentComponent,
    EditPaymentComponent,
    TechServiceReportComponent,
    AccountingReportComponent,
    ContractsTableItemComponent,
    ContractsAsideSelectTypeComponent,
    ContractsAsideHourlyBillingComponent,
    ContractsAsideBlockTimeBillingComponent,
    ContractsAsideUserDeviceBillingComponent,
    ContractsAsideProductServiceContractsComponent,
    ContractsFilterComponent,
    ContractsAsideTopComponent,
    ContractsAsideHourlyBillingDefaultServiceComponent,
    ContractsAsideHourlyBillingAddServiceComponent,
    DefaultServicesComponent,
    DefaultServicesAddComponent,
    DefaultServicesItemComponent,
    DefaultServicesContractsComponent,
    DefaultServicesEditComponent,
    DeviceComponent,
    NavComponent,
    DashboardComponent,
    HardwareComponent,
    SoftwareComponent,
    StartupComponent,
    ServicesComponent,
    AntivirusComponent,
    TerminalComponent,
    WindowsComponent,
    FileComponent,
    PasswordComponent,
    TicketTaskComponent,
    searchTextPipe,
    SoftwarePipe,
    DropDownComponent,
    ContractsAsideHourlyBillingPreviewComponent,
    ContractsPreviewComponent,
    ContractsEditComponent,
    ContractsAsideHourlyEditComponent,
    ContractsAsideBlockTimeBillingCustomerServiceComponent,
    DecimalNumberDirective,
    ContractsAsideBlockTimeBillingDefaultServiceComponent,
    ContractsAsideBlockTimeBillingAddDefaultServiceComponent,
    ContractsAsideHourlyBillingEditDefaultServiceComponent,
    ContractsAsideBlockTimeBillingUsersComponent,
    ContractsConfirmComponent,
    ContractsAsideEditHourlyAddDefaultServiceComponent,
    ContractsAsideBlockTimeBillingPreviewComponent,
    ContractsAsideBlockTimeEditComponent,
    ContractsAsideBlockTimeEditCustomerServiceComponent,
    ContractsAsideUserDeviceServiceComponent,
    ContractsAsideUserDeviceBillingPreviewComponent,
    ContractsAsideUserDeviceEditComponent,
    ContractsAsideOtherProductComponent,
    ContractsAsideOtherServiceComponent,
    ContractsAsideProductServicePreviewComponent,
    ContractsAsideProductServiceEditComponent,
    ContractsAsideOtherServiceEditComponent,
    DashboardBillingComponent,
    InvoiceRevenueComponent,
    MultiDatepickerDashboardComponent,
    ContractsDashboardComponent,
    TopDashboardComponent,
    TopProductDashboardComponent,
    DashboardStatsComponent,
    DashboardQuotesComponent,
    DashboardSalesAnalyticsComponent,
    CompanyContractsComponent,
    QuotesTableComponent,
    QuotesHeaderComponent,
    QuotesItemComponent,
    QuotesFilterComponent,
    QuoteAsidePreviewComponent,
    QuoteAsidePreviewBodyComponent,
    QuoteAsideAddComponent,
    QuoteAsideAddBodyComponent,
    ProductListQuoteComponent,
    ServiceListQuoteComponent,
    ProductItemQuoteComponent,
    QuoteAsideEditComponent,
    ProductItemQuoteEditComponent,
    QuoteAsideEditBodyComponent,
    ServiceItemQuoteComponent,
    TicketsDashboardComponent,
    RecurringTicketWidgetComponent,
    TicketsAnalyticsWidgetComponent,
    TicketPriorityWidgetComponent,
    TimeOnTicketsWidgetComponent,
    TicketsBillableHoursWidgetComponent,
    TechTicketsWidgetComponent,
    CompanyNetworkScanComponent,
    CompanyDevicesComponent,
    CompanyDevicesItemComponent,
    CompanyDevicesHeaderComponent,
    CompanyDevicesRemoteAccessComponent,
    CompanyDevicesEditNameComponent,
    CompanyDevicesAsideComponent,
    CompanyDevicesAsideDeviceIconComponent,
    CompanyDevicesAsideSystemComponent,
    CompanyDevicesAsideNetworkTabComponent,
    CompanyDevicesAsideSoftwareComponent,
    CompanyDevicesAsideUpdatesComponent,
    CompanyDevicesExistRemoteSessionsComponent,
    CompanyDevicesNoExistRemoteSessionsComponent,
    CompanyDevicesEditLabelComponent,
    CompanyDevicesAsideTooltipComponent,
    CompanyNetworkScanNoExistDevicesComponent,
    NetworkScanCredentialsAsideComponent,
    NetworkScanCredentialsAddComponent,
    NetworkScanCredentialsAsideItemComponent,
    CompanyNetworkScanItemComponent,
    CompanyNetworkScanItemTooltipComponent,
    LeftPanelCompanyComponent,
    UsersFilterComponent,
    SupportComponent,
    SupportItemComponent,
    DynamicTooltipComponent,
    TicketProfileFormUpdateSupportComponent,
    LeftPanelSupportComponent,
    HeaderComponent,
    GlobalSearchComponent,
    ReportListItemComponent,
    LeftPanelReportsComponent,
    BreadcrumbsComponent,
    DetailedCommissionsReportComponent,
    ToFixedPipe,
    CommonCommissionsReportComponent,
    SoftwareSummaryReportComponent,
    SoftwareSummaryDevicesDroDownComponent,
    HardwareSummaryReportComponent,
    DeviceIpSummaryReportComponent,
    RemoteConnectionReportComponent,
    TechSalesReportComponent,
    TechTicketReportComponent,
    ModalLockScreenComponent,
    ModalSessionScreenComponent,
    KeyUpEnterDirective,
    InventoryAddCategoryComponent,
    InventoryHeaderComponent,
    InventoryFilterComponent,
    PasswordManagerAddCategoryComponent,
    PasswordManagerAddAsideComponent,
    PasswoordManagerDevicesUsersComponent,
    PasswoordManagerFiltersComponent,
    PasswordManagerEditLinkedComponent,
    AfterViewInitDirective,
    TicketsFilterTagsComponent,
    DocumentsComponent,
    LeftPanelDocumentsComponent,
    DocumentsAddComponent,
    DocumentsAddBodyComponent,
    DocumentsAddHeaderComponent,
    DocumentsAddFooterComponent,
    DocumentsAddInfoComponent,
    DocumentsAddEditCategoriesComponent,
    DocumentsTableComponent,
    DocumentsHeaderComponent,
    DocumentsFilterComponent,
    DocumentsCategoryComponent,
    PasswordManagerLinkedComponent,
    DocumentsLinkedComponent,
    DocumentsTemplatesComponent,
    DocumentsEditComponent,
    DocumentsEditInfoComponent,
    DocumentsTemplatesHeaderComponent,
    DocumentsTemplatesFilterComponent,
    DocumentsTemplatesInfoComponent,
    DocumentsTemplatesItemComponent,
    DocumentsEditHistoryComponent,
    FindWithinDocumentComponent,
    DocumentPreviewComponent,
    CompanyDocumentsComponent,
    CompanyDocumentsTableComponent,
    CompaniesFilterComponent,
    CompanyAddAsideShortComponent,
    CompanyAddAsideFullComponent,
    HomeComponent,
    CompanyDeviceBetaComponent,
    DeviceBeta
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    UpgradeModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    InfiniteScrollModule,
    ClickOutsideModule,
    DataTablesModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    // ShowHidePasswordModule,
    AppRoutingModule,
    ImageCropperModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAbP4DFpz4f9YcXMWUjdkOdyArX2peNt8s'
    }),
    ToastrModule.forRoot({
      closeButton: true,
      preventDuplicates: true,
      timeOut: 5000
    }),
    ImageCropperModule,
    NvD3Module,
    BrowserAnimationsModule,
    IgxTimePickerModule,
    DisabledBtnModule,
    NgxUploaderModule,
    AngularEditorModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    NgxMaskModule.forRoot()
  ],
  entryComponents: [
    ModalQuoteComponent,
    ConfirmComponent,
    DownloadAgentComponent,
    ImageCropperComponent,
    AlertComponent,
    ReportSendEmailComponent,
    ContractsConfirmComponent,
    CompanyDevicesRemoteAccessComponent,
    ModalLockScreenComponent,
    ModalSessionScreenComponent
    // RecurringTicketsComponent
  ],
  exports: [
    PhonePipe,
    OrderByPipe,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    PermissionDasnboardBillingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
