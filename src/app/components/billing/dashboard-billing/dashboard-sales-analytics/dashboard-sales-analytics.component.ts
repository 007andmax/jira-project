import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CompanySetting } from '../../../companies/class/company-setting';
import { DashboardChartData } from '../class/dashboard-chart-data';
import * as moment from "moment";
import { LineChartModule } from '@swimlane/ngx-charts';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-dashboard-sales-analytics',
    templateUrl: './dashboard-sales-analytics.component.html',
    styleUrls: ['./dashboard-sales-analytics.component.scss'],
    standalone: true,
    imports: [NgbDropdownModule, NgbTooltipModule, NgFor, NgIf, LineChartModule, NgStyle]
})
export class DashboardSalesAnalyticsComponent implements OnInit {
  @Output() onSelectType = new EventEmitter<any>();
  @Input() chartData: Array<DashboardChartData> = [];
  type: string = "WEEKLY";
  @ViewChild('nvd3', { static: true }) nvd3: any;
  data;
  listType: Array<CompanySetting> = [
    new CompanySetting('Daily', 'DAILY'),
    new CompanySetting('Weekly', 'WEEKLY'),
    new CompanySetting('Monthly', 'MONTHLY')];
  showPreloader: boolean = true;
  chartColors = { domain: ["#0747a6", "#00ccff"] };
  constructor() { }

  ngOnInit() {
    this.listType[1].selected = true;
    this.updateDataChart();
  }
  xAxisTickFormatting = (d) => {
    let currentDate = new Date();
    if (d >= this.chartData.length) return "";
    if (this.type === "MONTHLY") {
      if (currentDate.getFullYear() === new Date(this.chartData[d].date).getFullYear()) {
        return moment(this.chartData[d].date).format('MMM');
      } else {
        return moment(this.chartData[d].date).format('MMM YYYY');
      }

    }
    if (this.type === "WEEKLY" || this.type === "DAILY") return moment(this.chartData[d].date).format('DD MMM');

  }
  xAxisTickFormattingChart = (d) => {
    let currentDate = new Date();
    if (d >= this.chartData.length) return "";
    return moment(this.chartData[d].date).format('DD MMM YYYY');
  }
  public updateDataChart() {
    this.data = this.getDataForChart();
    // if (this.nvd3.char) this.nvd3.chart.update();
    this.showPreloader = false;
  }
  getDataForChart() {
    let sin = [], sin2 = [];
    this.chartData = (this.chartData.length > 30) ? this.chartData.splice(this.chartData.length - 30, this.chartData.length) : this.chartData;
    for (let i = 1; i < 30; i++) {
      if (i >= this.chartData.length) {
      } else {
        sin.push({ name: i, value: this.chartData[i].totalSales });
        sin2.push({ name: i, value: this.chartData[i].totalIncomeAmount });
      }
    }
    //Line chart data should be sent as an array of series objects.
    return [
      {
        series: sin,      //values - represents the array of {x,y} data points
        name: 'Sales', //key  - the name of the series.
      },
      {
        series: sin2,      //values - represents the array of {x,y} data points
        name: 'Revenue', //key  - the name of the series.
      },
    ];
  };
  selectType(type) {
    this.showPreloader = true;
    this.listType.forEach(item => {
      if (item.value === type) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    })
    this.onSelectType.emit(type);
    this.type = type;
  }
  getSelectedType() {
    return this.listType.find(item => item.selected).title;
  }
}
