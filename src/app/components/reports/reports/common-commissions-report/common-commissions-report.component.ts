import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CommonCommissionsReport } from '../../class/common-commissions-report';

@Component({
  selector: 'common-commissions-report',
  templateUrl: './common-commissions-report.component.html',
  styleUrls: ['./common-commissions-report.component.css']
})
export class CommonCommissionsReportComponent implements OnInit {
  chartOptions;
  chartNoDataAvailable;
  chartOptionsToggler;
  byCustomerChartData;
  byCategoriesChartData;
  loadingInProgress: boolean = false;
  onInit: boolean = false;
  showCategoriesData = true;
  currentCompany;
  chartColors = ["#16a4fa", "#ffb937", "#ff6e61", "#2ec866", "#f9f916", "#ff1ed2", "#1bf4fc", "#7d1a9e", '#7f1313'];
  commonCommissionsReport: CommonCommissionsReport = new CommonCommissionsReport();
  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    this.chartOptions = {
      chart: {
        type: 'pieChart',
        height: 350,
        donut: true,
        x: (d) => { return d.name; },
        y: (d) => { return d.time; },
        showLabels: false,
        color: (d, i) => {
          return this.chartColors[i]
        },
        pie: {
          startAngle: (d) => { return d.startAngle },
          endAngle: (d) => { return d.endAngle }
        },
        showLegend: false,
        duration: 500,
        legend: {
          margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      }
    }
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
    this.showCategoriesData = true;
    this.commonCommissionsReport = new CommonCommissionsReport(JSON.parse(JSON.stringify(data)));
    let categories = this.commonCommissionsReport.categorySalesValue;
    if (!categories || !Object.keys(categories).length) {
      categories = { 'No data available': '1' };

      this.showCategoriesData = false;
      this.chartOptionsToggler = this.chartNoDataAvailable;
    } else {
      this.chartOptionsToggler = this.chartOptions;

    }
    this.byCategoriesChartData = Object.keys(categories)
      .map((key, i) => {
        return {
          name: key,
          time: categories[key],
          color: this.chartColors[i],
        };
      })
      .sort((a, b) => {
        return +b.time - +a.time;
      })
      .slice(0, 4);
    this.byCustomerChartData = this.commonCommissionsReport.lines
      .sort((a, b) => {
        return +b.totalSum - a.totalSum;
      })
      .slice(0, 4)
      .map((el, i) => {
        return {
          name: el.companyName,
          time: el.totalSum,
          color: this.chartColors[i],
        };
      });
    //  this.techUser = this.usersStateService.getAllUsers().find(item => item.id === this.techService.techUserId);
    this.onInit = true;
  }
  toFixedPrice(value) {
    return value.toFixed(2);
  }
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  public trackByIndex(index, item) {
    return index;
  }
}
