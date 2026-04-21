import { AccountingReportComponent } from './';
import { AccountsReceivableComponent } from './';
import { CustomerSalesReportComponent } from './';
import { GlNumberComponent } from './';
import { ProductSalesReportComponent } from './';
import { ServiceReportComponent } from './';
import { TaxesReportComponent } from './';
import { TechServiceReportComponent } from './';
import { TicketReportComponent } from './';
import { CommonCommissionsReportComponent } from './';
import { DetailedCommissionsReportComponent } from './';
import { DetailedContractReportComponent } from './';
import { DeviceIpSummaryDeviceReportComponent } from './';
import { DeviceIpSummaryReportComponent } from './';
import { HardwareSummaryDeviceReportComponent } from './';
import { HardwareSummaryReportComponent } from './';
import { NetworkAdapterReportComponent } from './';
import { PaymentsReportComponent } from './';
import { RemoteConnectionReportComponent } from './';
import { ReportDeviceDeploymentwarrantyComponent } from './';
import { SoftwareSummaryReportComponent } from './';
import { TechSalesReportComponent } from './';
import { TechTicketReportComponent } from './';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { fadeInAnimation } from 'src/app/animations';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';


@Component({
  standalone: true,
  imports: [AccountingReportComponent, AccountsReceivableComponent, CustomerSalesReportComponent, GlNumberComponent, ProductSalesReportComponent, ServiceReportComponent, TaxesReportComponent, TechServiceReportComponent, TicketReportComponent, CommonCommissionsReportComponent, DetailedCommissionsReportComponent, DetailedContractReportComponent, DeviceIpSummaryDeviceReportComponent, DeviceIpSummaryReportComponent, HardwareSummaryDeviceReportComponent, HardwareSummaryReportComponent, NetworkAdapterReportComponent, PaymentsReportComponent, RemoteConnectionReportComponent, ReportDeviceDeploymentwarrantyComponent, SoftwareSummaryReportComponent, TechSalesReportComponent, TechTicketReportComponent, CommonModule],
    selector: 'app-item-report',
    templateUrl: './item-report.component.html',
    animations: [fadeInAnimation],
    // attach the fade in animation to the host (root) element of this component
    host: { '[@fadeInAnimation]': '' },
    styleUrls: ['./item-report.component.scss'],
    standalone: true
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
