import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketPreviewReportComponent } from './ticket-preview-report.component';
import { TicketPreviewReportRoutingModule } from './ticket-preview-report-routing.module';
import { TicketPreviewReportProductItemComponent } from './ticket-preview-report-product-item/ticket-preview-report-product-item.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng4-click-outside';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TicketPreviewReportHeaderComponent } from './ticket-preview-report-header/ticket-preview-report-header.component';
import { TicketPreviewReportProductItemDropDownComponent } from './ticket-preview-report-product-item/ticket-preview-report-product-item-drop-down/ticket-preview-report-product-item-drop-down.component';
import { TicketPreviewReportProductItemManufactureComponent } from './ticket-preview-report-product-item/ticket-preview-report-product-item-manufacture/ticket-preview-report-product-item-manufacture.component';
import { TicketPreviewReportServiceItemComponent } from './ticket-preview-report-service-item/ticket-preview-report-service-item.component';
import { TicketPreviewReportStatusDropDownComponent } from './ticket-preview-report-status-drop-down/ticket-preview-report-status-drop-down.component';



@NgModule({
    declarations: [TicketPreviewReportComponent, TicketPreviewReportProductItemComponent, TicketPreviewReportProductItemDropDownComponent, TicketPreviewReportServiceItemComponent, TicketPreviewReportProductItemManufactureComponent, TicketPreviewReportHeaderComponent, TicketPreviewReportStatusDropDownComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
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
        MultiDatepickerModule,
        DropDownModule,
        InfiniteScrollModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        ClickOutsideModule
    ],

})
export class TicketPreviewReportModule { }
