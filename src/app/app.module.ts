import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { ModalQuoteComponent } from './services/modal/modal-quote/modal-quote.component';
import { AlertComponent } from './components/shared/alert/alert.component';
import { ConfirmComponent } from './components/shared/confirm/confirm.component';
import { DownloadAgentComponent } from './components/companies/download-agent/download-agent.component';
import { ImageCropperComponent } from './components/shared/image-cropper/image-cropper.component';
/**
* declare angular
*/
declare var angular: any;
import { ToastrModule } from 'ngx-toastr';
import { ContractsConfirmComponent } from './components/billing/contracts/contracts-confirm/contracts-confirm.component';
import 'd3';
import 'nvd3';
import { PermissionDasnboardBillingService } from './services/dashboard-billing/permission-dasnboard-billing.service';
import { CompanyDevicesRemoteAccessComponent } from './components/company-devices/company-devices-remote-access/company-devices-remote-access.component';
import { ModalLockScreenComponent } from './services/modal/modal-lock-screen/modal-lock-screen.component';
import { HttpInterceptorService } from './services/http/http-interceptor.service';
import { ModalSessionScreenComponent } from './services/modal/modal-session-screen/modal-session-screen.component';

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
import { CommonModule } from '@angular/common';
import { LeftPanelModule } from './components/left-panel/left-panel.module';
import { CompanyAddAsideModule } from './components/companies/company-add-aside/company-add-aside.module';
import { DraftEmailModule } from './components/shared/draft-email/draft-email.module';
import { DraftEmailUserRecipientsModule } from './components/shared/draft-email/draft-email-user-recipients/draft-email-user-recipients.module';
import { UsersAsideModule } from './components/users/users-aside/users-aside.module';
import { UsersAsideEditModule } from './components/users/users-aside-edit/users-aside-edit.module';
import { TicketAddAsideModule } from './components/tickets/tickets/ticket-add-aside/ticket-add-aside.module';
import { ModalImageCropperModule } from './services/modal/modal-image-cropper/modal-image-cropper.module';
import { InventoryAddAsideModule } from './components/inventory/inventory-add-aside/inventory-add-aside.module';
import { InventoryEditAsideModule } from './components/inventory/inventory-edit-aside/inventory-edit-aside.module';
import { InvoicesAsideModule } from './components/billing/invoices/invoices-aside/invoices-aside.module';
import { MapModalModule } from './components/shared/map-modal/map-modal.module';
import { InvoicesAsidePreviewModule } from './components/billing/invoices/invoices-aside-preview/invoices-aside-preview.module';
import { NonContractServicesAddModule } from './components/billing/non-contract-services/non-contract-services-add/non-contract-services-add.module';
import { NonContractServicesEditModule } from './components/billing/non-contract-services/non-contract-services-edit/non-contract-services-edit.module';
import { HeaderModule } from './components/header/header.module';
import { BreadcrumbsModule } from './components/shared/breadcrumbs/breadcrumbs.module';
import { PermissionAccountingSettingsService } from './components/setting/accounting/permission-accounting-settings.service';
import { PermissionCrmSettingsService } from './components/setting/crm-settings/permission-crm-settings.service';
import { PermissionEmailSettingService } from './components/setting/email-setting/permission-email-setting.service';
import { PermissionEmailTemplateService } from './components/setting/email-template/permission-email-template.service';
import { PermissionManageTagsService } from './components/setting/manage-tags/permission-manage-tags.service';
import { PermissionProductsSettingsService } from './components/setting/products-settings/permission-products-settings.service';
import { PermissionsTechUsersService } from './components/setting/tech-users-settings/permissions-tech-users.service';
import { PermissionTicketSettingsService } from './components/setting/ticket-settings-page/permission-ticket-settings.service';
import { ModalAddUpdateTicketComponent } from './services/modal/modal-add-update-ticket/modal-add-update-ticket.component';
import { ModalAddUsersNotifyComponent } from './services/modal/modal-add-users-notify/modal-add-users-notify.component';
import { ModalAgentLinkComponent } from './services/modal/modal-agent-link/modal-agent-link.component';
import { ModalEditCategoryProductComponent } from './services/modal/modal-edit-category-product/modal-edit-category-product.component';
import { TextAreaModule } from './directives/text-area/text-area.module';
import { AddMarketingSubscriptionTypeModule } from './components/setting/marketing-email/marketing-subscription-type/add-marketing-subscription-type/add-marketing-subscription-type.module';
import { PermissionInvoicesService } from './components/billing/invoices/permission-invoices.service';
import { PermissionBillableService } from './components/billing/billable/permission-billable.service';
import { PreviewAttachmentModule } from './components/tickets/tickets/ticket-edit-aside/preview-attachment/preview-attachment.module';
import { PermissionContractsService } from './components/billing/contracts/permission-contracts.service';
import { PermissionCompanyService } from './components/companies/permission-company.service';
import { PermissionPasswordManagerService } from './components/password-manager/permission-password-manager.service';
import { PermissionReportsService } from './components/reports/permission-reports.service';
import { PermissionSupportService } from './components/support/permission-support.service';
import { PermissionUsersService } from './components/users/permission-users.service';

