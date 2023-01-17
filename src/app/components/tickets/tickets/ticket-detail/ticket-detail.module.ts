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



@NgModule({
    declarations: [
        TicketDetailComponent

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
        TicketChangeStatusModule
    ],



})
export class TicketDetailModule { }
