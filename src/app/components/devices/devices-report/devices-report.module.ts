import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesReportComponent } from './devices-report.component';
import { DevicesReportRoutingModule } from './devices-report-routing.module';
import { ReportListItemComponent } from '../../reports/report-list-item/report-list-item.component';
import { ReportDeviceSummaryComponent } from '../../reports/reports/report-device-summary/report-device-summary.component';
import { ReportDeviceSummaryModule } from '../../reports/reports/report-device-summary/report-device-summary.module';

@NgModule({
    declarations: [
        DevicesReportComponent,
        ReportListItemComponent,

    ],
    imports: [
        CommonModule,
        DevicesReportRoutingModule,
        ReportDeviceSummaryModule
    ],
})
export class DevicesReportModule { }
