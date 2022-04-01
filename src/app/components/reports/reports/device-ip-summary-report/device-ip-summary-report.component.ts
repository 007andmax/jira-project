import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CONFIGCONSTANTS } from 'src/app/components/device/config/app-constants';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { DeviceIpSummary } from '../../class/device-ip-summary';
import { ReportValidate } from '../../class/report-validate';
import { ReportSendEmailComponent } from '../../report-additional-actions/report-send-email/report-send-email.component';

@Component({
  selector: 'device-ip-summary-report',
  templateUrl: './device-ip-summary-report.component.html',
  styleUrls: ['./device-ip-summary-report.component.scss']
})
export class DeviceIpSummaryReportComponent implements OnInit {

  loadingInProgress: boolean = false;
  onInit: boolean = false;
  company: any;
  deviceIpSummary: DeviceIpSummary = new DeviceIpSummary();
  companies : any[]=[];
  selectedClient = null;
  devices : any[]=[];
  clientName: string;
  date = new Date();
  DateFormat = CONFIGCONSTANTS.DateFormat1;
  validate: ReportValidate = new ReportValidate();
  @Output() onRequest = new EventEmitter<any>();
  @Output() getReports = new EventEmitter<any>();
  @Output() onSelectedClient = new EventEmitter<any>();
  orientation: string = "PORTRAIT";
  report: string = "report-device-summary";
  template: string = "PDF_TEMPLATE";
  fileName: string = "device-summary-report";
  accountType = "CLIENT";


  constructor(public cd: ChangeDetectorRef,
    private domSanitizer: DomSanitizer,
    private companiesStateService: CompaniesStateService,
    private devicesStateService: DevicesStateService,
    public leftPanelStateService: LeftPanelStateService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.clientName = "All Companies";
  }
  public getReport(data) {
    this.loadingInProgress = true;
    this.deviceIpSummary = new DeviceIpSummary(JSON.parse(JSON.stringify(data)));
    this.company = this.companiesStateService.getCompanies().find(item => item.id == this.deviceIpSummary.companyId);
    setTimeout(() => {
      this.onInit = true;
      this.loadingInProgress = false;
      if(this.cd) {
      this.cd.detectChanges();
      }
    }, 1000);
  }
  public parseHTML(data) {
    var parser = new DOMParser();

    return parser.parseFromString(data, 'text/html');
  }
  getDeviceReport(device, params) {
    var currentItem = '';
    if (device.report) {
      device.report.networkAdapters.map((item) => {
        if (item.ip_enabled) { currentItem = item[params]; }
      });
      if (params === 'dns' || 'subnet') {
        var regex = /;/gi;
        currentItem = currentItem.replace(regex, "\n");
        return currentItem;
      } else {
        return currentItem;
      }
    } else {
      return ''
    }
  };
  parseFloatValue(value) {
    return parseFloat(value);
  }

  public selectClient(selectClient) {
    if (selectClient == null) {
      this.selectedClient == null;
      this.deviceIpSummary.setCompanyId(null);
      this.getDevicesByCompany(null);
    } else {
      this.selectedClient = selectClient
      this.deviceIpSummary.setCompanyId(selectClient.id);
      this.getDevicesByCompany(selectClient.id);
    }
    this.onSelectedClient.emit(this.selectedClient);
  }

  public getDevicesByCompany(companyId) {
    this.devices = (this.devicesStateService.getAllDevices()[companyId]) ? this.devicesStateService.getAllDevices()[companyId] : [];

  }

  private setDatareport(data) {

    this.getReports.emit(data);
    this.loadingInProgress = false;
    this.onRequest.emit(false);
  }

  public onSelectDevice(data) {
    this.deviceIpSummary.setDeviceId((data) ? data.id : null);
  }

  getReportByDeviceIpSummary() {
    if (!this.validate.isValidateHardwareSummary(this.deviceIpSummary.companyId)) return;
    this.onRequest.emit(true);
    this.setDatareport(this.deviceIpSummary)
  }

  public goToReportList() {
    this.leftPanelStateService.goToState("new-device-summary");
  }

  getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
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
