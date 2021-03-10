import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { TechTicketReport } from '../../class/tech-ticket-report';

@Component({
  selector: 'tech-ticket-report',
  templateUrl: './tech-ticket-report.component.html',
  styleUrls: ['./tech-ticket-report.component.css']
})
export class TechTicketReportComponent implements OnInit {

  chartOptions;
  chartNoDataAvailable;
  chartOptionsToggler;
  chartData = [];
  chartHeight = 400;
  loadingInProgress: boolean = false;
  onInit: boolean = false;

  currentCompany;
  chartColors = ["#16a4fa", "#ffb937", "#ff6e61", "#2ec866", "#f9f916", "#ff1ed2", "#1bf4fc", "#7d1a9e", '#7f1313'];
  techTicketReport: TechTicketReport = new TechTicketReport();
  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    this.chartOptions = {
      chart: {
        type: 'multiBarHorizontalChart',
        height: this.chartHeight,
        margin: { left: 150 },
        x: function (d) {
          return d.label;
        },
        y: function (d) {

          return d.value;
        },
        showControls: false,
        showValues: true,
        duration: 500,
        xAxis: {
          showMaxMin: false,
        },
        multibar: {
          valueFormat: function (n) {
            console.log(n);
            return d3.format(',f')(n);
          }
        },
        yAxis: {
          tickFormat: function (d) {

            return d3.format('')(d);
          }
        },
      }
    };
    this.chartNoDataAvailable = {
      chart: Object.assign({}, this.chartOptions.chart)
    };

    this.chartNoDataAvailable.chart.tooltip = {
      contentGenerator: function () {
        return '<table><tr><td>No data available</td></tr></table>';
      },
    };
  }
  public getReport(data) {

    this.techTicketReport = new TechTicketReport(JSON.parse(JSON.stringify(data)));
    console.log("this.techTicketReport", this.techTicketReport);
    this.chartData = [];
    if (this.techTicketReport.lines.length > 0) {
      var valueClosed = [];
      for (var i = 0; i < this.techTicketReport.lines.length; i++) {
        var nameAndData = {
          "label": this.techTicketReport.lines[i].fullName,
          "value": this.techTicketReport.lines[i].closed
        };
        valueClosed.push(nameAndData)
      }
      var object1 = {
        "key": "Closed",
        "color": "#d62728",
        "values": valueClosed
      };

      var valueCreated = [];
      for (var i = 0; i < this.techTicketReport.lines.length; i++) {
        var nameAndData2 = {
          "label": this.techTicketReport.lines[i].fullName,
          "value": this.techTicketReport.lines[i].created
        };
        valueCreated.push(nameAndData2)
      }
      var object2 = {
        "key": "Created",
        "color": "#1f77b4",
        "values": valueCreated
      };
      this.chartHeightChange(this.techTicketReport);
      this.chartData.push(object1);
      this.chartData.push(object2);
      this.chartOptionsToggler = this.chartOptions;
    } else {
      this.chartOptionsToggler = this.chartNoDataAvailable;
    }
    this.onInit = true;
    console.log("this.chartData", this.chartData);
  }

  public getDateForHeader(data) {
    return moment(new Date(data)).format('MMM DD, YYYY');
  }
  chartHeightChange(techData) {
    var calculatedHeight;
    if (techData) {
      calculatedHeight = 30 * (techData.lines.length + 5);
    } else {
      calculatedHeight = 400;
    }
    this.chartHeight = calculatedHeight;
  }
  toFixedPrice(value) {
    return value.toFixed(2);
  }
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }

}
