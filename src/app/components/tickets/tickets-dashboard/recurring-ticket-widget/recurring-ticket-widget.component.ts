import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DashboardTicketsStats } from '../class/dashboard-tickets-stats';
import { PieChartModule } from '@swimlane/ngx-charts';

@Component({
    selector: 'app-recurring-ticket-widget',
    templateUrl: './recurring-ticket-widget.component.html',
    styleUrls: ['./recurring-ticket-widget.component.scss'],
    standalone: true,
    imports: [PieChartModule]
})
export class RecurringTicketWidgetComponent implements OnInit {
  @ViewChild('nvd3', { static: true }) nvd3: any;
  @Input() dashboardTicketsStats: DashboardTicketsStats = new DashboardTicketsStats();
  chartColors = { domain: ["#0646a4", "#00ccff", '#2bc7c6'] };
  data: any;
  constructor() { }

  ngOnInit() {
  }
  setDataForChart() {
    this.data = [
      {
        "name": "Recurring Open Tickets",
        "value": this.dashboardTicketsStats.RECURRING_TICKETS_OPEN
      },
      {
        "name": "Recurirng Close Tickets",
        "value": this.dashboardTicketsStats.RECURRING_TICKETS_CLOSED
      },
    ];
  }
  public updateDataChart() {
    this.setDataForChart();
    // if (this.nvd3.char) this.nvd3.chart.update();
  }
  getTotal() {
    return this.dashboardTicketsStats.RECURRING_TICKETS_OPEN + this.dashboardTicketsStats.RECURRING_TICKETS_CLOSED;
  }
}
