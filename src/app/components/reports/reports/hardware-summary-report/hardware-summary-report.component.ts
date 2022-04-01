import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CONFIGCONSTANTS } from 'src/app/components/device/config/app-constants';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { HardwareSummaryReport } from '../../class/hardware-summary-report';
import { ReportValidate } from '../../class/report-validate';
import { ReportSendEmailComponent } from '../../report-additional-actions/report-send-email/report-send-email.component';

@Component({
  selector: 'hardware-summary-report',
  templateUrl: './hardware-summary-report.component.html',
  styleUrls: ['./hardware-summary-report.component.scss']
})
export class HardwareSummaryReportComponent implements OnInit {

  loadingInProgress: boolean = false;
  onInit: boolean = false;
  company: any;
  hardwareSummaryReport: HardwareSummaryReport = new HardwareSummaryReport();
  companies : any[]=[];
  devices : any[]=[];
  clientName: string;
  date = new Date();
  DateFormat = CONFIGCONSTANTS.DateFormat1;
  selectedClient = null;
  validate: ReportValidate = new ReportValidate();
  @Output() onRequest = new EventEmitter<any>();
  @Output() onSelectedClient = new EventEmitter<any>();
  @Output() getReport = new EventEmitter<any>();
  orientation: string = "PORTRAIT";
  report: string = "report-device-summary";
  template: string = "PDF_TEMPLATE";
  fileName: string = "device-summary-report";
  accountType = "CLIENT";


  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService,
    public leftPanelStateService: LeftPanelStateService,
    private devicesStateService: DevicesStateService,
    private devicesService: DevicesService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.clientName = "All Companies";

    if (this.companiesStateService.getCompanies().length > 0) this.getClientsList(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
  }
  // public getReports(data) {
  //   this.loadingInProgress = true;
  //   this.hardwareSummaryReport = new HardwareSummaryReport(JSON.parse(JSON.stringify(data)));
  //   this.company = this.companiesStateService.getCompanies().find(item => item.id == this.hardwareSummaryReport.companyId);
  //   //  this.techUser = this.usersStateService.getAllUsers().find(item => item.id === this.techService.techUserId);
  //   setTimeout(() => {
  //     this.onInit = true;
  //     this.loadingInProgress = false;
  //     this.cd.detectChanges();

  //   }, 1000);
  // }
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
  public trackByIndex(index, item) {
    return index;
  }

  public onSelectDevice(data) {
    this.hardwareSummaryReport.setDeviceId((data) ? data.id : null);
  }

  public goToReportList() {
    this.leftPanelStateService.goToState("new-device-summary");
  }

  public getDevicesByCompany(companyId) {
    this.devices = (this.devicesStateService.getAllDevices()[companyId]) ? this.devicesStateService.getAllDevices()[companyId] : [];

  }
  getReportByHardwareSummary() {
    if (!this.validate.isValidateHardwareSummary(this.hardwareSummaryReport.companyId)) return;
    this.onRequest.emit(true);
    this.setDatareport(this.hardwareSummaryReport)
  }

  getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }

  public selectClient(selectClient) {
    if (selectClient == null) {
      this.selectedClient == null;
      this.hardwareSummaryReport.setCompanyId(null);
      this.getDevicesByCompany(null);
    } else {
      this.selectedClient = selectClient
      this.hardwareSummaryReport.setCompanyId(selectClient.id);
      this.getDevicesByCompany(selectClient.id);
    }
    this.onSelectedClient.emit(this.selectedClient);
  }

  private setDatareport(data) {

    this.getReport.emit(data);
    this.loadingInProgress = false;
    this.onRequest.emit(false);
  }

  sendEmail() {
    const modalRef = this.modalService.open(ReportSendEmailComponent, null);
    modalRef.componentInstance.selectedClient = this.selectedClient;
    modalRef.componentInstance.orientation = this.orientation;
    modalRef.componentInstance.report = this.report;
    modalRef.componentInstance.template = this.template;
    modalRef.componentInstance.fileName = this.fileName;
    modalRef.componentInstance.accountType = this.accountType;
  }


}
