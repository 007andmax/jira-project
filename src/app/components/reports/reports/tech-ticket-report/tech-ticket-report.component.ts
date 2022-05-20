import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TechTicketReport } from '../../class/tech-ticket-report';

@Component({
  selector: 'tech-ticket-report',
  templateUrl: './tech-ticket-report.component.html',
  styleUrls: ['./tech-ticket-report.component.css']
})
export class TechTicketReportComponent implements OnInit {
  loadingInProgress: boolean = false;
  onInit: boolean = false;
  currentCompany;
  techTicketReport: TechTicketReport = new TechTicketReport();
  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
  }
  public getReport(data) {
    this.techTicketReport = new TechTicketReport(JSON.parse(JSON.stringify(data)));
    this.onInit = true;
  }

  public getDateForHeader(data) {
    return moment(new Date(data)).format('MMM DD, YYYY');
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
