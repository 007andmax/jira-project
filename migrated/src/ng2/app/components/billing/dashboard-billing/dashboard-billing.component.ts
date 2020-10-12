import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardBillingService } from 'src/ng2/app/services/dashboard-billing/dashboard-billing.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { Dashboard } from './class/dashboard';
import { InvoiceRevenue } from './class/invoice-revenue';
import * as moment from "moment";
import { ContractsDashboard } from './class/contracts-dashboard';
import { ContractsDashboardComponent } from './contracts-dashboard/contracts-dashboard.component';

@Component({
  selector: 'app-dashboard-billing',
  templateUrl: './dashboard-billing.component.html',
  styleUrls: ['./dashboard-billing.component.scss']
})
export class DashboardBillingComponent implements OnInit {
  @ViewChild('contractsDb') contractsDb:ContractsDashboardComponent;
  dashboard:Dashboard;
  contractsDashboard: ContractsDashboard = new ContractsDashboard();
  showPreloader:boolean = true;
  constructor(private dashboardBillingService: DashboardBillingService,
    private companiesStateService:CompaniesStateService) { }

  ngOnInit() {
    this.dashboardBillingService.getDashboard("WEEKLY").subscribe(data => {
      console.log("data", data);
      this.dashboard = data;
      this.contractsDashboard = new ContractsDashboard(this.dashboard.serviceAgreementCounters);
    
      this.showPreloader = false;
    })
    
    
  }
  

}
