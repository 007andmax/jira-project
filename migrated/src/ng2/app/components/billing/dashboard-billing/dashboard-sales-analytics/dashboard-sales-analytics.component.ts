import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CompanySetting } from '../../../companies/class/company-setting';
import { DashboardChartData } from '../class/dashboard-chart-data';
import * as moment from "moment";

@Component({
  selector: 'app-dashboard-sales-analytics',
  templateUrl: './dashboard-sales-analytics.component.html',
  styleUrls: ['./dashboard-sales-analytics.component.scss']
})
export class DashboardSalesAnalyticsComponent implements OnInit {
  @Output() onSelectType = new EventEmitter<any>();
  @Input() chartData: Array<DashboardChartData> = [];
  type: string = "WEEKLY";
  @ViewChild('nvd3') nvd3: any;
  options;
  data;
  listType: Array<CompanySetting> = [
    new CompanySetting('Daily', 'DAILY'),
    new CompanySetting('Weekly', 'WEEKLY'),
    new CompanySetting('Monthly', 'MONTHLY')];
  /*Random Data Generator */

  constructor() { }

  ngOnInit() {
    this.listType[1].selected = true;
    let currentDate = new Date();
    this.options = {
      chart: {
        type: 'lineChart',
        height: 300,
        duration: 1000,
        margin: {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55
        },
        x: (d) => d.x,
        y: (d) => d.y,
        useInteractiveGuideline: true,
        showXAxis: true,
        xAxis: {
          axisLabel: '',
          tickFormat: (d) => {

            if (this.type === "MONTHLY") {
              if (currentDate.getFullYear() === new Date(this.chartData[d].date).getFullYear()) {
                return moment(this.chartData[d].date).format('MMM');
              } else {
                return moment(this.chartData[d].date).format('MMM YYYY');
              }

            }
            if (this.type === "WEEKLY" || this.type === "DAILY") return moment(this.chartData[d].date).format('DD MMM');


          },
          showMaxMin: false,
          staggerLabels: false,
          axisLabelDistance: 0,
          ticks: 10,
        },
        yAxis: {
          axisLabel: '',

          axisLabelDistance: -10
        }
      },
      legend: {
        css: {
          'text-align': 'left',
          'margin': '10px 13px 0px 7px',
          className: "test-class-tamara"
        }
      },
      title: {
        enable: false,

      },
      subtitle: {
        enable: false,

      },
      caption: {
        enable: false,

      }
    };
    this.updateDataChart();
  }
  public updateDataChart() {
    this.data = this.getDataForChart();
    if (this.nvd3.char) this.nvd3.chart.update();
  }
  getDataForChart() {
    let sin = [], sin2 = [];
    this.chartData = this.chartData.splice(this.chartData.length - 30, this.chartData.length);
    //  this.chartData = JSON.parse(JSON.stringify(this.chartData.reverse()));
    //Data is represented as an array of {x,y} pairs.
    for (let i = 1; i < 30; i++) {
      sin.push({ x: i, y: this.chartData[i].totalSales });
      sin2.push({ x: i, y: this.chartData[i].totalReceivable });
    }

    //Line chart data should be sent as an array of series objects.
    return [
      {
        values: sin,      //values - represents the array of {x,y} data points
        key: 'Sales', //key  - the name of the series.
        color: '#0747a6'  //color - optional: choose your own line color.
      },
      {
        values: sin2,      //values - represents the array of {x,y} data points
        key: 'Revenue', //key  - the name of the series.
        color: '#00ccff'  //color - optional: choose your own line color.
      },
    ];
  };
  selectType(type) {
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
