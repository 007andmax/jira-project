
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DetailedCommissionsReport } from '../../class/detailed-commissions-report';
import * as moment from "moment";
import { ReportMenuComponent } from '../../report-menu/report-menu.component';
import { ToFixedPipe } from 'src/app/pipe/to-fixed/to-fixed.pipe';

@Component({
  standalone: true,
  imports: [ReportMenuComponent, CommonModule, ToFixedPipe],
  selector: 'detailed-commissions-report',
  templateUrl: './detailed-commissions-report.component.html',
  styleUrls: ['./detailed-commissions-report.component.css'],

})
export class DetailedCommissionsReportComponent implements OnInit {
  loadingInProgress: boolean = false;
  onInit: boolean = false;
  currentCompany;
  selectedCompany;
  detailedCommissionsReport: DetailedCommissionsReport = new DetailedCommissionsReport();
  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
  }
  public getReport(data) {
    this.detailedCommissionsReport = new DetailedCommissionsReport(JSON.parse(JSON.stringify(data)));
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.detailedCommissionsReport.companyId);
    //  this.techUser = this.usersStateService.getAllUsers().find(item => item.id === this.techService.techUserId);
    this.onInit = true;
  }
  toFixedPrice(value) {
    return value.toFixed(2);
  }
  public trackByIndex(index, item) {
    return index;
  }
  public getDateForHeader(data) {
    return moment(data).format('DD MMM YYYY');
  }
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
}
