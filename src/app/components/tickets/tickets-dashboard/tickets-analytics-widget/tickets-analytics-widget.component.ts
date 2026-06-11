import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { CompanySetting } from '../../../companies/class/company-setting';
import { DashboardTickets } from '../class/dashboard-tickets';
import { LineChartModule } from '@swimlane/ngx-charts';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-tickets-analytics-widget',
    templateUrl: './tickets-analytics-widget.component.html',
    styleUrls: ['./tickets-analytics-widget.component.scss'],
    standalone: true,
    imports: [NgbDropdownModule, NgFor, NgIf, LineChartModule, NgStyle]
})
export class TicketsAnalyticsWidgetComponent implements OnInit {
  @Output() onTicketsAnalyticsReady = new EventEmitter<any>();
  isReady: boolean = false;
  type: string = "WEEKLY";
  @ViewChild('nvd3', { static: true }) nvd3: any;
  data;
  dashboard: DashboardTickets;
  listType: Array<CompanySetting> = [
    new CompanySetting('Daily', 'DAILY'),
    new CompanySetting('Weekly', 'WEEKLY'),
    new CompanySetting('Monthly', 'MONTHLY')];
  showPreloader: boolean = true;
  chartColors = { domain: ["#0747a6", "#00ccff"] };
  constructor(private ticketsService: TicketsService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.listType[1].selected = true;
    this.getDashboard();
  }
  public updateDataChart() {
    this.data = this.getDataForChart();
    //  if (this.nvd3.char) this.nvd3.chart.update();
    this.cd.detectChanges();
    this.isReady = true;
  }
  xAxisTickFormatting = (d) => {
    let currentDate = new Date();
    if (d >= this.dashboard.chartData.length) return "";
    if (this.type === "MONTHLY") {
      if (currentDate.getFullYear() === new Date(this.dashboard.chartData[d].date).getFullYear()) {
        return moment(this.dashboard.chartData[d].date).format('MMM');
      } else {
        return moment(this.dashboard.chartData[d].date).format('MMM YYYY');
      }
    }
    if (this.type === "WEEKLY" || this.type === "DAILY") return moment(this.dashboard.chartData[d].date).format('DD MMM');
  }
  xAxisTickFormattingChart = (d) => {
    if (d >= this.dashboard.chartData.length) return "";
    return moment(this.dashboard.chartData[d].date).format('DD MMM YYYY');
  }
  getDataForChart() {
    let sin = [], sin2 = [];
    this.dashboard.chartData = JSON.parse(JSON.stringify(this.dashboard.chartData.splice(this.dashboard.chartData.length - 30, this.dashboard.chartData.length)));
    for (let i = 1; i < (this.dashboard.chartData.length < 30 ? this.dashboard.chartData.length : 30); i++) {
      sin.push({ name: i, value: this.dashboard.chartData[i].totalTickets });
      sin2.push({ name: i, value: this.dashboard.chartData[i].completedTickets });
    }
    return [
      {
        series: sin,      //values - represents the array of {x,y} data points
        name: 'Created tickets', //key  - the name of the series.
      },
      {
        series: sin2,      //values - represents the array of {x,y} data points
        name: 'Completed tickets', //key  - the name of the series.
      },
    ];
  };
  getDashboard() {
    this.showPreloader = true;
    this.ticketsService.getDashboard(this.type).subscribe(data => {
      this.dashboard = data;
      if (this.isReady) this.updateDataChart();
      this.onTicketsAnalyticsReady.emit(null);
      this.showPreloader = false;
    }, (err) => {
      this.onTicketsAnalyticsReady.emit(null);
      this.showPreloader = false;
    })
  }
  selectType(type) {
    this.listType.forEach(item => {
      if (item.value === type) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    })
    this.type = type;
    this.getDashboard();
  }
  getSelectedType() {
    return this.listType.find(item => item.selected).title;
  }

}
