import { ReportMenuComponent } from './';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TechTicketReport } from '../../class/tech-ticket-report';

@Component({
  standalone: true,
  imports: [ReportMenuComponent, CommonModule],
    selector: 'tech-ticket-report',
    templateUrl: './tech-ticket-report.component.html',
    styleUrls: ['./tech-ticket-report.component.css'],
    standalone: true
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
