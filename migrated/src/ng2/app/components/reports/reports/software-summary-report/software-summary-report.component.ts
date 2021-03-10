import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { SoftwareSummaryReport } from '../../class/software-summary-report';

@Component({
  selector: 'software-summary-report',
  templateUrl: './software-summary-report.component.html',
  styleUrls: ['./software-summary-report.component.css']
})
export class SoftwareSummaryReportComponent implements OnInit {
  loadingInProgress: boolean = false;
  onInit: boolean = false;
  company: any;
  softwareSummaryReport: SoftwareSummaryReport = new SoftwareSummaryReport();
  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {

  }
  public getReport(data) {
    this.loadingInProgress = true;
    this.softwareSummaryReport = new SoftwareSummaryReport(JSON.parse(JSON.stringify(data)));
    this.company = this.companiesStateService.getCompanies().find(item => item.id == this.softwareSummaryReport.companyId);
    if (this.softwareSummaryReport.deviceId) this.softwareSummaryReport.devices = this.softwareSummaryReport.devices.filter((item) => item.id === this.softwareSummaryReport.deviceId);
    this.softwareSummaryReport.devices.map((item) => {
      if (item.report && item.report && item.report.softList) {
        item.report.softList.map((soft) => {
          return this.softwareSummaryReport.list.push({
            device: item.hostName,
            softwareTitle: soft.softName,
            installationKey: '',
            publisher: soft.softPublisher,
            version: (soft.softName === "Windows") ? `${item.report.system.caption} ${item.report.system.release_id} ${item.report.system.architecture} ${item.report.system.service_pack}` : soft.softVersion,
            installDate: soft.softInstalledOn
          });
        });
      }
    });
    if (this.softwareSummaryReport.softwareSummarySoft) {
      const type = this.softwareSummaryReport.softwareSummarySoft.type;
      const name = this.softwareSummaryReport.softwareSummarySoft.name;
      this.softwareSummaryReport.list = this.softwareSummaryReport.list.filter((item) => {
        if (type === 'publisher') {
          return item.publisher === name;
        } else {
          return item.softwareTitle === name;
        }
      });
    }
    this.softwareSummaryReport.list = this.softwareSummaryReport.list.sort((a, b) => (a.device.toLowerCase() > b.device.toLowerCase() || a.softwareTitle.toLowerCase() > b.softwareTitle.toLowerCase()) ?
      1 : ((b.device.toLowerCase() > a.device.toLowerCase() || b.softwareTitle.toLowerCase() > a.softwareTitle.toLowerCase()) ? -1 : 0));
    setTimeout(() => {
      this.onInit = true;
      this.loadingInProgress = false;
      this.cd.detectChanges();

    }, 1000);
  }
}
