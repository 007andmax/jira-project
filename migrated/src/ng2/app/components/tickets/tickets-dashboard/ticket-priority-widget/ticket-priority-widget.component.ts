import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DashboardTicketsStats } from '../class/dashboard-tickets-stats';

@Component({
  selector: 'app-ticket-priority-widget',
  templateUrl: './ticket-priority-widget.component.html',
  styleUrls: ['./ticket-priority-widget.component.scss']
})
export class TicketPriorityWidgetComponent implements OnInit {
  @Input() dashboardTicketsStats: DashboardTicketsStats = new DashboardTicketsStats();
  @ViewChild('nvd3') nvd3: any;
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
        valueFormat: (n) => {
          return n;
        },
        donut: true,
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
        "label": "High",
        "value": this.dashboardTicketsStats.HIGH
      },
      {
        "label": "Medium",
        "value": this.dashboardTicketsStats.MEDIUM
      },
      {
        "label": "Low",
        "value": this.dashboardTicketsStats.LOW
      }
    ];
  }
  public updateDataChart() {
    this.setDataForChart();
    if (this.nvd3.char) this.nvd3.chart.update();
  }
  getTotal() {
    return this.dashboardTicketsStats.HIGH + this.dashboardTicketsStats.MEDIUM + this.dashboardTicketsStats.LOW;
  }
}
