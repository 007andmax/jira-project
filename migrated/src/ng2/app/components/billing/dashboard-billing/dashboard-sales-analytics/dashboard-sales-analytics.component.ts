import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CompanySetting } from '../../../companies/class/company-setting';
import { DashboardChartData } from '../class/dashboard-chart-data';

@Component({
  selector: 'app-dashboard-sales-analytics',
  templateUrl: './dashboard-sales-analytics.component.html',
  styleUrls: ['./dashboard-sales-analytics.component.scss']
})
export class DashboardSalesAnalyticsComponent implements OnInit {
  @Output() onSelectType = new EventEmitter<any>();
  @Input() chartData: Array<DashboardChartData> = [];
  @ViewChild('nvd3') nvd3:any;
  options;
  data;
  listType: Array<CompanySetting> = [new CompanySetting('Weekly', 'WEEKLY'),
  new CompanySetting('Daily', 'DAILY'),
  new CompanySetting('Monthly', 'MONTHLY')];
  /*Random Data Generator */

  constructor() { }

  ngOnInit() {
    this.listType[0].selected = true;
    this.options = {
      chart: {
        type: 'lineChart',
        height: 450,

        margin: {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55
        },
        x:   (d) =>{

          return d.x;
        },
        y:   (d)=> {
          return d.y;
        },
        useInteractiveGuideline: true,
         
        showXAxis: true,
        xAxis: {
          axisLabel: '',
          tickFormat:  (d) => {
            return this.chartData[this.chartData.length - d].date;
          },
          showMaxMin: false,
          staggerLabels: true,
          axisLabelDistance: -10
        },
        yAxis: {
          axisLabel: '',
          
          axisLabelDistance: -10
        },
        callback: function (chart) {
          console.log("chart", chart);
          console.log("!!! lineChart callback !!!");
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
    console.log("this.chartData", this.chartData);
   this.updateDataChart();
    console.log("this.data", this.data);
  }
  public updateDataChart() {
    this.data = this.getDataForChart();
    this.nvd3.chart.update();
  }
  getDataForChart() {
    let sin = [],sin2 = [];

    //Data is represented as an array of {x,y} pairs.
    for (let i = 1; i < 30; i++) {
      sin.push({ x: i, y: this.chartData[this.chartData.length - i].totalSales });
      sin2.push({ x: i, y: this.chartData[this.chartData.length - i].totalReceivable });
    }

    //Line chart data should be sent as an array of series objects.
    return [
      {
        values: sin,      //values - represents the array of {x,y} data points
        key: 'Total Sales', //key  - the name of the series.
        color: '#ff7f0e'  //color - optional: choose your own line color.
      },
      {
        values: sin2,      //values - represents the array of {x,y} data points
        key: 'Total Receivable', //key  - the name of the series.
        color: '#2ca02c'  //color - optional: choose your own line color.
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
  }
  getSelectedType() {
    return this.listType.find(item => item.selected).title;
  }
}
