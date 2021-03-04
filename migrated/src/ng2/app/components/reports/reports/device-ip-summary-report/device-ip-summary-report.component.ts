import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { DeviceIpSummary } from '../../class/device-ip-summary';

@Component({
  selector: 'device-ip-summary-report',
  templateUrl: './device-ip-summary-report.component.html',
  styleUrls: ['./device-ip-summary-report.component.css']
})
export class DeviceIpSummaryReportComponent implements OnInit {

  loadingInProgress: boolean = false;
  onInit: boolean = false;
  company: any;
  deviceIpSummary: DeviceIpSummary = new DeviceIpSummary();
  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {

  }
  public getReport(data) {
    this.loadingInProgress = true;
    this.deviceIpSummary = new DeviceIpSummary(JSON.parse(JSON.stringify(data)));
    this.company = this.companiesStateService.getCompanies().find(item => item.id == this.deviceIpSummary.companyId);
    console.log("this.company", this.company);


    setTimeout(() => {
      this.onInit = true;
      this.loadingInProgress = false;
      this.cd.detectChanges();

    }, 1000);
    console.log("this.deviceIpSummary", this.deviceIpSummary);
  }
  getDeviceReport(device, params) {
    var currentItem = '';
    if (device.report) {
      device.report.networkAdapters.map((item) => {
        if (item.ip_enabled) { currentItem = item[params]; }
      });
      if (params === 'dns' || 'subnet') {
        var regex = /;/gi;
        currentItem = currentItem.replace(regex, '</br>');
        return currentItem;
      } else {
        return currentItem;
      }
    } else {
      return ''
    }
  };

}
