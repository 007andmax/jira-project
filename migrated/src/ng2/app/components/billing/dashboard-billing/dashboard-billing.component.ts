import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DashboardBillingService } from 'src/ng2/app/services/dashboard-billing/dashboard-billing.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { Dashboard } from './class/dashboard';
import { InvoiceRevenue } from './class/invoice-revenue';
import * as moment from "moment";
import { ContractsDashboard } from './class/contracts-dashboard';
import { ContractsDashboardComponent } from './contracts-dashboard/contracts-dashboard.component';
import { ReportsService } from 'src/ng2/app/services/reports/reports.service';
import { TopDashboard } from './class/top-dashboard';
import { DashboardSalesAnalyticsComponent } from './dashboard-sales-analytics/dashboard-sales-analytics.component';
import { LeftPanelStateService } from 'src/ng2/app/states/left-panel/left-panel-state.service';

@Component({
  selector: 'app-dashboard-billing',
  templateUrl: './dashboard-billing.component.html',
  styleUrls: ['./dashboard-billing.component.scss']
})
export class DashboardBillingComponent implements OnInit {
  @ViewChild('contractsDb') contractsDb: ContractsDashboardComponent;
  @ViewChild('dashboardStats') dashboardStats: DashboardSalesAnalyticsComponent;
  accountingStartDate: string;
  dashboard: Dashboard;
  topDashboard: TopDashboard = new TopDashboard();
  contractsDashboard: ContractsDashboard = new ContractsDashboard();
  showPreloader: boolean = true;

  constructor(private dashboardBillingService: DashboardBillingService,
    private reportsService: ReportsService,
    public cd: ChangeDetectorRef,
    private leftPanelStateService:LeftPanelStateService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.leftPanelStateService.setBillingpage('billing-dashboard');
    this.getAccountingStartDate();
  }
  getTextAccountingStartDate() {
    return moment(this.accountingStartDate).format('DD MMM YYYY');
  }
  getDashboard(type) {
    this.dashboardBillingService.getDashboard(type).subscribe(data => {
      this.dashboard = data;
      this.contractsDashboard = new ContractsDashboard(this.dashboard.serviceAgreementCounters);
      this.showPreloader = false;
      this.cd.detectChanges();
      if (this.dashboardStats) this.dashboardStats.updateDataChart();
    });
  }
  getAccountingStartDate() {
    this.reportsService.getAccountingStartDate().subscribe((data: any) => {
      this.accountingStartDate = data.accountingStartDate;
      this.topDashboard.setInvoiceAmountsStartDate(moment(this.accountingStartDate).format('YYYY/MM/DD'));
      this.topDashboard.setInvoiceAmountsEndDate(moment(new Date()).format('YYYY/MM/DD'));
      this.getTops();
    })
  }
  getTops() {
    this.dashboardBillingService.getTops(this.topDashboard.getDataForRequest()).subscribe(data => {
      this.topDashboard.setData(data);
      this.getDashboard("WEEKLY");

    })
  }


}
