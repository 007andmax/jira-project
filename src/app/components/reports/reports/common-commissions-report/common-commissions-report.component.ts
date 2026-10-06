
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CommonCommissionsReport } from '../../class/common-commissions-report';
import * as moment from "moment";
import { ReportMenuComponent } from '../../report-menu/report-menu.component';
import { ToFixedPipe } from 'src/app/pipe/to-fixed/to-fixed.pipe';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  standalone: true,
  imports: [ReportMenuComponent, CommonModule, ToFixedPipe, NgxChartsModule],
  selector: 'common-commissions-report',
  templateUrl: './common-commissions-report.component.html',
  styleUrls: ['./common-commissions-report.component.css'],

})
export class CommonCommissionsReportComponent implements OnInit {
  byCustomerChartData;
  byCategoriesChartData;
  loadingInProgress: boolean = false;
  onInit: boolean = false;
  showCategoriesData = true;
  currentCompany;
  selectedCompany;
  chartColors = {
    domain: ["#16a4fa", "#ffb937", "#ff6e61", "#2ec866", "#f9f916", "#ff1ed2", "#1bf4fc", "#7d1a9e", '#7f1313']
  };
  commonCommissionsReport: CommonCommissionsReport = new CommonCommissionsReport();
  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();

  }
  public getReport(data) {
    this.showCategoriesData = true;
    this.commonCommissionsReport = new CommonCommissionsReport(JSON.parse(JSON.stringify(data)));
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.commonCommissionsReport.companyId);
    let categories = this.commonCommissionsReport.categorySalesValue;
    if (!categories || !Object.keys(categories).length) {
      categories = { 'No data available': '1' };
      this.showCategoriesData = false;
    }
    this.byCategoriesChartData = Object.keys(categories)
      .map((key, i) => {
        return {
          name: key,
          value: categories[key],
          color: this.chartColors[i],
        };
      })
      .sort((a, b) => {
        return +b.value - +a.value;
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
          value: el.totalSum,
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
  public getDateForHeader(data) {
    return moment(data).format('DD MMM YYYY');
  }
  public trackByIndex(index, item) {
    return index;
  }
}
