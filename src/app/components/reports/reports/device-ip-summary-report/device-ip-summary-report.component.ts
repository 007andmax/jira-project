import { NetworkAdapterReport } from './../../class/network-adapter-report';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CONFIGCONSTANTS } from 'src/app/components/device/config/app-constants';
import { CommonHttpServices } from 'src/app/components/device/_services/common_http.service';
import { ExcelService } from 'src/app/components/device/_services/download_csv.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
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
  loading = false;

  constructor(public cd: ChangeDetectorRef,
    private domSanitizer: DomSanitizer,
    private companiesStateService: CompaniesStateService,
    private devicesStateService: DevicesStateService,
    public leftPanelStateService: LeftPanelStateService,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private commonHttpServices: CommonHttpServices,
    private toastr: ToastrService,
    private devicesService: DevicesService) { }

  ngOnInit() {
    this.clientName = "All Companies";

    if (this.companiesStateService.getCompanies().length > 0) this.getClientsList(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
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
      this.getSoftByCompany(selectClient.id);
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
    this.getReport(this.deviceIpSummary)
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

  public getSoftByCompany(companyId) {
    this.deviceIpSummary.setPreloaderDevices(true);
    this.devicesService.getSoft(companyId).subscribe((resp: any) => {
      if (resp) {
        this.deviceIpSummary.setDevices(resp[companyId]);
      }
      this.deviceIpSummary.setPreloaderDevices(false);
    }, err => {
      this.deviceIpSummary.setPreloaderDevices(false);
    })
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

  downloadCsv() {
    let downloadCsvList = [];
    this.deviceIpSummary.list.forEach((element) => {
      downloadCsvList.push([
        element.label.replace(",", " ") || "N/A",
        element.hostName.replace(",", " ") || "N/A",
        (parseInt(this.getDeviceReport(element, 'speed')) || 0)/1000000 || "N/A",
        (this.getDeviceReport(element, 'dhcp_server')? 'yes' : 'no')  || "N/A",
        (this.getDeviceReport(element, 'ip_address')) || "N/A",
        element.report.networkAdapters[0].dns.replace(",", " ") || "N/A",
        element.report.networkAdapters[0].gateway.replace(",", " ") || "N/A",
        element.report.networkAdapters[0].dns.replace(",", " ") || "N/A",
        element.report.networkAdapters[0].dns.replace(",", " ") || "N/A",
        element.report.externalIp.replace(",", " ") || "N/A"
      ]);
    });
    let fileName = "Device Ip Summary Report List";
    this.excelService.generateExcel(
      downloadCsvList,
      fileName,
      "DeviceipSummary"
    );
  }

  printPdf() {
    this.getPdfData();
  }

  getPdfData() {
    let pdfList = [];
    this.deviceIpSummary.list.forEach((element) => {
      pdfList.push([
        element.label.replace(",", " ") || "N/A",
        element.hostName.replace(",", " ") || "N/A",
        (parseInt(this.getDeviceReport(element, 'speed')) || 0)/1000000 || "N/A",
        (this.getDeviceReport(element, 'dhcp_server')? 'yes' : 'no')  || "N/A",
        (this.getDeviceReport(element, 'ip_address')) || "N/A",
        element.report.networkAdapters[0].dns.replace(",", " ") || "N/A",
       (this.getDeviceReport(element, 'gateway')) || "N/A",
       (this.getDeviceReport(element, 'dns')) || "N/A",
       (this.getDeviceReport(element, 'dns')) || "N/A",
        element.report.externalIp.replace(",", " ") || "N/A"
      ]);
    });
    let html =
      `
    <style>
    * {
      padding: 0;
      margin: 0;
    }
    body {
      padding: 0;
      margin: 0;
      -ms-box-sizing: border-box;
      -o-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      font-weight: normal;
      font-style: normal;
      line-height: 1.33;
      letter-spacing: normal;
      color: #4f5f79;
      background-color: #f3f7f9;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    ul,
    li,
    ol {
      padding: 0;
      margin: 0;
    }
    a {
      text-decoration: none;
      border: none;
    }
    img {
      border: none;
      outline: none;
    }

    .container{
      width: 100%;
      margin: 0 auto;
      max-width:95%;
      padding:0 20px;
    }
    table{
      border-collapse: collapse;
      width: 100%;
      table-layout:fixed;
    }</style>
    <body>
    <div class="container" style="width: 960px;margin: 0 auto;max-width:95%;padding:0 20px;">
      <table style="width: 100%;border-collapse: collapse;border: solid 1px #dfe3e8;table-layout:fixed;">
      <thead style="width: 100%;font-family: Arial, Helvetica, sans-serif;">
      <tr style="width: 100%;font-family: Arial, Helvetica, sans-serif;">
          <th style="width:100px;text-align: left;color: #fff;padding: 15px 24px 15px;vertical-align: middle;font-family: Arial, Helvetica, sans-serif;background-color: #fff;" >
              <img src="/file/${localStorage.getItem(
                "imId"
              )}.jpg" alt="Logo" title="logo" style="max-width:100px;height:auto;"/>
          </th>
          <th align="left" style="text-align:left;font-size: 16px;line-height: 1.33;color: #000;padding:15px 0 15px 70px;vertical-align: middle;font-family: Arial, Helvetica, sans-serif;background-color: #fff;">
            <div class="reports-head" style="width:585px;text-align:center;color: #364656;float:left;margin-left:-105px;">
                  <p style="margin:0;line-height:1.2;color:#364656;font-size:16px;font-family: Arial, Helvetica, sans-serif;font-weight:600;">` +
      localStorage.getItem("currentCompanyName") +
      ` - Device Ip Summary Report</p>
                  <p style="line-height:1.5;color:#364656;margin:3px 0;font-size: 13px;font-family: Arial, Helvetica, sans-serif;font-weight:400;">Summary of ` +
      this.clientName +
      ` Devices installed (` +
      pdfList.length +
      ` items)</p>
                  <p style="margin:0;line-height:1;color:#4f5f79;font-size:11px;line-height: 1.09;font-family: Arial, Helvetica, sans-serif;font-weight:400;">Generated on ` +
      moment(new Date()).format("LL") +
      ` @ ` +
      moment(new Date()).format("LT") +
      `</p>
            </div>
          </th>
      </tr>
    </thead>
        <tbody style="background-color: #f3f7f9;">
          <tr style="width: 100%;">
            <td colspan="2" style="width: 100%;padding: 24px;">
               <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;table-layout:fixed;">
                    <thead>
                        <tr>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Device</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Network Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Link Speed</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Dhcp</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Ip Address</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Subnet</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Gateway</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Dns1</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Dns2</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Wan Ip</th>
                        </tr>
                    </thead>
                    <tbody>`;
    pdfList.forEach((element) => {
      html =
        html +
        `<tr style="width: 100%;">
          <td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 35%;vertical-align: top;">` +
        element[0] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 35%;vertical-align: top;">` +
        element[1] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 35%;vertical-align: top;">` +
        element[2] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 35%;vertical-align: top;">` +
        element[3] +
        `</td>`;
        html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 35%;vertical-align: top;">` +
        element[4] +
        `</td>`;
        html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 35%;vertical-align: top;">` +
        element[5] +
        `</td>`;
        html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 35%;vertical-align: top;">` +
        element[6] +
        `</td>`;
        html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 35%;vertical-align: top;">` +
        element[7] +
        `</td>`;
        html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 35%;vertical-align: top;">` +
        element[8] +
        `</td>`;
        html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 35%;vertical-align: top;">` +
        element[9] +
        `</td>
        </tr>`;
    });
    html =
      html +
      `</tbody>
        </table>
     </td>
   </tr>

 </tbody>
 <tfoot style="width: 100%;">
          <tr style="width: 100%;">
            <td style="width: 100%;" colspan="2">
              <table style="width: 100%;border-collapse: collapse;table-layout:fixed;">
                <tr>
                  <td style="width: 33.33%;color: #4f5f79;font-size: 11px;font-family: Arial, Helvetica, sans-serif;padding: 8px 24px;background-color: #fff;text-align: left;vertical-align: middle;">Report Prepare by: ` +
      localStorage.getItem("currentUser") +
      `</td>
                  <td style="width: 33.33%;color: #4f5f79;font-size:11px;font-family: Arial, Helvetica, sans-serif;padding: 8px 24px;background-color: #fff;text-align: center;vertical-align: middle;">` +
      localStorage.getItem("currentCompanyName") +
      `</td>
                  <td style="width: 33.33%;color: #4f5f79;font-size: 11px;font-family: Arial, Helvetica, sans-serif;padding: 8px 24px;background-color: #fff;text-align: right;vertical-align: middle;">Quicktech 2020 ©. All rights reserved</td>
               </tr>
              </table>
            </td>
          </tr>
        </tfoot>
 </table>
        </div>
        </body>`;
    let data = {
      content: html,
      id: "",
      fileName: "Device Ip Summary Report",
      orientation: "PORTRAIT",
    };
    this.loading = true;
    this.commonHttpServices
      .printPdf(data)
      .pipe()
      .subscribe(
        (data) => {
          this.loading = false;
          window.open(data.url, "_blank");
        },
        (error) => {
          this.loading = false;
          const statusError = error;
          if (statusError && statusError.meta) {
            this.toastr.error(statusError.meta.message);
          } else {
            this.toastr.error("Something went wrong please try again.");
          }
        }
      );
  }
}
