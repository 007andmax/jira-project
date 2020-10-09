import { Component, OnInit } from '@angular/core';
import { DashboardBillingService } from 'src/ng2/app/services/dashboard-billing/dashboard-billing.service';
import { Dashboard } from './class/dashboard';

@Component({
  selector: 'app-dashboard-billing',
  templateUrl: './dashboard-billing.component.html',
  styleUrls: ['./dashboard-billing.component.scss']
})
export class DashboardBillingComponent implements OnInit {
  dashboard:Dashboard;
  constructor(private dashboardBillingService: DashboardBillingService) { }

  ngOnInit() {
    this.dashboardBillingService.getDashboard("WEEKLY").subscribe(data => {
      console.log("data", data);
      this.dashboard = data;
    })
  }

}
