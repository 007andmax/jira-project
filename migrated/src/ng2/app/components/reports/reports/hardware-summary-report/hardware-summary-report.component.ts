import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { HardwareSummaryReport } from '../../class/hardware-summary-report';

@Component({
  selector: 'hardware-summary-report',
  templateUrl: './hardware-summary-report.component.html',
  styleUrls: ['./hardware-summary-report.component.css']
})
export class HardwareSummaryReportComponent implements OnInit {

  loadingInProgress: boolean = false;
  onInit: boolean = false;
  company: any;
  hardwareSummaryReport: HardwareSummaryReport = new HardwareSummaryReport();
  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {

  }
  public getReport(data) {
    this.hardwareSummaryReport = new HardwareSummaryReport(JSON.parse(JSON.stringify(data)));
    this.company = this.companiesStateService.getCompanies().find(item => item.id == this.hardwareSummaryReport.companyId);
    console.log("this.company", this.company);
    //  this.techUser = this.usersStateService.getAllUsers().find(item => item.id === this.techService.techUserId);
    this.onInit = true;
  }
  getRamSize(slots) {
    let ramSize = 0;
    slots.forEach((item) => {
      ramSize = item.capacity;
    })
    return (ramSize > 0 && ramSize / 1073741824 > 0) ? (ramSize / 1073741824) + 'GB' : 0 + 'GB';
    //return (ramSize > 0 && ramSize/1073741824 > 0)? Math.ceil(ramSize/1073741824) + 'GB' : 0 + 'GB';
  };
  getDiskSize(diskSize) {
    var size = 0;
    if (diskSize && diskSize.length > 0) {
      diskSize.map((item) => {
        item.size = item.size ? item.size : 0;
        return size += Number.parseInt(item.size);
      })
    }
    if (Math.floor(size / 1073741824) > 1024) {
      return Math.floor((size / 1073741824) / 1024) + 'TB'
    } else {
      return Math.floor(size / 1073741824) + 'GB'
    }
  };
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }

}
