import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DashboardBillingService } from 'src/ng2/app/services/dashboard-billing/dashboard-billing.service';
import { ReportsService } from 'src/ng2/app/services/reports/reports.service';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/ng2/app/states/left-panel/left-panel-state.service';
import { CompanySetting } from '../../companies/class/company-setting';
import { DashboardTickets } from './class/dashboard-tickets';
import { DashboardTicketsStats } from './class/dashboard-tickets-stats';

@Component({
  selector: 'tickets-dashboard',
  templateUrl: './tickets-dashboard.component.html',
  styleUrls: ['./tickets-dashboard.component.scss']
})
export class TicketsDashboardComponent implements OnInit {
  showPreloader: boolean = true;
  accountingStartDate: string;
  dashboard: DashboardTickets;
  dashboardTicketsStats:DashboardTicketsStats = new DashboardTicketsStats();
  listIntervals = [new CompanySetting('last month', 'LAST_MONTH'), new CompanySetting('current month', 'CURRENT_MONTH'), new CompanySetting('year to date', 'YEAR_TO_DATE')];
  currentInterval = new CompanySetting('last month', 'LAST_MONTH');
  constructor(private dashboardBillingService: DashboardBillingService,
    private reportsService: ReportsService,
    public cd: ChangeDetectorRef,
    private ticketsService: TicketsService,
    private leftPanelStateService: LeftPanelStateService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
  
    this.getCounts();
  }
  onSelectInterval(item) {
    this.currentInterval = item;
    this.dashboardTicketsStats.onSetDates(item.value);
   // this.showPreloader = true;
    this.getCounts();
  }
  private getCounts() {
    this.ticketsService.getCounts(this.dashboardTicketsStats.getDataForRequest()).subscribe(data => {
     console.log("data",data);
     this.dashboardTicketsStats.setData(data);
     this.showPreloader = false;
      this.cd.detectChanges();
    })
  }
  getTextAccountingStartDate() {
    return moment(this.accountingStartDate).format('DD MMM YYYY');
  }
  

}
