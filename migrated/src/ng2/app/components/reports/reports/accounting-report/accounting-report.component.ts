import { Component, OnInit } from '@angular/core';
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
  company:any;
  accountingReport: AccountingReport = new AccountingReport();
  constructor(private companiesStateService:CompaniesStateService) { }

  ngOnInit() {
  }
  public onRequest(data) {
    this.loadingInProgress = data;
    //  this.cd.detectChanges();
  }
  public checkExistPayments() {
   return this.accountingReport.list.find(item => item.type === 'PAYMENT');
  }
  public getReport(data) {
    console.log("data", data);
    this.accountingReport.setData(JSON.parse(JSON.stringify(data)));
    this.company = this.companiesStateService.getCompanies().find(item => item.id === this.accountingReport.companyId);
    // this.techUser = this.usersStateService.getAllUsers().find(item => item.id === this.techService.techUserId);
    this.onInit = true;
    console.log("this.accountingReport", this.accountingReport);
  }
  public getDate(date) {
   
    return moment((date) ? new Date(date) : new Date()).format('DD/MM/YYYY');
  }
  public getDateForHeader(data) {
    return moment(new Date(data)).format('MMM DD, YYYY');
  }
}
