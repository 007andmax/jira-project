
import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { fadeInAnimation } from 'src/app/animations';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { AccountingReportComponent } from '../reports/accounting-report/accounting-report.component';
import { AccountsReceivableComponent } from '../reports/accounts-receivable/accounts-receivable.component';
import { CommonCommissionsReportComponent } from '../reports/common-commissions-report/common-commissions-report.component';
import { CustomerSalesReportComponent } from '../reports/customer-sales-report/customer-sales-report.component';
import { DetailedCommissionsReportComponent } from '../reports/detailed-commissions-report/detailed-commissions-report.component';
import { DetailedContractReportComponent } from '../reports/detailed-contract-report/detailed-contract-report.component';
import { DeviceIpSummaryDeviceReportComponent } from '../reports/device-ip-summary-device-report/device-ip-summary-device-report.component';
import { DeviceIpSummaryReportComponent } from '../reports/device-ip-summary-report/device-ip-summary-report.component';
import { GlNumberComponent } from '../reports/gl-number/gl-number.component';
import { HardwareSummaryDeviceReportComponent } from '../reports/hardware-summary-device-report/hardware-summary-device-report.component';
import { HardwareSummaryReportComponent } from '../reports/hardware-summary-report/hardware-summary-report.component';
import { NetworkAdapterReportComponent } from '../reports/network-adapter-report/network-adapter-report.component';
import { PaymentsReportComponent } from '../reports/payments-report/payments-report.component';
import { ProductSalesReportComponent } from '../reports/product-sales-report/product-sales-report.component';
import { RemoteConnectionReportComponent } from '../reports/remote-connection-report/remote-connection-report.component';
import { ReportDeviceDeploymentwarrantyComponent } from '../reports/report-device-deploymentwarranty/report-device-deploymentwarranty.component';
import { ServiceReportComponent } from '../reports/service-report/service-report.component';
import { SoftwareSummaryReportComponent } from '../reports/software-summary-report/software-summary-report.component';
import { TaxesReportComponent } from '../reports/taxes-report/taxes-report.component';
import { TechSalesReportComponent } from '../reports/tech-sales-report/tech-sales-report.component';
import { TechServiceReportComponent } from '../reports/tech-service-report/tech-service-report.component';
import { TechTicketReportComponent } from '../reports/tech-ticket-report/tech-ticket-report.component';
import { TicketReportComponent } from '../reports/ticket-report/ticket-report.component';
import { ApplicationbycompanyReportComponent } from '../reports/applicationbycompany-report/applicationbycompany-report.component';
import { ReportDeviceSummaryComponent } from '../reports/report-device-summary/report-device-summary.component';
import { SoftwareSummaryReport1Component } from '../reports/software-summary-report1/software-summary-report1.component';
import { ReportDeviceWarrantyComponent } from '../reports/report-device-warranty/report-device-warranty.component';
import { ReportDeviceAntivirusComponent } from '../reports/report-device-antivirus/report-device-antivirus.component';
import { NetworkIpReportComponent } from '../reports/network-ip-report/network-ip-report.component';
import { NetworkDetailReportComponent } from '../reports/network-detail-report/network-detail-report.component';
import { ReportDeviceProcessorramComponent } from '../reports/report-device-processorram/report-device-processorram.component';
import { ReportDeviceDiskspaceComponent } from '../reports/report-device-diskspace/report-device-diskspace.component';


@Component({
  standalone: true,
  imports: [AccountingReportComponent, ReportDeviceDiskspaceComponent, ReportDeviceProcessorramComponent, NetworkDetailReportComponent, NetworkIpReportComponent, ReportDeviceAntivirusComponent, ReportDeviceWarrantyComponent, ReportDeviceSummaryComponent, SoftwareSummaryReport1Component, ApplicationbycompanyReportComponent, AccountsReceivableComponent, CustomerSalesReportComponent, GlNumberComponent, ProductSalesReportComponent, ServiceReportComponent, TaxesReportComponent, TechServiceReportComponent, TicketReportComponent, CommonCommissionsReportComponent, DetailedCommissionsReportComponent, DetailedContractReportComponent, DeviceIpSummaryDeviceReportComponent, DeviceIpSummaryReportComponent, HardwareSummaryDeviceReportComponent, HardwareSummaryReportComponent, NetworkAdapterReportComponent, PaymentsReportComponent, RemoteConnectionReportComponent, ReportDeviceDeploymentwarrantyComponent, SoftwareSummaryReportComponent, TechSalesReportComponent, TechTicketReportComponent, CommonModule],
  selector: 'app-item-report',
  templateUrl: './item-report.component.html',
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  styleUrls: ['./item-report.component.scss'],

})
export class ItemReportComponent implements OnInit, OnDestroy {
  sub: Subscription = new Subscription();
  report: string;

  constructor(
    private leftPanelStateService: LeftPanelStateService,
    public cd: ChangeDetectorRef,
    public activateRoute: ActivatedRoute,
  ) { }


  ngOnInit() {
    if (localStorage.report) this.report = localStorage.report;
    $('body').addClass('qt-bg-white');
    let id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      id = params['id'];
      this.report = id;
      //   if (id && localStorage.report) this.report = localStorage.report;

    });
    this.sub.add(subscription);
  }
  back() {
    this.leftPanelStateService.goToState('new-reports' || 'new-device-summary');
  }

  backreport() {
    this.leftPanelStateService.goToState('new-device-summary')
  }
  parseTotal(value) {
    return parseFloat(value.toString()).toFixed(2)
  }
  ngOnDestroy(): void {
    this.report = null;
    localStorage.removeItem('report');
    $('body').removeClass('qt-bg-white');
    this.sub.unsubscribe();
  }
}
