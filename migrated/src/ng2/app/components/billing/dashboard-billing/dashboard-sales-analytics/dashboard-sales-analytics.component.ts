import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-sales-analytics',
  templateUrl: './dashboard-sales-analytics.component.html',
  styleUrls: ['./dashboard-sales-analytics.component.scss']
})
export class DashboardSalesAnalyticsComponent implements OnInit {

  options;
  data;

  /*Random Data Generator */
  sinAndCos() {
    var sin = [], sin2 = [],
      cos = [];

    //Data is represented as an array of {x,y} pairs.
    for (var i = 0; i < 100; i++) {
      sin.push({ x: i, y: Math.sin(i / 10) });
      sin2.push({ x: i, y: i % 10 == 5 ? null : Math.sin(i / 10) * 0.25 + 0.5 });
      cos.push({ x: i, y: .5 * Math.cos(i / 10 + 2) + Math.random() / 10 });
    }

    //Line chart data should be sent as an array of series objects.
    return [
      {
        values: sin,      //values - represents the array of {x,y} data points
        key: 'Sine Wave', //key  - the name of the series.
        color: '#ff7f0e'  //color - optional: choose your own line color.
      },
      
    ];
  };
  constructor() { }

  ngOnInit() {
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
        x: function (d) { return d.x; },
        y: function (d) { return d.y; },
        useInteractiveGuideline: true,
        dispatch: {
          stateChange: function (e) { console.log("stateChange"); },
          changeState: function (e) { console.log("changeState"); },
          tooltipShow: function (e) { console.log("tooltipShow"); },
          tooltipHide: function (e) { console.log("tooltipHide"); }
        },
        showXAxis: true,
        xAxis: {
          axisLabel: ''
        },
        yAxis: {
          axisLabel: '',
          tickFormat: function (d) {
            return d3.format('.02f')(d);
          },
          axisLabelDistance: -10
        },
        callback: function (chart) {
          console.log("chart",chart);
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
    this.data = this.sinAndCos();
  }

}
