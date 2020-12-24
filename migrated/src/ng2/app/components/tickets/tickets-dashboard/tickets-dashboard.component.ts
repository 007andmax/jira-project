import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { CompanySetting } from '../../companies/class/company-setting';
import { DashboardTickets } from './class/dashboard-tickets';
import { DashboardTicketsStats } from './class/dashboard-tickets-stats';
import { RecurringTicketWidgetComponent } from './recurring-ticket-widget/recurring-ticket-widget.component';
import { TicketPriorityWidgetComponent } from './ticket-priority-widget/ticket-priority-widget.component';
import { TicketsAnalyticsWidgetComponent } from './tickets-analytics-widget/tickets-analytics-widget.component';

@Component({
  selector: 'tickets-dashboard',
  templateUrl: './tickets-dashboard.component.html',
  styleUrls: ['./tickets-dashboard.component.scss']
})
export class TicketsDashboardComponent implements OnInit {
  @ViewChild('ticketPriority') ticketPriority: TicketPriorityWidgetComponent;
  @ViewChild('recurringTicket') recurringTicket: RecurringTicketWidgetComponent;
  @ViewChild('ticketsAnalytics') ticketsAnalytics: TicketsAnalyticsWidgetComponent;
  showPreloader: boolean = true;
  accountingStartDate: string;
  dashboard: DashboardTickets;
  dashboardTicketsStats: DashboardTicketsStats = new DashboardTicketsStats();
  listIntervals = [new CompanySetting('last month', 'LAST_MONTH'), new CompanySetting('current month', 'CURRENT_MONTH'), new CompanySetting('year to date', 'YEAR_TO_DATE')];
  currentInterval = new CompanySetting('last month', 'LAST_MONTH');
  countIsReady: boolean = false;
  techTicketsIsReady: boolean = false;
  ticketsAnalyticsReady: boolean = false;
  ticketsBillableHoursIsReady: boolean = false;
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
    this.getCounts();
  }
  private getCounts() {
    this.ticketsService.getCounts(this.dashboardTicketsStats.getDataForRequest()).subscribe(data => {
      this.dashboardTicketsStats.setData(data);
      this.countIsReady = true;
      this.onCheckREadyState();
      this.cd.detectChanges();
    }, (err) => {
      this.countIsReady = true;
      this.onCheckREadyState();
    })
  }
  onTechTicketsIsReady() {
    this.techTicketsIsReady = true;
    this.onCheckREadyState();
  }
  onTicketsBillableHoursIsReady() {
    this.ticketsBillableHoursIsReady = true;
    this.onCheckREadyState();
  }
  onTicketsAnalyticsReady() {
    this.ticketsAnalyticsReady = true;
    this.onCheckREadyState();
  }
  onCheckREadyState() {
    if (this.countIsReady && this.ticketsBillableHoursIsReady && this.ticketsAnalyticsReady && this.showPreloader && this.techTicketsIsReady) {
      this.showPreloader = false;
      this.cd.detectChanges();
      this.ticketPriority.updateDataChart();
      this.recurringTicket.updateDataChart();
      this.ticketsAnalytics.updateDataChart();
    }
  }
  getTextAccountingStartDate() {
    return moment(this.accountingStartDate).format('DD MMM YYYY');
  }
}
