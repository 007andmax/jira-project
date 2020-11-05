import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
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
  dashboardTicketsStats: DashboardTicketsStats = new DashboardTicketsStats();
  listIntervals = [new CompanySetting('last month', 'LAST_MONTH'), new CompanySetting('current month', 'CURRENT_MONTH'), new CompanySetting('year to date', 'YEAR_TO_DATE')];
  currentInterval = new CompanySetting('last month', 'LAST_MONTH');
  constructor(
    public cd: ChangeDetectorRef,
    private ticketsStateService: TicketsStateService,
    private ticketsService: TicketsService,) { }

  ngOnInit() {
    this.ticketsStateService.onChangeLeftPanelFilter("DASHBOARD");
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
      this.dashboardTicketsStats.setData(data);
      this.showPreloader = false;
  
      this.cd.detectChanges();
    })
  }
  getTextAccountingStartDate() {
    return moment(this.accountingStartDate).format('DD MMM YYYY');
  }
}
