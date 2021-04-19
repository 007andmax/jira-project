import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DashboardBillingService } from 'src/app/services/dashboard-billing/dashboard-billing.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { Dashboard } from './class/dashboard';
import { InvoiceRevenue } from './class/invoice-revenue';
import * as moment from "moment";
import { ContractsDashboard } from './class/contracts-dashboard';
import { ContractsDashboardComponent } from './contracts-dashboard/contracts-dashboard.component';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { TopDashboard } from './class/top-dashboard';
import { DashboardSalesAnalyticsComponent } from './dashboard-sales-analytics/dashboard-sales-analytics.component';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { InvoiceRevenueComponent } from './invoice-revenue/invoice-revenue.component';

@Component({
  selector: 'app-dashboard-billing',
  templateUrl: './dashboard-billing.component.html',
  styleUrls: ['./dashboard-billing.component.scss']
})
export class DashboardBillingComponent implements OnInit {
  @ViewChild('contractsDb') contractsDb: ContractsDashboardComponent;
  @ViewChild('dashboardStats') dashboardStats: DashboardSalesAnalyticsComponent;
  @ViewChild('invoiceRevenue') invoiceRevenue: InvoiceRevenueComponent;
  accountingStartDate: number;
  dashboard: Dashboard;
  topDashboard: TopDashboard = new TopDashboard();
  contractsDashboard: ContractsDashboard = new ContractsDashboard();
  showPreloader: boolean = true;
  isDashboardReady: boolean = false;
  isTopReady: boolean = false;
  constructor(private dashboardBillingService: DashboardBillingService,
    private reportsService: ReportsService,
    public cd: ChangeDetectorRef,
    private leftPanelStateService: LeftPanelStateService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.leftPanelStateService.setBillingPage('billing-dashboard');
    this.getAccountingStartDate();
  }
  getTextAccountingStartDate() {
    return moment(this.accountingStartDate).format('DD MMM YYYY');
  }
  getDashboard(type) {
    this.dashboardBillingService.getDashboard(type).subscribe(data => {
      this.dashboard = data;
      this.contractsDashboard = new ContractsDashboard(this.dashboard.serviceAgreementCounters);

      this.cd.detectChanges();
      if (this.dashboardStats) this.dashboardStats.updateDataChart();
      this.isDashboardReady = true;
      this.checkReadyState();
    }, (err) => {
      this.dashboard = new Dashboard();
      this.isDashboardReady = true;
      this.checkReadyState();
    });
  }
  checkReadyState() {
    if (this.isDashboardReady && this.isTopReady) this.showPreloader = false;
  }
  getAccountingStartDate() {
    this.reportsService.getAccountingStartDate().subscribe((data: any) => {
      this.accountingStartDate = new Date(data.accountingStartDate).getTime();
      this.topDashboard.setInvoiceAmountsStartDate(moment(this.accountingStartDate).format('YYYY/MM/DD'));
      this.topDashboard.setInvoiceAmountsEndDate(moment(new Date()).format('YYYY/MM/DD'));
      this.getTops();
      this.getDashboard("WEEKLY");
    })
  }
  public onChangeDatePicker(data) {
    let date = new Date(data.year, data.month - 1, data.day);
    this.reportsService.setAccountingStartDate(JSON.stringify(moment(date).format('YYYY-MM-DD'))).subscribe(res => {
      this.accountingStartDate = date.getTime();
      this.topDashboard.setInvoiceAmountsStartDate(moment(this.accountingStartDate).format('YYYY/MM/DD'));
      this.topDashboard.setInvoiceAmountsEndDate(moment(new Date()).format('YYYY/MM/DD'));
      this.cd.detectChanges();
      this.getTops();
      this.invoiceRevenue.updateStartDate();
      this.invoiceRevenue.getInvoiceRevenue();

    })
  }
  getTops() {
    this.dashboardBillingService.getTops(this.topDashboard.getDataForRequest()).subscribe(data => {
      this.topDashboard.setData(data);
      this.isTopReady = true;
      this.checkReadyState();
    }, err => {
      this.isTopReady = true;
      this.checkReadyState();
    })
  }


}
