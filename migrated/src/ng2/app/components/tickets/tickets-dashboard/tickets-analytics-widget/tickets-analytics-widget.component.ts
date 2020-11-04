import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { DashboardChartData } from '../../../billing/dashboard-billing/class/dashboard-chart-data';
import { CompanySetting } from '../../../companies/class/company-setting';
import { DashboardTickets } from '../class/dashboard-tickets';

@Component({
  selector: 'app-tickets-analytics-widget',
  templateUrl: './tickets-analytics-widget.component.html',
  styleUrls: ['./tickets-analytics-widget.component.scss']
})
export class TicketsAnalyticsWidgetComponent implements OnInit {
  @Output() onSelectType = new EventEmitter<any>();
 
  type: string = "WEEKLY";
  @ViewChild('nvd3') nvd3: any;
  options;
  data;
  dashboard: DashboardTickets;
  listType: Array<CompanySetting> = [
    new CompanySetting('Daily', 'DAILY'),
    new CompanySetting('Weekly', 'WEEKLY'),
    new CompanySetting('Monthly', 'MONTHLY')];
  constructor(private ticketsService:TicketsService) { }

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
            if (d >= this.dashboard.chartData.length) return "";
            if (this.type === "MONTHLY") {
              if (currentDate.getFullYear() === new Date(this.dashboard.chartData[d].date).getFullYear()) {
                return moment(this.dashboard.chartData[d].date).format('MMM');
              } else {
                return moment(this.dashboard.chartData[d].date).format('MMM YYYY');
              }
            }
            if (this.type === "WEEKLY" || this.type === "DAILY") return moment(this.dashboard.chartData[d].date).format('DD MMM');
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
    this.getDashboard();
  }
  public updateDataChart() {
    this.data = this.getDataForChart();
    if (this.nvd3.char) this.nvd3.chart.update();
  }
  getDataForChart() {
    let sin = [], sin2 = [];
    this.dashboard.chartData= this.dashboard.chartData.splice(this.dashboard.chartData.length - 30,this.dashboard.chartData.length);
  //  this.chartData = JSON.parse(JSON.stringify(this.chartData.reverse()));
    //Data is represented as an array of {x,y} pairs.
    for (let i = 1; i < 30; i++) {
      sin.push({ x: i, y: this.dashboard.chartData[i].totalTickets });
      sin2.push({ x: i, y: this.dashboard.chartData[i].completedTickets });
    }

    //Line chart data should be sent as an array of series objects.
    return [
      {
        values: sin,      //values - represents the array of {x,y} data points
        key: 'totalTickets', //key  - the name of the series.
        color: '#0747a6'  //color - optional: choose your own line color.
      },
      {
        values: sin2,      //values - represents the array of {x,y} data points
        key: 'completedTickets', //key  - the name of the series.
        color: '#00ccff'  //color - optional: choose your own line color.
      },
    ];
  };
  getDashboard() {
    this.ticketsService.getDashboard(this.type).subscribe(data => {
      console.log("data",data);
      this.dashboard = data;
      this.updateDataChart();
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
