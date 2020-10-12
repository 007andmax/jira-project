import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardBillingService } from 'src/ng2/app/services/dashboard-billing/dashboard-billing.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { Dashboard } from './class/dashboard';
import { InvoiceRevenue } from './class/invoice-revenue';
import * as moment from "moment";
import { ContractsDashboard } from './class/contracts-dashboard';
import { ContractsDashboardComponent } from './contracts-dashboard/contracts-dashboard.component';
import { ReportsService } from 'src/ng2/app/services/reports/reports.service';
import { TopDashboard } from './class/top-dashboard';

@Component({
  selector: 'app-dashboard-billing',
  templateUrl: './dashboard-billing.component.html',
  styleUrls: ['./dashboard-billing.component.scss']
})
export class DashboardBillingComponent implements OnInit {
  @ViewChild('contractsDb') contractsDb: ContractsDashboardComponent;
  accountingStartDate: string;
  dashboard: Dashboard;
  topDashboard: TopDashboard = new TopDashboard();
  contractsDashboard: ContractsDashboard = new ContractsDashboard();
  showPreloader: boolean = true;

  constructor(private dashboardBillingService: DashboardBillingService,
    private reportsService: ReportsService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.dashboardBillingService.getDashboard("WEEKLY").subscribe(data => {
      console.log("data", data);
      this.dashboard = data;
      this.contractsDashboard = new ContractsDashboard(this.dashboard.serviceAgreementCounters);
      this.getAccountingStartDate();

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
      this.showPreloader = false;
    })
  }


}
