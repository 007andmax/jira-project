import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DashboardBillingService } from 'src/ng2/app/services/dashboard-billing/dashboard-billing.service';
import { ReportsService } from 'src/ng2/app/services/reports/reports.service';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/ng2/app/states/left-panel/left-panel-state.service';
import { DashboardTickets } from './class/dashboard-tickets';

@Component({
  selector: 'tickets-dashboard',
  templateUrl: './tickets-dashboard.component.html',
  styleUrls: ['./tickets-dashboard.component.scss']
})
export class TicketsDashboardComponent implements OnInit {
  showPreloader: boolean = true;
  accountingStartDate: string;
  dashboard: DashboardTickets;
  constructor(private dashboardBillingService: DashboardBillingService,
    private reportsService: ReportsService,
    public cd: ChangeDetectorRef,
    private ticketsService: TicketsService,
    private leftPanelStateService: LeftPanelStateService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.getAccountingStartDate();
  }
  getAccountingStartDate() {
    this.reportsService.getAccountingStartDate().subscribe((data: any) => {
      this.accountingStartDate = data.accountingStartDate;

      this.getDashboard("WEEKLY");
    })
  }
  getTextAccountingStartDate() {
    return moment(this.accountingStartDate).format('DD MMM YYYY');
  }
  getDashboard(type) {
    this.ticketsService.getDashboard(type).subscribe(data => {
      console.log("data", data);
      this.dashboard = data;
      this.showPreloader = false;
      this.cd.detectChanges();
    });
  }

}
