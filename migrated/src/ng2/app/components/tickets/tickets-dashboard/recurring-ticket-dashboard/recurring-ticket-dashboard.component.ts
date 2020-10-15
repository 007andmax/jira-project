import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-recurring-ticket-dashboard',
  templateUrl: './recurring-ticket-dashboard.component.html',
  styleUrls: ['./recurring-ticket-dashboard.component.scss']
})
export class RecurringTicketDashboardComponent implements OnInit {

  @ViewChild('nvd3') nvd3:any;
  chartOptions: any;
  chartColors = ["#0646a4", "#00ccff", '#2bc7c6'];
  data: any;

  constructor( ) { }

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
    this.data = [
      {
        "label": "Invoiced",
        "value": 8
      },
      {
        "label": "Collected",
        "value": 32
      },
      {
        "label": "Outstanding",
        "value": 60
      }
    ];
    

  }
  




}
