import { ReportMenuComponent } from './';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TechSalesReport } from '../../class/tech-sales-report';
import * as moment from 'moment';

@Component({
  standalone: true,
  imports: [ReportMenuComponent, CommonModule],
    selector: 'tech-sales-report',
    templateUrl: './tech-sales-report.component.html',
    styleUrls: ['./tech-sales-report.component.css'],
    standalone: true
})
export class TechSalesReportComponent implements OnInit {
  loadingInProgress: boolean = false;
  onInit: boolean = false;
  currentCompany;
  techSalesReport: TechSalesReport = new TechSalesReport();
  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
  }
  public getReport(data) {
    this.techSalesReport = new TechSalesReport(JSON.parse(JSON.stringify(data)));
    this.onInit = true;
  }

  public getDateForHeader(data) {
    return moment(data).format('DD MMM YYYY');
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
