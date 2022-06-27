import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NgZone } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import {
  UpgradeModule,
} from '@angular/upgrade/static';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatIconModule } from '@angular/material';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { ModalQuoteComponent } from './services/modal/modal-quote/modal-quote.component';
import { AlertComponent } from './components/shared/alert/alert.component';
import { ConfirmComponent } from './components/shared/confirm/confirm.component';
import { DownloadAgentComponent } from './components/companies/download-agent/download-agent.component';
import { ImageCropperComponent } from './components/shared/image-cropper/image-cropper.component';
import { ReportSendEmailComponent } from './components/reports/report-additional-actions/report-send-email/report-send-email.component';
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
import { TicketEditAsideModule } from './components/tickets/tickets/ticket-edit-aside/ticket-edit-aside.module';
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
import { DefaultServicesAddModule } from './components/billing/default-services/default-services-add/default-services-add.module';
import { DefaultServicesEditModule } from './components/billing/default-services/default-services-edit/default-services-edit.module';
import { HeaderModule } from './components/header/header.module';
import { BreadcrumbsModule } from './components/shared/breadcrumbs/breadcrumbs.module';
import { PermissionAccountingSettingsService } from './components/setting/accounting/permission-accounting-settings.service';
import { PermissionCrmSettingsService } from './components/setting/crm-settings/permission-crm-settings.service';
import { PermissionEmailSettingService } from './components/setting/email-setting/permission-email-setting.service';
import { PermissionEmailTempleteService } from './components/setting/email-templete/permission-email-templete.service';
import { PermissionManageTagsService } from './components/setting/manage-tags/permission-manage-tags.service';
import { PermissionProductsSettingsService } from './components/setting/products-settings/permission-products-settings.service';
import { PermissionTaxesSettingsService } from './components/setting/taxes/permission-taxes-settings.service';
import { PermissionsTechUsersService } from './components/setting/tech-users/permissions-tech-users.service';
import { PermissionTicketSettingsService } from './components/setting/ticket-settings-page/permission-ticket-settings.service';
import { ModalAddUpdateTicketComponent } from './services/modal/modal-add-update-ticket/modal-add-update-ticket.component';
import { ModalAddUsersNotifyComponent } from './services/modal/modal-add-users-notify/modal-add-users-notify.component';
import { ModalAgentLinkComponent } from './services/modal/modal-agent-link/modal-agent-link.component';
import { ModalEditCategoryProductComponent } from './services/modal/modal-edit-category-product/modal-edit-category-product.component';
import { UsersAsideDetailModule } from './components/users/users-aside-detail/users-aside-detail.module';
import { TextAreaModule } from './directives/text-area/text-area.module';
import { AddMarketingSubscriptionTypeModule } from './components/setting/marketing-email/marketing-subscription-type/add-marketing-subscription-type/add-marketing-subscription-type.module';
import { AddUserToSubscribeModule } from './components/users/add-user-to-subscribe/add-user-to-subscribe.module';
import { PermissionInvoicesService } from './components/billing/invoices/permission-invoices.service';
import { PermissionBillableService } from './components/billing/billable/permission-billable.service';
import { PreviewAttachmentModule } from './components/tickets/tickets/ticket-edit-aside/preview-attachment/preview-attachment.module';
import { PermissionContractsService } from './components/billing/contracts/permission-contracts.service';
import { PermissionCompanyService } from './components/companies/permission-company.service';
import { PermissionPasswordManagerService } from './components/password-manager/permission-password-manager.service';
import { PermissionReportsService } from './components/reports/permission-reports.service';
import { PermissionSupportService } from './components/support/permission-support.service';
import { PermissionUsersService } from './components/users/permission-users.service';

