import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketPreviewReportComponent } from './ticket-preview-report.component';
import { TicketPreviewReportRoutingModule } from './ticket-preview-report-routing.module';



@NgModule({
    declarations: [TicketPreviewReportComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        TicketPreviewReportRoutingModule
    ],

})
export class TicketPreviewReportModule { }
