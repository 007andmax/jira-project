import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DashboardTicketsStats } from '../class/dashboard-tickets-stats';

import { DashboardTicketsTime } from '../class/dashboard-tickets-time';

@Component({
  selector: 'app-recurring-ticket-widget',
  templateUrl: './recurring-ticket-widget.component.html',
  styleUrls: ['./recurring-ticket-widget.component.scss']
})
export class RecurringTicketWidgetComponent implements OnInit {
  @ViewChild('nvd3') nvd3: any;
  @Input() dashboardTicketsStats: DashboardTicketsStats = new DashboardTicketsStats();
  chartOptions: any;
  chartColors = ["#0646a4", "#00ccff", '#2bc7c6'];
  data: any;

  constructor() { }

  ngOnInit() {
    this.chartOptions = {
      chart: {
        type: 'pieChart',
        height: 180,
        width: 180,
        margin: {
          top: -5,
          right: -5,
          bottom: -5,
          left: -5
        },
        donut: true,
        valueFormat: (n) => {
          return n;
        },
        x: (d: any) => { return d.label; },
        y: (d: any) => { return d.value; },
        showLabels: false,
        color: (d: any, i: any) => {
          return this.chartColors[i]
        },
        showLegend: false,
        duration: 500,

        donutRatio: '0.68'
      }
    }
  }
  setDataForChart() {
    this.data = [
      {
        "label": "Recurring Open Tickets",
        "value": this.dashboardTicketsStats.RECURRING_TICKETS_OPEN
      },
      {
        "label": "Recurirng Close Tickets",
        "value": this.dashboardTicketsStats.RECURRING_TICKETS_CLOSED
      },
    ];
  }
  public updateDataChart() {
    this.setDataForChart();
    if (this.nvd3.char) this.nvd3.chart.update();
  }
  getTotal() {
    return this.dashboardTicketsStats.RECURRING_TICKETS_OPEN + this.dashboardTicketsStats.RECURRING_TICKETS_CLOSED;
  }
}