import { PermissionTechUserService } from './services/users/permission-tech-user.service';
import { PermissionSuperAdminService } from './services/users/permission-super-admin.service';
import { HelpCenterInfoAsideComponent } from './components/super-admin-public/help-center-info-aside/help-center-info-aside.component';
import { InventoryCheckUseComponent } from './components/inventory/inventory-check-use/inventory-check-use.component';
import { SupportPageAddCategoryModule } from './components/super-admin/shared/support-page-add-category/support-page-add-category.module';
import { LeftPanelSuperAdminModule } from './components/super-admin/left-panel-super-admin/left-panel-super-admin.module';
import { SupportPageAddSubCategoryModule } from './components/super-admin/shared/support-page-add-sub-category/support-page-add-sub-category.module';
import { GoogleAuthenticatorScratchesComponent } from './components/shared/google-authenticator-scratches/google-authenticator-scratches.component';
import { GlNumberCheckUseComponent } from './components/setting/accounting/gl-number/gl-number-check-use/gl-number-check-use.component';
import { CannedResponsesAsideComponent } from './components/setting/ticket-settings-page/canned-responses/canned-responses-aside/canned-responses-aside.component';
import { ReportSendEmailModule } from './components/reports/report-additional-actions/report-send-email/report-send-email.module';
import { GoogleAuthenticatorModule } from './components/shared/google-authenticator/google-authenticator.module';
import { SupportPageEditCategoryModule } from './components/super-admin/shared/support-page-edit-category/support-page-edit-category.module';
import { TestPermissionService } from './services/test-permission/test-permission.service';
import { ModalQuoteModule } from './services/modal/modal-quote/modal-quote.module';
import { PermissionPaymentsService } from './components/billing/payments/permission-payments.service';
import { PermissionQuotesService } from './components/billing/quotes/permission-quotes.service';
import { PermissionTicketsService } from './components/tickets/tickets/permission-tickets.service';
import { PermissionCompanyDevicesService } from './components/company-devices/permission-company-devices.service';
import { PermissionNoSuperAdminService } from './services/users/permission-no-super-admin.service';
import { PermissionClientUserService } from './services/users/permission-client-user.service';
import { UsersCheckUseComponent } from './components/users/users-check-use/users-check-use.component';
import { PermissionMyProfileService } from './components/setting/my-profile/permission-my-profile.service';
import { TicketsFilterSaveComponent } from './components/tickets/tickets/tickets-header/tickets-filter-save/tickets-filter-save.component';
import { ContractsStatisticsComponent } from './components/billing/contracts-statistics/contracts-statistics.component';
import { ContractsStatisticsTableComponent } from './components/billing/contracts-statistics/contracts-statistics-table/contracts-statistics-table.component';
import { ContractsStatisticsTableItemComponent } from './components/billing/contracts-statistics/contracts-statistics-table/contracts-statistics-table-item/contracts-statistics-table-item.component';
import { SuperAdminCompaniesComponent } from './components/super-admin/super-admin-companies/super-admin-companies.component';
import { SuperAdminCompaniesHeaderComponent } from './components/super-admin/super-admin-companies/super-admin-companies-header/super-admin-companies-header.component';
import { SuperAdminCompaniesItemComponent } from './components/super-admin/super-admin-companies/super-admin-companies-item/super-admin-companies-item.component';
import { AddUserToCompanyModule } from './components/users/add-user-to-company/add-user-to-company.module';
import { UserFilterSaveModule } from './components/users/user-filter-save/user-filter-save.module';
import { TicketsHeaderModule } from './components/tickets/tickets/tickets-header/tickets-header.module';
import { TicketsFilterSaveModule } from './components/tickets/tickets/tickets-header/tickets-filter-save/tickets-filter-save.module';
import { DeviceTagPipe } from './pipe/device-tag.pipe';
import { MarketingSubscriptionsAsideModule } from './components/marketing/marketing-subscriptions-aside/marketing-subscriptions-aside.module';
import { ManufacturesCheckUseComponent } from './components/setting/device-setting/manufactures-check-use/manufactures-check-use.component';
import { UserDeArchiveNotificationComponent } from './components/users/user-de-archive-notification/user-de-archive-notification.component';
import { SuperAdminKnowledgeBaseComponent } from './components/super-admin/super-admin-knowledge-base/super-admin-knowledge-base.component';
import { SuperAdminKnowledgeBaseTableComponent } from './components/super-admin/super-admin-knowledge-base/super-admin-knowledge-base-table/super-admin-knowledge-base-table.component';
import { SuperAdminKnowledgeBaseTableItemComponent } from './components/super-admin/super-admin-knowledge-base/super-admin-knowledge-base-table/super-admin-knowledge-base-table-item/super-admin-knowledge-base-table-item.component';
import { SuperAdminKnowledgeBaseService } from './components/super-admin/services/super-admin-knowledge-base/super-admin-knowledge-base.service';
import { SuperAdminPublicListComponent } from './components/super-admin-public/super-admin-public-list/super-admin-public-list.component';
import { SuperAdminPublicListModule } from './components/super-admin-public/super-admin-public-list/super-admin-public-list.module';
import { ProductTypeCheckUseComponent } from './components/setting/products-settings/product-type-check-use/product-type-check-use.component';
import { ProductTypeCheckUseModule } from './components/setting/products-settings/product-type-check-use/product-type-check-use.module';
import { MatChipComponent } from './components/shared/mat-chip/mat-chip.component';
import { MatChipTagComponent } from './components/shared/mat-chip-tag/mat-chip-tag.component';
import { MatFormFieldComponent } from './components/shared/mat-form-field/mat-form-field.component';
import { MatChipListComponent } from './components/shared/mat-chip-list/mat-chip-list.component';
import { MatErrorComponent } from './components/shared/mat-error/mat-error.component';
import { MatOptionComponent } from './components/shared/mat-option/mat-option.component';
import { MatErrorModule } from './components/shared/mat-error/mat-error.module';
import { MatChipListModule } from './components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from './components/shared/mat-chip/mat-chip.module';
import { FileManagerComponent } from './components/file-manager/file-manager.component';
import { FileManagementAddFileModule } from './components/file-manager/file-manager-add-file/file-manager-add-file.module';
import { PreviewFileComponent } from './components/shared/preview-file/preview-file.component';
import { UsersDropDownComponent } from './components/shared/users-drop-down/users-drop-down.component';
import { MultiCompanyDropDownComponent } from './components/shared/multi-company-drop-down/multi-company-drop-down.component';
import { UsersDetailsComponent } from './components/users-details/users-details.component';
import { UsersDetailsHeaderComponent } from './components/users-details/users-details-header/users-details-header.component';
import { UsersDetailsLeftPanelComponent } from './components/users-details/users-details-left-panel/users-details-left-panel.component';
import { SubscriptionServicesComponent } from './components/billing/subscription-services/subscription-services.component';
import { SubscriptionServicesCheckUseComponent } from './components/billing/subscription-services/subscription-services-check-use/subscription-services-check-use.component';
import { SubscriptionServicesConfirmComponent } from './components/billing/subscription-services/subscription-services-confirm/subscription-services-confirm.component';
import { TicketDetailNoteModalModule } from './components/tickets/tickets/ticket-detail/ticket-detail-note-modal/ticket-detail-note-modal.module';
import { DeviceSettingTypeCheckUseComponent } from './components/setting/device-setting/device-setting-type/device-setting-type-check-use/device-setting-type-check-use.component';
import { CompanyDevicesAssestTypeDropDownModule } from './components/company-devices/company-devices-custom-aside/company-devices-assest-type-drop-down/company-devices-assest-type-drop-down.module';
import { CannedResponsesAsideModule } from './components/setting/ticket-settings-page/canned-responses/canned-responses-aside/canned-responses-aside.module';
declare var $: any;
/**
 * This module represents the main application module
 */

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AlertComponent,
    ConfirmComponent,
    DownloadAgentComponent,
    ImageCropperComponent,
    ContractsConfirmComponent,
    CompanyDevicesRemoteAccessComponent,
    ModalLockScreenComponent,
    ModalSessionScreenComponent,
    ModalAddUpdateTicketComponent,
    ModalAgentLinkComponent,
    ModalAddUsersNotifyComponent,
    ModalEditCategoryProductComponent,
    HelpCenterInfoAsideComponent,
    InventoryCheckUseComponent,
    UsersCheckUseComponent,
    GoogleAuthenticatorScratchesComponent,
    GlNumberCheckUseComponent,
    ManufacturesCheckUseComponent,
    UserDeArchiveNotificationComponent,
    PreviewFileComponent,
    SubscriptionServicesCheckUseComponent,
    SubscriptionServicesConfirmComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    AppRoutingModule,
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 5000,
      onActivateTick: true
    }),
    AngularEditorModule,
    LeftPanelModule,
    CompanyAddAsideModule,
    DraftEmailModule,
    DraftEmailUserRecipientsModule,
    UsersAsideModule,
    UsersAsideEditModule,
    TicketAddAsideModule,
    ModalImageCropperModule,
    InventoryAddAsideModule,
    InventoryEditAsideModule,
    InvoicesAsideModule,
    MapModalModule,
    InvoicesAsidePreviewModule,
    NonContractServicesAddModule,
    NonContractServicesEditModule,
    HeaderModule,
    BreadcrumbsModule,
    TextAreaModule,
    AddMarketingSubscriptionTypeModule,
    PreviewAttachmentModule,
    SupportPageAddCategoryModule,
    LeftPanelSuperAdminModule,
    SupportPageAddSubCategoryModule,
    ReportSendEmailModule,
    GoogleAuthenticatorModule,
    SupportPageEditCategoryModule,
    ModalQuoteModule,
    AddUserToCompanyModule,
    UserFilterSaveModule,
    TicketsFilterSaveModule,
    MarketingSubscriptionsAsideModule,
    SuperAdminPublicListModule,
    ProductTypeCheckUseModule,
    MatErrorModule,
    MatChipListModule,
    MatChipModule,
    FileManagementAddFileModule,
    TicketDetailNoteModalModule,
    CompanyDevicesAssestTypeDropDownModule,
    CannedResponsesAsideModule
  ],
  entryComponents: [
    ConfirmComponent,
    DownloadAgentComponent,
    ImageCropperComponent,
    AlertComponent,
    ContractsConfirmComponent,
    CompanyDevicesRemoteAccessComponent,
    ModalLockScreenComponent,
    ModalSessionScreenComponent,
    ModalAddUpdateTicketComponent,
    ModalAgentLinkComponent,
    ModalAddUsersNotifyComponent,
    ModalEditCategoryProductComponent,
    InventoryCheckUseComponent,
    UserDeArchiveNotificationComponent,
    GoogleAuthenticatorScratchesComponent,
    GlNumberCheckUseComponent,
    UsersCheckUseComponent,
    ManufacturesCheckUseComponent,
    SubscriptionServicesCheckUseComponent,
    SubscriptionServicesConfirmComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    PermissionDasnboardBillingService,
    PermissionManageTagsService,
    PermissionProductsSettingsService,
    PermissionsTechUsersService,
    PermissionEmailSettingService,
    PermissionTicketSettingsService,
    PermissionEmailTemplateService,
    PermissionAccountingSettingsService,
    PermissionCrmSettingsService,
    PermissionContractsService,
    PermissionCompanyService,
    PermissionBillableService,
    PermissionInvoicesService,
    PermissionUsersService,
    PermissionPasswordManagerService,
    PermissionSupportService,
    PermissionReportsService,
    PermissionTechUserService,
    PermissionSuperAdminService,
    TestPermissionService,
    PermissionPaymentsService,
    PermissionQuotesService,
    PermissionTicketsService,
    PermissionCompanyDevicesService,
    PermissionNoSuperAdminService,
    PermissionClientUserService,
    PermissionMyProfileService,
    SuperAdminKnowledgeBaseService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {

}
