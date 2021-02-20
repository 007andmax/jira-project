import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { DetailedCommissionsReport } from '../../class/detailed-commissions-report';

@Component({
  selector: 'detailed-commissions-report',
  templateUrl: './detailed-commissions-report.component.html',
  styleUrls: ['./detailed-commissions-report.component.css']
})
export class DetailedCommissionsReportComponent implements OnInit {
  loadingInProgress: boolean = false;
  onInit: boolean = false;
  currentCompany;
  detailedCommissionsReport: DetailedCommissionsReport = new DetailedCommissionsReport();
  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
  }
  public getReport(data) {
    this.detailedCommissionsReport = new DetailedCommissionsReport(JSON.parse(JSON.stringify(data)));
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
}