import { SupportPageComponent } from './components/super-admin/support-page/support-page.component';
import { LeftPanelSuperAdminComponent } from './components/super-admin/left-panel-super-admin/left-panel-super-admin.component';
import { PermissionTechUserService } from './services/users/permission-tech-user.service';
import { PermissionSuperAdminService } from './services/users/permission-super-admin.service';
import { LeftPanelSuperAdminCategoriesComponent } from './components/super-admin/left-panel-super-admin-categories/left-panel-super-admin-categories.component';
import { SupportPageAddCategoryComponent } from './components/super-admin/shared/support-page-add-category/support-page-add-category.component';
import { SupportPageAddSubCategoryComponent } from './components/super-admin/shared/support-page-add-sub-category/support-page-add-sub-category.component';
import { SupportPageEditCategoryComponent } from './components/super-admin/shared/support-page-edit-category/support-page-edit-category.component';
import { LeftPanelSuperAdminCategoriesActionsComponent } from './components/super-admin/left-panel-super-admin-categories/left-panel-super-admin-categories-actions/left-panel-super-admin-categories-actions.component';
import { SupportPageBreadcrumbsComponent } from './components/super-admin/support-page/support-page-breadcrumbs/support-page-breadcrumbs.component';
import { SupportPageHeaderComponent } from './components/super-admin/support-page/support-page-header/support-page-header.component';
import { SupportPageBodyComponent } from './components/super-admin/support-page/support-page-body/support-page-body.component';
import { SupportPageInfoComponent } from './components/super-admin/support-page/support-page-info/support-page-info.component';
import { SupportPageInfoTagsComponent } from './components/super-admin/support-page/support-page-info/support-page-info-tags/support-page-info-tags.component';
import { SuperAdminPublicComponent } from './components/super-admin-public/super-admin-public.component';
import { HelpCenterInfoAsideComponent } from './components/super-admin-public/help-center-info-aside/help-center-info-aside.component';
import { SuperAdminPublicDetailComponent } from './components/super-admin-public/super-admin-public-detail/super-admin-public-detail.component';
import { SuperAdminPublicSearchComponent } from './components/super-admin-public/super-admin-public-search/super-admin-public-search.component';
import { SupportPageHelpCenterComponent } from './components/super-admin/support-page/support-page-help-center/support-page-help-center.component';
import { SupportPageCategoryComponent } from './components/super-admin/support-page/support-page-category/support-page-category.component';
import { SuperAdminPublicCategoryComponent } from './components/super-admin-public/super-admin-public-category/super-admin-public-category.component';
import { SuperAdminPublicHeaderComponent } from './components/super-admin-public/super-admin-public-header/super-admin-public-header.component';
import { SortTagsPipe } from './components/super-admin/support-page/support-page-info/support-page-info-tags/pipe/sort-tags.pipe';
import { InventoryCheckUseComponent } from './components/inventory/inventory-check-use/inventory-check-use.component';
import { ContractsReviewComponent } from './components/billing/contracts/contracts-review/contracts-review.component';
import { PaymentsReportComponent } from './components/reports/reports/payments-report/payments-report.component';
import { AddUserToSubscribeComponent } from './components/users/add-user-to-subscribe/add-user-to-subscribe.component';
import { SupportPageAddCategoryModule } from './components/super-admin/shared/support-page-add-category/support-page-add-category.module';
import { LeftPanelSuperAdminModule } from './components/super-admin/left-panel-super-admin/left-panel-super-admin.module';
import { SupportPageAddSubCategoryModule } from './components/super-admin/shared/support-page-add-sub-category/support-page-add-sub-category.module';
import { PreviewPhoneMaskComponent } from './components/shared/preview-phone-mask/preview-phone-mask.component';
import { DocumentsEditCategoryComponent } from './components/documents/documents-edit-category/documents-edit-category.component';
import { DocumentsEditCategoryItemComponent } from './components/documents/documents-edit-category/documents-edit-category-item/documents-edit-category-item.component';
import { GoogleAuthenticatorComponent } from './components/shared/google-authenticator/google-authenticator.component';
import { GoogleAuthenticatorScratchesComponent } from './components/shared/google-authenticator-scratches/google-authenticator-scratches.component';


declare var $: any;

/**
 * This module represents the main application module
 */

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ModalQuoteComponent,
    AlertComponent,
    ConfirmComponent,
    DownloadAgentComponent,
    ImageCropperComponent,
    //  ReportSendEmailComponent,
    ContractsConfirmComponent,
    CompanyDevicesRemoteAccessComponent,
    ModalLockScreenComponent,
    ModalSessionScreenComponent,
    ModalAddUpdateTicketComponent,
    ModalAgentLinkComponent,
    ModalAddUsersNotifyComponent,
    ModalEditCategoryProductComponent,
    // SupportPageEditCategoryComponent,
    // LeftPanelSuperAdminComponent,
    // SupportPageAddCategoryComponent,
    // LeftPanelSuperAdminCategoriesActionsComponent,
    // SupportPageAddSubCategoryComponent,
    HelpCenterInfoAsideComponent,
    InventoryCheckUseComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    UpgradeModule,
    HttpClientModule,
    FormsModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    AppRoutingModule,
    ToastrModule.forRoot({
      closeButton: true,
      preventDuplicates: true,
      timeOut: 5000,
      onActivateTick: true
    }),
    BrowserAnimationsModule,
    AngularEditorModule,
    TicketEditAsideModule,
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
    DefaultServicesAddModule,
    DefaultServicesEditModule,
    HeaderModule,
    BreadcrumbsModule,
    UsersAsideDetailModule,
    TextAreaModule,
    AddMarketingSubscriptionTypeModule,
    AddUserToSubscribeModule,
    PreviewAttachmentModule,
    SupportPageAddCategoryModule,
    LeftPanelSuperAdminModule,
    SupportPageAddSubCategoryModule
  ],
  entryComponents: [
    ModalQuoteComponent,
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
    AddUserToSubscribeComponent,
    // SupportPageAddCategoryComponent,
    //  SupportPageAddSubCategoryComponent,
    // SupportPageEditCategoryComponent,
    InventoryCheckUseComponent,
    GoogleAuthenticatorComponent,
    GoogleAuthenticatorScratchesComponent
    // RecurringTicketsComponent
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
    PermissionTaxesSettingsService,
    PermissionTicketSettingsService,
    PermissionEmailTempleteService,
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
    PermissionSuperAdminService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
