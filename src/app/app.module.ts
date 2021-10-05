import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NgZone } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import {
  UpgradeModule,
} from '@angular/upgrade/static';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { DeviceModule } from './components/device/device-root.module';
import { HeaderModule } from './components/header/header.module';
import { BreadcrumbsModule } from './components/shared/breadcrumbs/breadcrumbs.module';

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
    ReportSendEmailComponent,
    ContractsConfirmComponent,
    CompanyDevicesRemoteAccessComponent,
    ModalLockScreenComponent,
    ModalSessionScreenComponent,
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
      timeOut: 5000
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
    DeviceModule,
    HeaderModule,
    BreadcrumbsModule,
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
    ModalSessionScreenComponent,
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    PermissionDasnboardBillingService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
