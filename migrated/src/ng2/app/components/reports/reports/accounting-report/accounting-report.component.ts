import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AccountingReport } from '../../class/accounting-report';
import * as moment from 'moment';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
@Component({
  selector: 'app-accounting-report',
  templateUrl: './accounting-report.component.html',
  styleUrls: ['./accounting-report.component.scss']
})
export class AccountingReportComponent implements OnInit {
  loadingInProgress: boolean = false;
  onInit = false;
  company: any;
  accountingReport: AccountingReport = new AccountingReport();
  constructor(private companiesStateService: CompaniesStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
  }
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  public checkExistPayments() {
    return this.accountingReport.list.find(item => item.type === 'PAYMENT');
  }
  public getReport(data) {
    this.accountingReport.setData(JSON.parse(JSON.stringify(data)));
    this.company = this.companiesStateService.getCompanies().find(item => item.id === this.accountingReport.companyId);
    this.onInit = true;
  }
  public getDate(date) {
    return moment((date) ? new Date(date) : new Date()).format('DD/MM/YYYY');
  }
  public getDateForHeader(data) {
    return moment(new Date(data)).format('MMM DD, YYYY');
  }
}
