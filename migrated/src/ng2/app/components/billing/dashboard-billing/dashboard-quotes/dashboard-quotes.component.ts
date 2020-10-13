import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-quotes',
  templateUrl: './dashboard-quotes.component.html',
  styleUrls: ['./dashboard-quotes.component.scss']
})
export class DashboardQuotesComponent implements OnInit {
  chartOptions: any;
  chartColors = ["#0646a4", "#00ccff", '#2bc7c6'];
  constructor() { }

  ngOnInit() {
    this.chartOptions = {
      chart: {
        type: 'pieChart',
        height: 200,
        donut: true,
        x: (d: any) => { return d.label; },
        y: (d: any) => { return d.value; },
        showLabels: false,
        color: (d: any, i: any) => {
          return this.chartColors[i]
        },
        showLegend: false,
        duration: 500,
        legend: {
          margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        },
        donutRatio: '0.68'
      }
    }
  }

}
