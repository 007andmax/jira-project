import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemReportComponent } from './item-report.component';
import { TechTicketReportComponent } from '../reports/tech-ticket-report/tech-ticket-report.component';
import { TechSalesReportComponent } from '../reports/tech-sales-report/tech-sales-report.component';
import { RemoteConnectionReportComponent } from '../reports/remote-connection-report/remote-connection-report.component';
import { DeviceIpSummaryReportComponent } from '../reports/device-ip-summary-report/device-ip-summary-report.component';
import { GlNumberComponent } from '../reports/gl-number/gl-number.component';
import { SoftwareSummaryReportComponent } from '../reports/software-summary-report/software-summary-report.component';
import { HardwareSummaryReportComponent } from '../reports/hardware-summary-report/hardware-summary-report.component';
import { AccountsReceivableComponent } from '../reports/accounts-receivable/accounts-receivable.component';
import { TaxesReportComponent } from '../reports/taxes-report/taxes-report.component';
import { ProductSalesReportComponent } from '../reports/product-sales-report/product-sales-report.component';
import { DetailedCommissionsReportComponent } from '../reports/detailed-commissions-report/detailed-commissions-report.component';
import { CommonCommissionsReportComponent } from '../reports/common-commissions-report/common-commissions-report.component';
import { CustomerSalesReportComponent } from '../reports/customer-sales-report/customer-sales-report.component';
import { TicketReportComponent } from '../reports/ticket-report/ticket-report.component';
import { ServiceReportComponent } from '../reports/service-report/service-report.component';
import { TechServiceReportComponent } from '../reports/tech-service-report/tech-service-report.component';
import { AccountingReportComponent } from '../reports/accounting-report/accounting-report.component';
import { ReportMenuModule } from '../report-menu/report-menu.module';
import { ReportAdditionalActionsModule } from '../report-additional-actions/report-additional-actions.module';
import { NvD3Module } from 'ng2-nvd3';
import { ReportFooterModule } from '../report-footer/report-footer.module';
import { OverviewReportComponent } from '../overview-report/overview-report.component';
import { ItemReportRoutingModule } from './item-report-routing.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { ToFixedPipeModule } from 'src/app/pipe/to-fixed/to-fixed.module';

@NgModule({
    declarations: [ItemReportComponent,
        TechTicketReportComponent,
        TechSalesReportComponent,
        RemoteConnectionReportComponent,
        DeviceIpSummaryReportComponent,
        GlNumberComponent,
        SoftwareSummaryReportComponent,
        HardwareSummaryReportComponent,
        AccountsReceivableComponent,
        TaxesReportComponent,
        ProductSalesReportComponent,
        DetailedCommissionsReportComponent,
        CommonCommissionsReportComponent,
        CustomerSalesReportComponent,
        TicketReportComponent,
        ServiceReportComponent,
        TechServiceReportComponent,
        AccountingReportComponent,
        OverviewReportComponent
    ],
    imports: [
        CommonModule,
        ReportMenuModule,
        ReportAdditionalActionsModule,
        NvD3Module,
        ReportFooterModule,
        ToFixedModule,
        ItemReportRoutingModule,
        ToFixedPipeModule

    ],



})
export class ItemReportModule { }
