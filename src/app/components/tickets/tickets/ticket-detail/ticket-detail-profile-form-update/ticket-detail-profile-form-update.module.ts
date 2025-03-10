import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TicketDetailProfileFormUpdateComponent } from './ticket-detail-profile-form-update.component';
import { AddAssignedUserNoteComponent } from './ticket-detail-profile-form-update-header/add-assigned-user-note/add-assigned-user-note.component';
import { TicketDetailProfileFormUpdateHeaderComponent } from './ticket-detail-profile-form-update-header/ticket-detail-profile-form-update-header.component';
import { TicketDetailProfileFormUpdateNoteComponent } from './ticket-detail-profile-form-update-note/ticket-detail-profile-form-update-note.component';
import { TicketDetailProfileFormUpdateProductsComponent } from './ticket-detail-profile-form-update-products/ticket-detail-profile-form-update-products.component';
import { TicketDetailProfileFormUpdateServicesComponent } from './ticket-detail-profile-form-update-services/ticket-detail-profile-form-update-services.component';
import { TicketDetailProfileFormUpdateSupportComponent } from './ticket-detail-profile-form-update-support/ticket-detail-profile-form-update-support.component';
import { TicketDetailProfileFormUpdateVisibleUsersComponent } from './ticket-detail-profile-form-update-visible-users/ticket-detail-profile-form-update-visible-users.component';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { TicketProfileFormUpdateNoteListModule } from '../ticket-profile-form-update-note-list/ticket-profile-form-update-note-list.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadAreaProgressModule } from 'src/app/components/shared/upload-area/upload-area-progress/upload-area-progress.module';
import { InvoiceFormTicketEditTaxesModule } from 'src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.module';
import { ProductListModule } from 'src/app/components/shared/product-list/product-list.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { ServicesListModule } from 'src/app/components/shared/services-list/services-list.module';
import { TicketProfileUpdatesServiceDurationModule } from '../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-duration/ticket-profile-updates-service-duration.module';
import { TicketProfileUpdatesServiceTimepickerModule } from '../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.module';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';

@NgModule({
    declarations: [
        TicketDetailProfileFormUpdateComponent,
        AddAssignedUserNoteComponent,
        TicketDetailProfileFormUpdateHeaderComponent,
        TicketDetailProfileFormUpdateNoteComponent,
        TicketDetailProfileFormUpdateProductsComponent,
        TicketDetailProfileFormUpdateServicesComponent,
        TicketDetailProfileFormUpdateSupportComponent,
        TicketDetailProfileFormUpdateVisibleUsersComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        DisabledBtnModule,
        TicketProfileFormUpdateNoteListModule,
        PreloaderTicketModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        MatErrorModule,
        FormsModule,
        ReactiveFormsModule,
        UploadAreaProgressModule,
        ProductListModule,
        InvoiceFormTicketEditTaxesModule,
        NumberModule,
        DecimalNumberModule,
        ToFixedModule,
        ServicesListModule,
        TicketProfileUpdatesServiceTimepickerModule,
        TicketProfileUpdatesServiceDurationModule,
        DatePickerModule,
        DynamicTooltipModule
    ],
    exports: [TicketDetailProfileFormUpdateComponent],
    entryComponents: [TicketDetailProfileFormUpdateComponent]
})
export class TicketDetailProfileFormUpdateModule { }
