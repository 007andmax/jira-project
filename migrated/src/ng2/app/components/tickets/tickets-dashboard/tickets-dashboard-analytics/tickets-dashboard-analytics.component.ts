import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { DashboardChartData } from '../../../billing/dashboard-billing/class/dashboard-chart-data';
import { CompanySetting } from '../../../companies/class/company-setting';

@Component({
  selector: 'app-tickets-dashboard-analytics',
  templateUrl: './tickets-dashboard-analytics.component.html',
  styleUrls: ['./tickets-dashboard-analytics.component.scss']
})
export class TicketsDashboardAnalyticsComponent implements OnInit {
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
  }
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
