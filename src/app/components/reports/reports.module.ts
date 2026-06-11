import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { ReportListItemComponent } from './report-list-item/report-list-item.component';
import { ReportsRoutingModule } from './reports-routing.module';


import { DetailedContractReportComponent } from './reports/detailed-contract-report/detailed-contract-report.component';
import { OverviewProductSalesReportComponent } from './overview-report/overview-product-sales-report/overview-product-sales-report.component';


@NgModule({
    imports: [
    CommonModule,
    ReportsRoutingModule,
    ReportsComponent,
],
})
export class ReportsModule { }
