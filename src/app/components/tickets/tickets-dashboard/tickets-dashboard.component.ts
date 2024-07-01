import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { CompanySetting } from '../../companies/class/company-setting';
import { DashboardTickets } from './class/dashboard-tickets';
import { DashboardTicketsStats } from './class/dashboard-tickets-stats';
import { RecurringTicketWidgetComponent } from './recurring-ticket-widget/recurring-ticket-widget.component';
import { TicketPriorityWidgetComponent } from './ticket-priority-widget/ticket-priority-widget.component';
import { TicketsAnalyticsWidgetComponent } from './tickets-analytics-widget/tickets-analytics-widget.component';
import { TicketsPriority } from '../../setting/ticket-settings-page/tickets-priority/class/tickets-priority';
import { fadeInAnimation } from 'src/app/animations';

@Component({
  selector: 'tickets-dashboard',
  templateUrl: './tickets-dashboard.component.html',
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
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
  ticketsPriorities: Array<TicketsPriority> = [];
  constructor(
    public cd: ChangeDetectorRef,
    private ticketsStateService: TicketsStateService,
    private ticketsService: TicketsService,) { }

  ngOnInit() {
    this.ticketsStateService.onChangeLeftPanelFilter("DASHBOARD");
    if (this.ticketsStateService.getTicketsPriorities().length === 0) {
      this.ticketsService.getTicketsPriorities().subscribe((data: any) => {
        this.ticketsPriorities = data.priorityLevels.map(item => new TicketsPriority(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
          1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
        this.ticketsStateService.onSetTicketsPriorities(this.ticketsPriorities);
        this.getCounts();
      })
    } else {
      this.ticketsPriorities = this.ticketsStateService.getTicketsPriorities();
      this.getCounts();
    }

  }
  onSelectInterval(item) {
    this.currentInterval = item;
    this.dashboardTicketsStats.onSetDates(item.value);
    this.getCounts();
  }
  private getCounts() {
    this.ticketsService.getCounts(this.dashboardTicketsStats.getDataForPriorityCounts(this.ticketsPriorities)).subscribe(data => {
      this.dashboardTicketsStats.setData(data, this.ticketsPriorities);
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
