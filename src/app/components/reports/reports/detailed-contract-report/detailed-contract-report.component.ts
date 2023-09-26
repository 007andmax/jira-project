import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DetailContractreport } from '../../class/detail-contract-report';

@Component({
  selector: 'detailed-contract-report',
  templateUrl: './detailed-contract-report.component.html',
  styleUrls: ['./detailed-contract-report.component.scss']
})
export class DetailedContractReportComponent implements OnInit {
  loadingInProgress: boolean = false;
  onInit: boolean = false;
  selectedClient = null;
  detailContractReport: DetailContractreport = new DetailContractreport();
  constructor(public cd: ChangeDetectorRef) { }

  ngOnInit() {
  }
  onSelectedClient(client) {
    this.selectedClient = client;
  }
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  public getReport(data) {
    this.detailContractReport = data;
    //  this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.detailedCommissionsReport.companyId);
    //  this.techUser = this.usersStateService.getAllUsers().find(item => item.id === this.techService.techUserId);
    this.onInit = true;
  }
}
