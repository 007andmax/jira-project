import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { RemoteConnectionReport } from '../../class/remote-connection-report';

@Component({
  selector: 'remote-connection-report',
  templateUrl: './remote-connection-report.component.html',
  styleUrls: ['./remote-connection-report.component.css']
})
export class RemoteConnectionReportComponent implements OnInit {

  loadingInProgress: boolean = false;
  onInit: boolean = false;
  selectedClient;
  remoteConnectionReport: RemoteConnectionReport = new RemoteConnectionReport();
  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {

  }
  public getReport(data) {
    this.remoteConnectionReport = new RemoteConnectionReport(JSON.parse(JSON.stringify(data)));
    this.selectedClient = this.companiesStateService.getCompanies().find(item => item.id === this.remoteConnectionReport.companyId);
    this.onInit = true;
  }
  public parseDate(data) {
    return new Date(data);
  }
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }

}
