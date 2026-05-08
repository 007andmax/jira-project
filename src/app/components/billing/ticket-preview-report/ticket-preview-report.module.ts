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



@NgModule({
    declarations: [TicketPreviewReportComponent, TicketPreviewReportProductItemComponent, TicketPreviewReportProductItemDropDownComponent

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
        ContractsAsideDiscountModule
    ],

})
export class TicketPreviewReportModule { }
