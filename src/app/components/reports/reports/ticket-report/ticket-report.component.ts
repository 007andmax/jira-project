import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TicketsReport } from '../../class/tickets-reports';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import * as moment from "moment";
import { Company } from 'src/app/interfaces/company/company';
import { User } from 'src/app/components/users/class/user';
@Component({
  selector: 'app-ticket-report',
  templateUrl: './ticket-report.component.html',
  styleUrls: ['./ticket-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TicketReportComponent implements OnInit, OnDestroy {
  ticketsReport: TicketsReport = new TicketsReport();
  loadingInProgress: boolean = false;
  onInit = false;
  currentCompany: Company;
  techUser: User;
  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService,
    private usersStateService: UsersStateService,) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
  }
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  public getReport(data) {
    this.ticketsReport.setData(data);
    this.ticketsReport.startDate = moment(new Date(this.ticketsReport.startDate)).format('ll');
    this.ticketsReport.endDate = moment(new Date(this.ticketsReport.endDate)).format('ll');
    this.techUser = this.usersStateService.getAllUsers().find(item => item.id === this.ticketsReport.userId);
    this.onInit = true;
  }
  public getDateForHeader(data) {
    return moment(new Date(data)).format('MMM DD, YYYY');
  }
  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {

  }
}
