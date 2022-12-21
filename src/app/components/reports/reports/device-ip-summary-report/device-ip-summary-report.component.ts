import { NetworkAdapterReport } from './../../class/network-adapter-report';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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
import { AgentService } from 'src/app/services/agent/agent.service';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';


@Component({
  selector: 'device-ip-summary-report',
  templateUrl: './device-ip-summary-report.component.html',
  styleUrls: ['./device-ip-summary-report.component.scss']
})
export class DeviceIpSummaryReportComponent implements OnInit {
  @ViewChild('dropdownDevice') dropdownDevice: DropDownComponent;
  loadingInProgress: boolean = false;
  onInit: boolean = false;
  company: any;
  deviceIpSummary: DeviceIpSummary = new DeviceIpSummary();
  companies: any[] = [];
  selectedClient = null;
  devices: any[] = [];
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
  deviceIpSummaryList: any[] = [];
  tempararyDeviceList: any = [];
  tempararyDevice: any = [];

  constructor(public cd: ChangeDetectorRef,
    private domSanitizer: DomSanitizer,
    private companiesStateService: CompaniesStateService,
    private devicesStateService: DevicesStateService,
    public leftPanelStateService: LeftPanelStateService,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private commonHttpServices: CommonHttpServices,
    private toastr: ToastrService,
    private agentService: AgentService,
    private companiesState: CompaniesStateService,
    public draftEmailStateService: DraftEmailStateService,
  ) { }

  ngOnInit() {
    this.clientName = "All Companies";
    //  this.companiesState.onInit();
    this.setPreviewDataDevice();
  }
  public parseHTML(data) {
    var parser = new DOMParser();
    return parser.parseFromString(data, 'text/html');
  }
  setPreviewDataDevice() {
    if (this.companiesStateService.getCompanies().length > 0) this.getClientsList(this.companiesStateService.getCompanies());
    this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.companies = this.getClientsList(data);
    });
  }

  getClientsList(data) {
    return data
      .filter((item) => item.accountType === "CLIENT" && !item.deletedAt)
      .sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase()
          ? 1
          : b.name.toLowerCase() > a.name.toLowerCase()
            ? -1
            : 0
      );
  }

  getDeviceIpSummaryList() {
    this.agentService.getDeviceIpSummary().subscribe((resp) => {
      this.deviceIpSummaryList = resp;
      this.loading = false;
    })
  }

  getReportByDeviceIpSummary() {
    this.agentService
      .getDeviceSummaryByGuid(this.deviceIpSummary.companyId)
      .subscribe((resp) => {
        if (resp.length > 0) {
          this.tempararyDeviceList = [];
          this.tempararyDeviceList = resp;
          this.deviceIpSummary.companyId
          this.tempararyDeviceList = resp;
          this.tempararyDeviceList = resp;
          this.devices = this.tempararyDeviceList
            .map((item) => item.Name)
            .filter((value, index, self) => self.indexOf(value) === index);
        }
      });
  }

  getDeviceIpSummaryByGuid(clientId) {
    this.agentService.getDeviceIpSummaryByGuid(clientId).subscribe((resp) => {
      this.deviceIpSummaryList = resp;
    })
  }

  public selectClient(selectClient) {
    if (selectClient == null) {
      this.selectedClient == null;
      this.deviceIpSummary.setCompanyId(null);
      this.dropdownDevice.clearWithOutChanges();
      this.deviceIpSummaryList = [];
    } else {
      this.loading = true;
      this.selectedClient = selectClient
      this.deviceIpSummary.setCompanyId(selectClient.id);
      this.getDeviceIpSummaryByGuid(selectClient.id);
      this.getReportByDeviceIpSummary();
      this.loading = false;
    }
    this.onSelectedClient.emit(this.selectedClient);
  }


  onSelectDevice(data) {
    this.deviceIpSummary.setDevices(data ? data : null);
    if (data) {
      if (
        this.deviceIpSummary.companyId
      ) {
        this.deviceIpSummaryList = this.tempararyDeviceList.filter(
          (x) => x.Name == data
        );
      }
    } else {
      this.deviceIpSummaryList = this.tempararyDeviceList;
      this.devices = this.tempararyDeviceList
        .map((item) => item.Name)
        .filter((value, index, self) => self.indexOf(value) === index);
    }
  }
  public getDateForHeader(data) {
    return moment(data).format('DD MMM YYYY');
  }
  parseFloatValue(value) {
    return parseFloat(value);
  }

  public goToReportList() {
    this.leftPanelStateService.goToState("new-device-summary");
  }

  sendEmail() {
    this.draftEmailStateService.toogleAsideAddReport({
      selectedClient: this.selectedClient,
      orientation: this.orientation,
      report: this.report,
      template: this.template,
      fileName: this.fileName,
      accountType: this.accountType
    });
  }



  downloadCsv() {
    let downloadCsvList = [];
    this.deviceIpSummaryList.forEach((element) => {
      downloadCsvList.push([
        element.CompanyName.replace(",", " ") || "N/A",
        element.Name.replace(",", " ") || "N/A",
        element.Speed == null ? "N/A" : element.Speed,
        element.DHCP.replace(",", " ") || "N/A",
        element.InternalIPAddress.replace(",", " ") || "N/A",
        element.SubnetMask.replace(",", " ") || "N/A",
        element.DefaultGateway.replace(",", " ") || "N/A",
        element.DNS1.replace(",", " ") || "N/A",
        element.DNS2 == null ? "N/A" : element.DNS2,
        element.ExternalIPAddress.replace(",", " ") || "N/A"
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
    this.deviceIpSummaryList.forEach((element) => {
      pdfList.push([
        element.CompanyName.replace(",", " ") || "N/A",
        element.Name.replace(",", " ") || "N/A",
        element.Speed == null ? "N/A" : element.Speed,
        element.DHCP.replace(",", " ") || "N/A",
        element.InternalIPAddress.replace(",", " ") || "N/A",
        element.SubnetMask.replace(",", " ") || "N/A",
        element.DefaultGateway.replace(",", " ") || "N/A",
        element.DNS1.replace(",", " ") || "N/A",
        element.DNS2 == null ? "N/A" : element.DNS2,
        element.ExternalIPAddress.replace(",", " ") || "N/A"
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
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Company Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Device</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Link Speed</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Dhcp</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Ip Address</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Subnet</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Gateway</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Dns1</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Dns2</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 40%;">Wan Ip</th>
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
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 40%;vertical-align: top;">` +
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
