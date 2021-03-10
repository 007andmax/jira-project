import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { TechSalesReport } from '../../class/tech-sales-report';
import * as moment from 'moment';

@Component({
  selector: 'tech-sales-report',
  templateUrl: './tech-sales-report.component.html',
  styleUrls: ['./tech-sales-report.component.css']
})
export class TechSalesReportComponent implements OnInit {

  chartOptions;
  chartNoDataAvailable;
  chartOptionsToggler;
  chartData = [];
  chartHeight = 400;
  loadingInProgress: boolean = false;
  onInit: boolean = false;

  currentCompany;
  chartColors = ["#16a4fa", "#ffb937", "#ff6e61", "#2ec866", "#f9f916", "#ff1ed2", "#1bf4fc", "#7d1a9e", '#7f1313'];
  techSalesReport: TechSalesReport = new TechSalesReport();
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
          showMaxMin: false
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
    this.techSalesReport = new TechSalesReport(JSON.parse(JSON.stringify(data)));
    this.chartData = [];
    if (this.techSalesReport.lines.length > 0) {
      if (this.techSalesReport.selectedType.type === "BILLED_TIME") {
        var billedTime = [];
        for (var i = 0; i < this.techSalesReport.lines.length; i++) {
          var nameAndData = {
            "label": this.techSalesReport.lines[i].fullName,
            "value": this.techSalesReport.lines[i].billedTime
          };
          billedTime.push(nameAndData)
        }
        var object1 = {
          "key": "Billed time",
          "color": "#d62728",
          "values": billedTime
        };
        this.chartHeightChange(this.techSalesReport);
        this.chartData.push(object1);
        /*IN CASE OF SECOND PARAMETER EXIST - ADD IT*/

      } else if (this.techSalesReport.selectedType.type === "PRODUCT_SOLD") {
        var totalSum = [];
        for (var i = 0; i < this.techSalesReport.lines.length; i++) {
          //var sum = reportData.lines[i].totalSum + '$';
          var nameAndData = {
            "label": this.techSalesReport.lines[i].fullName,
            "value": this.techSalesReport.lines[i].totalSum
          };
          totalSum.push(nameAndData)
        }
        var object1 = {
          "key": "total sum, $",
          "color": "#d62728",
          "values": totalSum
        };
        this.chartHeightChange(this.techSalesReport);
        this.chartData.push(object1);

        /*IN CASE OF SECOND PARAMETER EXIST - ADD IT*/

      }
      this.chartOptionsToggler = this.chartOptions;
    } else {
      this.chartOptionsToggler = this.chartNoDataAvailable;
    }
    this.onInit = true;
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
