import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketDetailComponent } from './ticket-detail.component';
import { TicketDetailRoutingModule } from './ticket-detail-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxMaskModule } from 'ngx-mask';
import { InvoiceFormTicketEditTaxesModule } from 'src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { ProductListModule } from 'src/app/components/shared/product-list/product-list.module';
import { ServicesListModule } from 'src/app/components/shared/services-list/services-list.module';
import { TechUsersModule } from 'src/app/components/shared/tech-users/tech-users.module';
import { UploadAreaProgressModule } from 'src/app/components/shared/upload-area/upload-area-progress/upload-area-progress.module';
import { ClickOtsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { PhoneModule } from 'src/app/pipe/phone/phone.module';
import { PreparePhoneModule } from 'src/app/pipe/prepare-phone/prepare-phone.module';
import { TicketProfileAttachmentsModule } from '../ticket-edit-aside/ticket-profile-attachments/ticket-profile-attachments.module';
import { TicketProfileUpdatesServiceDurationModule } from '../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-duration/ticket-profile-updates-service-duration.module';
import { TicketProfileUpdatesServiceTimepickerModule } from '../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.module';
import { TicketChangeStatusModule } from '../ticket-edit-aside/ticket-change-status/ticket-change-status.module';
import { TicketDetailProfileUpdatesComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates.component';
import { TicketDetailProfileUpdatesNoteComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-note/ticket-detail-profile-updates-note.component';
import { TicketDetailProfileUpdatesNoteItemComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-note/ticket-detail-profile-updates-note-item/ticket-detail-profile-updates-note-item.component';
import { TicketDetailProfileUpdatesNoteInfoComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-note/ticket-detail-profile-updates-note-info/ticket-detail-profile-updates-note-info.component';
import { TicketDetailProfileUpdatesNoteEditComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-note/ticket-detail-profile-updates-note-edit/ticket-detail-profile-updates-note-edit.component';
import { TicketDetailProfileUpdatesHeaderInfoComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-header-info/ticket-detail-profile-updates-header-info.component';
import { TicketDetailProfileUpdatesProductComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-product/ticket-detail-profile-updates-product.component';
import { TicketDetailProfileUpdatesProductItemComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-product/ticket-detail-profile-updates-product-item/ticket-detail-profile-updates-product-item.component';
import { TicketDetailProfileUpdatesProductInfoComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-product/ticket-detail-profile-updates-product-info/ticket-detail-profile-updates-product-info.component';
import { TicketDetailProfileUpdatesProductEditComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-product/ticket-detail-profile-updates-product-edit/ticket-detail-profile-updates-product-edit.component';
import { TicketDetailProfileUpdatesProductHeaderInfoComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-product/ticket-detail-profile-updates-product-header-info/ticket-detail-profile-updates-product-header-info.component';
import { TicketDetailProfileUpdatesServiceComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-service/ticket-detail-profile-updates-service.component';
import { TicketDetailProfileUpdatesServiceItemComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-service/ticket-detail-profile-updates-service-item/ticket-detail-profile-updates-service-item.component';
import { TicketDetailProfileUpdatesServiceInfoComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-service/ticket-detail-profile-updates-service-info/ticket-detail-profile-updates-service-info.component';
import { TicketDetailProfileUpdatesServiceHeaderInfoComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates-service/ticket-detail-profile-updates-service-header-info/ticket-detail-profile-updates-service-header-info.component';
import { TicketDetailTasksComponent } from './ticket-detail-tasks/ticket-detail-tasks.component';
import { TicketDetailHeaderComponent } from './ticket-detail-header/ticket-detail-header.component';
import { TicketDetailProfileFormUpdateComponent } from './ticket-detail-profile-form-update/ticket-detail-profile-form-update.component';
import { AddAssignedUserModule } from '../ticket-edit-aside/add-assigned-user/add-assigned-user.module';
import { TicketDetailProfileFormUpdateVisibleUsersComponent } from './ticket-detail-profile-form-update/ticket-detail-profile-form-update-visible-users/ticket-detail-profile-form-update-visible-users.component';
import { TicketProfileFormUpdateNoteListModule } from '../ticket-edit-aside/ticket-profile-form-update/ticket-profile-form-update-note-list/ticket-profile-form-update-note-list.module';
import { TicketDetailProfileFormUpdateNoteComponent } from './ticket-detail-profile-form-update/ticket-detail-profile-form-update-note/ticket-detail-profile-form-update-note.component';
import { TicketDetailProfileFormUpdateServicesComponent } from './ticket-detail-profile-form-update/ticket-detail-profile-form-update-services/ticket-detail-profile-form-update-services.component';
import { TicketDetailProfileFormUpdateHeaderComponent } from './ticket-detail-profile-form-update/ticket-detail-profile-form-update-header/ticket-detail-profile-form-update-header.component';
import { TicketDetailProfileFormUpdateProductsComponent } from './ticket-detail-profile-form-update/ticket-detail-profile-form-update-products/ticket-detail-profile-form-update-products.component';
import { TicketDetailProfileFormUpdateSupportComponent } from './ticket-detail-profile-form-update/ticket-detail-profile-form-update-support/ticket-detail-profile-form-update-support.component';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { TicketDetailClaimInfoComponent } from './ticket-detail-claim-info/ticket-detail-claim-info.component';
import { TicketDetailInfoStatusComponent } from './ticket-detail-info-status/ticket-detail-info-status.component';
import { TicketDetailChangeStatusComponent } from './ticket-detail-change-status/ticket-detail-change-status.component';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { TicketDetailChangePriorityComponent } from './ticket-detail-change-priority/ticket-detail-change-priority.component';
import { TicketDetailChangeCompanyComponent } from './ticket-detail-change-company/ticket-detail-change-company.component';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { TicketDetailAddAssignedUserComponent } from './ticket-detail-add-assigned-user/ticket-detail-add-assigned-user.component';
import { TicketDetailEditTagsComponent } from './ticket-detail-edit-tags/ticket-detail-edit-tags.component';
import { TicketDetailAttachmentsComponent } from './ticket-detail-attachments/ticket-detail-attachments.component';
import { TicketDetailLinkedAgentsComponent } from './ticket-detail-linked-agents/ticket-detail-linked-agents.component';
import { TicketDetailProfileEditUpdatesComponent } from './ticket-detail-profile-edit-updates/ticket-detail-profile-edit-updates.component';
import { TicketDetailProfileEditUpdatesHeaderComponent } from './ticket-detail-profile-edit-updates/ticket-detail-profile-edit-updates-header/ticket-detail-profile-edit-updates-header.component';
import { TicketDetailProfileEditUpdatesServicesComponent } from './ticket-detail-profile-edit-updates/ticket-detail-profile-edit-updates-services/ticket-detail-profile-edit-updates-services.component';
import { TicketDetailProfileEditUpdatesProductsComponent } from './ticket-detail-profile-edit-updates/ticket-detail-profile-edit-updates-products/ticket-detail-profile-edit-updates-products.component';
import { TicketDetailMessageComponent } from './ticket-detail-message/ticket-detail-message.component';
import { TicketDetailContactComponent } from './ticket-detail-contact/ticket-detail-contact.component';
import { TicketDetailPasswordsComponent } from './ticket-detail-passwords/ticket-detail-passwords.component';
import { TicketDetailDevicesComponent } from './ticket-detail-devices/ticket-detail-devices.component';
import { TicketDetailDocumentsComponent } from './ticket-detail-documents/ticket-detail-documents.component';
import { TicketDetailContactDetailsComponent } from './ticket-detail-contact-details/ticket-detail-contact-details.component';
import { CompanyInfoHistoryModule } from '../ticket-edit-aside-company-info/company-info-history/company-info-history.module';
import { TicketDetailContactDetailsHistoryComponent } from './ticket-detail-contact-details/ticket-detail-contact-details-history/ticket-detail-contact-details-history.component';
import { TicketDetailDocumentsPreviewComponent } from './ticket-detail-documents/ticket-detail-documents-preview/ticket-detail-documents-preview.component';
import { TicketDetailDocumentsDetailsComponent } from './ticket-detail-documents/ticket-detail-documents-details/ticket-detail-documents-details.component';
import { TicketDetailPasswordsItemComponent } from './ticket-detail-passwords/ticket-detail-passwords-item/ticket-detail-passwords-item.component';



@NgModule({
    declarations: [
        TicketDetailComponent,
        TicketDetailProfileUpdatesComponent,
        TicketDetailProfileUpdatesNoteComponent,
        TicketDetailProfileUpdatesNoteItemComponent,
        TicketDetailProfileUpdatesNoteInfoComponent,
        TicketDetailProfileUpdatesNoteEditComponent,
        TicketDetailProfileUpdatesHeaderInfoComponent,
        TicketDetailProfileUpdatesProductComponent,
        TicketDetailProfileUpdatesProductItemComponent,
        TicketDetailProfileUpdatesProductInfoComponent,
        TicketDetailProfileUpdatesProductEditComponent,
        TicketDetailProfileUpdatesProductHeaderInfoComponent,
        TicketDetailProfileUpdatesServiceComponent,
        TicketDetailProfileUpdatesServiceItemComponent,
        TicketDetailProfileUpdatesServiceInfoComponent,
        TicketDetailProfileUpdatesServiceHeaderInfoComponent,
        TicketDetailTasksComponent,
        TicketDetailHeaderComponent,
        TicketDetailProfileFormUpdateComponent,
        TicketDetailProfileFormUpdateVisibleUsersComponent,
        TicketDetailProfileFormUpdateNoteComponent,
        TicketDetailProfileFormUpdateServicesComponent,
        TicketDetailProfileFormUpdateHeaderComponent,
        TicketDetailProfileFormUpdateProductsComponent,
        TicketDetailProfileFormUpdateSupportComponent,
        TicketDetailClaimInfoComponent,
        TicketDetailInfoStatusComponent,
        TicketDetailChangeStatusComponent,
        TicketDetailChangePriorityComponent,
        TicketDetailChangeCompanyComponent,
        TicketDetailAddAssignedUserComponent,
        TicketDetailEditTagsComponent,
        TicketDetailAttachmentsComponent,
        TicketDetailLinkedAgentsComponent,
        TicketDetailProfileEditUpdatesComponent,
        TicketDetailProfileEditUpdatesHeaderComponent,
        TicketDetailProfileEditUpdatesServicesComponent,
        TicketDetailProfileEditUpdatesProductsComponent,
        TicketDetailMessageComponent,
        TicketDetailContactComponent,
        TicketDetailPasswordsComponent,
        TicketDetailDevicesComponent,
        TicketDetailDocumentsComponent,
        TicketDetailContactDetailsComponent,
        TicketDetailContactDetailsHistoryComponent,
        TicketDetailDocumentsPreviewComponent,
        TicketDetailDocumentsDetailsComponent,
        TicketDetailPasswordsItemComponent

    ],
    imports: [
        CommonModule,
        TicketDetailRoutingModule,
        DynamicTooltipModule,
        NgbModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        ReactiveFormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        TextAreaModule,
        ProductListModule,
        FormsModule,
        NumberModule,
        ServicesListModule,
        TicketProfileUpdatesServiceTimepickerModule,
        TicketProfileUpdatesServiceDurationModule,
        DatePickerModule,
        NgxMaskModule.forRoot(),
        PreparePhoneModule,
        PhoneModule,
        InfiniteScrollModule,
        TechUsersModule,
        UploadAreaProgressModule,
        ClickOtsideModule,
        TicketProfileAttachmentsModule,
        PreviewPhoneMaskModule,
        InvoiceFormTicketEditTaxesModule,
        TicketChangeStatusModule,
        AddAssignedUserModule,
        TicketProfileFormUpdateNoteListModule,
        KeyUpEnterModule,
        DropDownModule,
        CompanyDropDownModule,
        CompanyInfoHistoryModule
    ],



})
export class TicketDetailModule { }
