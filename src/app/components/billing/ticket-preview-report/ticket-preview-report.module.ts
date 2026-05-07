import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketPreviewReportComponent } from './ticket-preview-report.component';
import { TicketPreviewReportRoutingModule } from './ticket-preview-report-routing.module';
import { TicketPreviewReportProductItemComponent } from './ticket-preview-report-product-item/ticket-preview-report-product-item.component';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';



@NgModule({
    declarations: [TicketPreviewReportComponent, TicketPreviewReportProductItemComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        TicketPreviewReportRoutingModule,
        DecimalNumberModule,
        ToFixedModule,
        MatErrorModule
    ],

})
export class TicketPreviewReportModule { }
