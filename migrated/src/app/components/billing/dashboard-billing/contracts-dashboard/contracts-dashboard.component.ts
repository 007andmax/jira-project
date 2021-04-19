import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ContractsDashboard } from '../class/contracts-dashboard';

@Component({
  selector: 'app-contracts-dashboard',
  templateUrl: './contracts-dashboard.component.html',
  styleUrls: ['./contracts-dashboard.component.scss']
})
export class ContractsDashboardComponent implements OnInit {
  @Input() contractsDashboard: ContractsDashboard = new ContractsDashboard();
  @ViewChild('nvd3') nvd3:any;
  chartOptions: any;
  chartColors = ["#0747a6", "#00ccff", "#cdecff","#052e6b"];
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
        "label": "On Going",
        "value": this.contractsDashboard.CURRENT
      },
      {
        "label": "Expiring",
        "value": this.contractsDashboard.EXPIRED
      },
      {
        "label": "Terminated",
        "value": this.contractsDashboard.TERMINATED
      },
      {
        "label": "Pending",
        "value": this.contractsDashboard.PENDING
      }
    ];
  }
  public updateData() {
    this.nvd3.chart.update();
  }

}
