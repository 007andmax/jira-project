import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportDeviceSummaryComponent } from './report-device-summary.component';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { ReportSendEmailModule } from '../../report-additional-actions/report-send-email/report-send-email.module';



@NgModule({
    declarations: [ReportDeviceSummaryComponent
    ],
    imports: [
        CommonModule,
        DropDownModule,
        ReportSendEmailModule

    ],
    exports: [ReportDeviceSummaryComponent]


})
export class ReportDeviceSummaryModule { }
