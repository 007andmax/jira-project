import { LogicalDisk } from './../../../device/hardware/class/system';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { HardwareSummaryReport } from '../../class/hardware-summary-report';
import { ReportValidate } from '../../class/report-validate';
import { ReportSendEmailComponent } from '../../report-additional-actions/report-send-email/report-send-email.component';
import { AgentService } from 'src/app/services/agent/agent.service';
import { HardwareSummaryReportFilter } from './Class/hardware-summary-report';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';

@Component({
  selector: 'hardware-summary-report',
  templateUrl: './hardware-summary-report.component.html',
  styleUrls: ['./hardware-summary-report.component.scss']
})
export class HardwareSummaryReportComponent implements OnInit {

  loadingInProgress: boolean = false;
  onInit: boolean = false;
  company: any;
  hardwareSummaryReport: any;
  companies: any[] = [];
  devices: any[] = [];
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
  loading = false;
  filter: HardwareSummaryReportFilter =
    new HardwareSummaryReportFilter();
  deviceSummaryReport: HardwareSummaryReport = new HardwareSummaryReport();
  tempararyDeviceList: any = [];
  tempararyDevice: any = [];



  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService,
    public leftPanelStateService: LeftPanelStateService,
    private devicesStateService: DevicesStateService,
    private devicesService: DevicesService,
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
    //this.companiesState.onInit();
    if (this.companiesStateService.getCompanies().length > 0) this.getClientsList(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    });
  }

  getHardwareSummaryList() {
    this.agentService.getHardwareSummary().subscribe((resp) => {
      this.hardwareSummaryReport = resp;
      this.loading = false;
    })
  }
  public trackByIndex(index, item) {
    return index;
  }
  getReportByDeviceSummary() {
    this.agentService
      .getDeviceSummaryByGuid(this.deviceSummaryReport.companyId)
      .subscribe((resp) => {
        if (resp.length > 0) {
          this.tempararyDeviceList = [];
          this.tempararyDeviceList = resp;
          this.deviceSummaryReport.companyId
          this.tempararyDeviceList = resp;
          this.hardwareSummaryReport = resp;
          this.devices = this.tempararyDeviceList
            .map((item) => item.Name)
            .filter((value, index, self) => self.indexOf(value) === index);
        }
      });
  }

  getHardwareSummarybyGuidList(id) {
    this.agentService.getHardwareSummaryByGuid(id).subscribe((resp) => {
      this.hardwareSummaryReport = resp;
    });
  }
  onFilter(field) {
    this.filter.onFilter(field, this.hardwareSummaryReport);
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
    if (diskSize > 0) {
      if (Math.floor(diskSize / 1073741824) > 1024) {
        return Math.floor((diskSize / 1073741824) / 1024) + 'TB'
      } else {
        return Math.floor(diskSize / 1073741824) + 'GB'
      }
    }
  };


  public goToReportList() {
    this.leftPanelStateService.goToState("new-device-summary");
  }


  getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }

  public selectClient(selectClient) {
    if (selectClient == null) {
      this.selectedClient == null;
      this.hardwareSummaryReport = [];
    } else {
      this.loading = true;
      this.selectedClient = selectClient
      this.deviceSummaryReport.setCompanyId(selectClient.id);
      this.getHardwareSummarybyGuidList(selectClient.id);
      this.getReportByDeviceSummary();
      this.loading = false;
    }
    this.onSelectedClient.emit(this.selectedClient);
  }

  onSelectDevice(data) {
    this.deviceSummaryReport.setDevices(data ? data : null);
    if (data) {
      if (
        this.deviceSummaryReport.companyId
      ) {
        this.hardwareSummaryReport = this.tempararyDeviceList.filter(
          (x) => x.Name == data
        );
      }
    } else {
      this.hardwareSummaryReport = this.tempararyDeviceList;
      this.devices = this.tempararyDeviceList
        .map((item) => item.Name)
        .filter((value, index, self) => self.indexOf(value) === index);
    }
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
    this.hardwareSummaryReport.forEach((element) => {
      downloadCsvList.push([
        element.CompanyName.replace(",", " ") || "N/A",
        element.Name.replace(",", " ") || "N/A",
        element.OperatingSystem.replace(",", " ") || "N/A",
        element.CPU == null ? "N/A" : element.CPU.replace(",", " "),
        element.Ram == null ? "N/A" : element.Ram,
        this.getDiskSize(element.TotalDiskSpace) || "N/A",
        element.Warranty == null ? "N/A" : element.Warranty.replace(",", " "),
        element.SerialNumber || "N/A",
      ]);
    });
    let fileName = "Hardware Summary Report List";
    this.excelService.generateExcel(
      downloadCsvList,
      fileName,
      "HardwareSummary"
    );
  }

  printPdf() {
    this.getPdfData();
  }

  getPdfData() {
    let pdfList = [];
    this.hardwareSummaryReport.forEach((element) => {
      pdfList.push([
        element.CompanyName.replace(",", " ") || "N/A",
        element.Name.replace(",", " ") || "N/A",
        element.OperatingSystem == null ? "N/A" : element.OperatingSystem.replace(",", " "),
        element.CPU == null ? "N/A" : element.CPU.replace(",", " "),
        element.Ram == null ? "N/A" : element.Ram,
        this.getDiskSize(element.TotalDiskSpace) || "N/A",
        element.Warranty == null ? "N/A" : element.Warranty.replace(",", " "),
        element.SerialNumber || "N/A",
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
      ` - Device Summary Report</p>
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
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 30%;">Company Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Device Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Operating System</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 20%;">Cpu</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 14%;">Ram</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 14%;">Disk</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 14%;">Warranty</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 18%;">SerialNumber</th>
                        </tr>
                    </thead>
                    <tbody>`;
    pdfList.forEach((element) => {
      html =
        html +
        `<tr style="width: 100%;">
        <td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 30%;vertical-align: top;">` +
        element[0] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 40%;vertical-align: top;">` +
        element[1] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 20%;vertical-align: top;">` +
        element[2] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 14%;vertical-align: top;">` +
        element[3] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 14%;vertical-align: top;">` +
        element[4] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 14%;vertical-align: top;">` +
        element[5] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 14%;vertical-align: top;">` +
        element[6] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 18%;vertical-align: top;">` +
        element[7] +
        `</td></tr>`;
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
      fileName: "Device Summary Report",
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
