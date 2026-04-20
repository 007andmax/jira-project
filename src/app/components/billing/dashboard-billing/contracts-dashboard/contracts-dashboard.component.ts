import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ContractsDashboard } from '../class/contracts-dashboard';
import { PieChartModule } from '@swimlane/ngx-charts';

@Component({
    selector: 'app-contracts-dashboard',
    templateUrl: './contracts-dashboard.component.html',
    styleUrls: ['./contracts-dashboard.component.scss'],
    standalone: true,
    imports: [PieChartModule]
})
export class ContractsDashboardComponent implements OnInit {
  @Input() contractsDashboard: ContractsDashboard = new ContractsDashboard();
  @ViewChild('nvd3', { static: true }) nvd3: any;
  chartColors = { domain: ["#0747a6", "#00ccff", "#cdecff", "#052e6b"] };
  data: any;
  constructor() { }

  ngOnInit() {
    this.data = [
      {
        "name": "On Going",
        "value": this.contractsDashboard.CURRENT
      },
      {
        "name": "Expiring",
        "value": this.contractsDashboard.EXPIRED
      },
      {
        "name": "Terminated",
        "value": this.contractsDashboard.TERMINATED
      },
      {
        "name": "Pending",
        "value": this.contractsDashboard.PENDING
      }
    ];
  }
  public updateData() {
    // this.nvd3.chart.update();
  }

}
