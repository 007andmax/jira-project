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
import { OverviewReportComponent } from '../overview-report/overview-report.component';
import { ItemReportRoutingModule } from './item-report-routing.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { ToFixedPipeModule } from 'src/app/pipe/to-fixed/to-fixed.module';
import { PaymentsReportComponent } from '../reports/payments-report/payments-report.component';
import { ReportDeviceSummaryModule } from '../reports/report-device-summary/report-device-summary.module';
import { SoftwareSummaryReport1Component } from '../reports/software-summary-report1/software-summary-report1.component';
import { ReportDeviceWarrantyComponent } from '../reports/report-device-warranty/report-device-warranty.component';
import { ReportDeviceAntivirusComponent } from '../reports/report-device-antivirus/report-device-antivirus.component';
import { NetworkIpReportComponent } from '../reports/network-ip-report/network-ip-report.component';
import { NetworkDetailReportComponent } from '../reports/network-detail-report/network-detail-report.component';
import { NetworkAdapterReportComponent } from '../reports/network-adapter-report/network-adapter-report.component';
import { ReportDeviceDeploymentwarrantyComponent } from '../reports/report-device-deploymentwarranty/report-device-deploymentwarranty.component';
import { ReportDeviceProcessorramComponent } from '../reports/report-device-processorram/report-device-processorram.component';
import { ReportDeviceDiskspaceComponent } from '../reports/report-device-diskspace/report-device-diskspace.component';
import { ApplicationbycompanyReportComponent } from '../reports/applicationbycompany-report/applicationbycompany-report.component';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { ReportSendEmailModule } from '../report-additional-actions/report-send-email/report-send-email.module';
import { HardwareSummaryDeviceReportComponent } from '../reports/hardware-summary-device-report/hardware-summary-device-report.component';
import { DeviceIpSummaryDeviceReportComponent } from '../reports/device-ip-summary-device-report/device-ip-summary-device-report.component';
import { DetailedContractReportComponent } from '../reports/detailed-contract-report/detailed-contract-report.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
    declarations: [ItemReportComponent,
        TechTicketReportComponent,
        TechSalesReportComponent,
        RemoteConnectionReportComponent,
        DeviceIpSummaryReportComponent,
        GlNumberComponent,
        SoftwareSummaryReportComponent,
        HardwareSummaryReportComponent,
        HardwareSummaryDeviceReportComponent,
        AccountsReceivableComponent,
        TaxesReportComponent,
        DeviceIpSummaryDeviceReportComponent,
        ProductSalesReportComponent,
        DetailedCommissionsReportComponent,
        CommonCommissionsReportComponent,
        CustomerSalesReportComponent,
        TicketReportComponent,
        ServiceReportComponent,
        TechServiceReportComponent,
        AccountingReportComponent,
        OverviewReportComponent,
        PaymentsReportComponent,
        SoftwareSummaryReport1Component,
        ReportDeviceWarrantyComponent,
        ReportDeviceAntivirusComponent,
        NetworkIpReportComponent,
        NetworkDetailReportComponent,
        NetworkAdapterReportComponent,
        ReportDeviceDeploymentwarrantyComponent,
        ReportDeviceProcessorramComponent,
        ReportDeviceDiskspaceComponent,
        ApplicationbycompanyReportComponent,
        DetailedContractReportComponent
    ],
    imports: [
        CommonModule,
        ReportMenuModule,
        //ReportAdditionalActionsModule,
        ToFixedModule,
        ItemReportRoutingModule,
        ToFixedPipeModule,
        ReportDeviceSummaryModule,
        DropDownModule,
        ReportSendEmailModule,
        NgxChartsModule
    ],
})
export class ItemReportModule { }
