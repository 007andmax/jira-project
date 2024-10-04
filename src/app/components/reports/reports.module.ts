import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { ReportListItemComponent } from './report-list-item/report-list-item.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { ReportListItemModule } from './report-list-item/report-list-item.module';
import { DetailedContractReportComponent } from './reports/detailed-contract-report/detailed-contract-report.component';


@NgModule({
    declarations: [ReportsComponent
    ],
    imports: [
        CommonModule,
        ReportsRoutingModule,
        ToFixedModule,
        ReportListItemModule,

    ],

})
export class ReportsModule { }
