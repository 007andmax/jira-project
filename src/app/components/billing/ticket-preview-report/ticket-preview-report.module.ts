import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketPreviewReportComponent } from './ticket-preview-report.component';
import { TicketPreviewReportRoutingModule } from './ticket-preview-report-routing.module';
import { TicketPreviewReportProductItemComponent } from './ticket-preview-report-product-item/ticket-preview-report-product-item.component';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { TicketPreviewReportProductItemDropDownComponent } from './ticket-preview-report-product-item/ticket-preview-report-product-item-drop-down/ticket-preview-report-product-item-drop-down.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterModule } from 'src/app/pipe/filter/filter.module';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { ContractsAsideDiscountModule } from '../contracts/contracts-aside/contracts-aside-discount/contracts-aside-discount.module';
import { TicketPreviewReportServiceItemComponent } from './ticket-preview-report-service-item/ticket-preview-report-service-item.component';
import { ServicesListModule } from '../../shared/services-list/services-list.module';
import { TicketProfileUpdatesServiceTimepickerModule } from '../../tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.module';
import { TicketProfileUpdatesServiceDurationModule } from '../../tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-duration/ticket-profile-updates-service-duration.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { IntegerModule } from 'src/app/directives/integer/integer.module';
import { TicketsTableItemStatusModule } from '../../tickets/tickets/tickets-table/tickets-table-item/tickets-table-item-status/tickets-table-item-status.module';
import { TicketPreviewReportProductItemManufactureComponent } from './ticket-preview-report-product-item/ticket-preview-report-product-item-manufacture/ticket-preview-report-product-item-manufacture.component';
import { TicketPreviewReportHeaderComponent } from './ticket-preview-report-header/ticket-preview-report-header.component';
import { MultiDatepickerModule } from '../../shared/multi-datepicker/multi-datepicker.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TicketPreviewReportStatusDropDownComponent } from './ticket-preview-report-status-drop-down/ticket-preview-report-status-drop-down.component';
import { MatChipListModule } from '../../shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from '../../shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from '../../shared/mat-form-field/mat-form-field.module';



@NgModule({
    declarations: [TicketPreviewReportComponent, TicketPreviewReportProductItemComponent, TicketPreviewReportProductItemDropDownComponent, TicketPreviewReportServiceItemComponent, TicketPreviewReportProductItemManufactureComponent, TicketPreviewReportHeaderComponent, TicketPreviewReportStatusDropDownComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        TicketPreviewReportRoutingModule,
        DecimalNumberModule,
        ToFixedModule,
        MatErrorModule,
        DatePickerModule,
        NgbModule,
        FilterModule,
        DynamicTooltipModule,
        ContractsAsideDiscountModule,
        ServicesListModule,
        TicketProfileUpdatesServiceTimepickerModule,
        TicketProfileUpdatesServiceDurationModule,
        TextAreaModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NumberModule,
        IntegerModule,
        TicketsTableItemStatusModule,
        MultiDatepickerModule,
        DropDownModule,
        InfiniteScrollModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
    ],

})
export class TicketPreviewReportModule { }
