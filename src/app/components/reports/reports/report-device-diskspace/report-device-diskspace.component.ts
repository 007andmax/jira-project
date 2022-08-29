import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { CONFIGCONSTANTS } from "src/app/components/device/config/app-constants";
import { CommonHttpServices } from "src/app/components/device/_services/common_http.service";
import { ExcelService } from "src/app/components/device/_services/download_csv.service";
import { DropDownComponent } from "src/app/components/shared/drop-down/drop-down.component";
import { AgentService } from "src/app/services/agent/agent.service";
import { CompaniesStateService } from "src/app/states/company/companies-state.service";
import { DraftEmailStateService } from "src/app/states/draft-email/draft-email-state.service";
import { LeftPanelStateService } from "src/app/states/left-panel/left-panel-state.service";
import { DeviceDiskSpaceReport } from "../../class/device-diskspace-report";
import { ReportSendEmailComponent } from "../../report-additional-actions/report-send-email/report-send-email.component";
import { DeviceDiskSpaceReportFilter } from "./Class/device-diskspace-report";

@Component({
  selector: "report-device-diskspace",
  templateUrl: "./report-device-diskspace.component.html",
  styleUrls: ["./report-device-diskspace.component.scss"],
})
export class ReportDeviceDiskspaceComponent implements OnInit {
  @ViewChild('dropdownDevice') dropdownDevice : DropDownComponent;
  clientName: string;
  companies = [];
  deviceDiskSpaceList: any = [];
  deviceDiskSpaceReport: DeviceDiskSpaceReport = new DeviceDiskSpaceReport();
  date = new Date();
  DateFormat = CONFIGCONSTANTS.DateFormat1;
  loading = false;
  devices = [];
  tempararyDeviceList: any = [];
  filter: DeviceDiskSpaceReportFilter = new DeviceDiskSpaceReportFilter();
  selectedClient = null;
  orientation: string = "PORTRAIT";
  report: string = "device-diskspace-report";
  template: string = "PDF_TEMPLATE";
  fileName: string = "device-diskspace-report";
  accountType = "CLIENT";
  constructor(
    private agentService: AgentService,
    private companiesState: CompaniesStateService,
    private companiesStateService: CompaniesStateService,
    public leftPanelStateService: LeftPanelStateService,
    private modalService: NgbModal,
    private commonHttpServices: CommonHttpServices,
    private toastr: ToastrService,
    private excelService: ExcelService,
    public elRef: ElementRef,
    public draftEmailStateService: DraftEmailStateService,
  ) {}

  ngOnInit() {
    this.clientName = "All Companies";
    this.companiesState.onInit();
    this.setPreviewDataDevice();    
  }

  setPreviewDataDevice() {
      this.companiesStateService.getOnCompanies().subscribe((data) => {
        this.companies = this.getClientsList(data);
      });
  }

  getDeviceDiskDriveList(){
    if(this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getDeviceDiskDriveList();
      }, 300);
      return;
    }
    this.agentService.getDeviceDiskDrive().subscribe((resp) =>{
      this.deviceDiskSpaceList = resp;
      this.loading = false;
    })
  }

  getAllCompanyList(id) {
    this.deviceDiskSpaceList = [];
    this.agentService.getDeviceDiskDriveByGuid(id).subscribe((resp) => {
      if (resp.length > 0) {
        this.loading = false;
        this.deviceDiskSpaceList = resp;
        this.tempararyDeviceList = resp;
        this.devices = this.tempararyDeviceList
          .map((item) => item.Name)
          .filter((value, index, self) => self.indexOf(value) === index);
      }
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

  selectClient(selectClient) {
    if (selectClient) {
      this.loading = true
      this.clientName = selectClient.name;
      this.deviceDiskSpaceReport.setCompanyId(selectClient.id);
      this.getAllCompanyList(selectClient.id);
    } else {
      this.deviceDiskSpaceReport.setCompanyId(null);
      this.deviceDiskSpaceReport.setDeviceName(null);
      this.devices = [];
      this.dropdownDevice.clearWithOutChanges();
      this.clientName = "All Companies";
      this.deviceDiskSpaceList = [];      
    }
  }

  onSelectDevice(data) {
    this.deviceDiskSpaceReport.setDeviceName(data ? data : null);
    if (data) {
      if (
        this.deviceDiskSpaceReport.companyId &&
        this.deviceDiskSpaceReport.deviceName
      ) {
        this.deviceDiskSpaceList = this.tempararyDeviceList.filter(
          (x) => x.Name == data
        );
      }
    } else {
      this.deviceDiskSpaceList = this.tempararyDeviceList;
      this.devices = this.tempararyDeviceList
        .map((item) => item.Name)
        .filter((value, index, self) => self.indexOf(value) === index);
    }
  }

  getReportByDiskSpaceDetail() {}

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

  printPdf() {
    this.getPdfData();
  }

  getPdfData() {
    let pdfList = [];
    this.deviceDiskSpaceList.forEach((element) => {
      pdfList.push([
        element.CompanyName == null ? "N/A" : element.CompanyName.replace(",", " "),
        element.Name.replace(",", " ") || "N/A",
        element.DriveLetter || "N/A",
        element.size,
        element.UsedSpace,
        element.FreeSpace,
        this.getFreePercentage(element)
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
      ` - Device Disk Space Report</p>
                  <p style="line-height:1.5;color:#364656;margin:3px 0;font-size: 13px;font-family: Arial, Helvetica, sans-serif;font-weight:400;">Summary of ` +
      this.clientName +
      ` Devices Disk Space installed (` +
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
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 20%;">Company Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 25%;">Device Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 15%;">Driver Letter</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 20%;">Total Space</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 20%;">Used</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 20%;">Free</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 20%;">Free (%)</th>

                            </tr>
                    </thead>
                    <tbody>`;
    pdfList.forEach((element) => {
      html =
        html +
        `<tr style="width: 100%;">
        <td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 20%;vertical-align: top;">` +
        element[0] +
        `</td>`;
        html =
         html +
          `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 25%;vertical-align: top;">` +
        element[1] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 15%;vertical-align: top;">` +
        element[2] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 20%;vertical-align: top;">` +
        element[3] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 20%;vertical-align: top;">` +
        element[4] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 20%;vertical-align: top;">` +
        element[5] +
        `</td>`
        html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 20%;vertical-align: top;">` +
        element[6] +
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
      fileName: "Device Disk Space Report",
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

  downloadCsv() {
    let downloadCsvList = [];
    this.deviceDiskSpaceList.forEach((element) => {
      downloadCsvList.push([
        element.CompanyName == null ? "N/A" : element.CompanyName.replace(",", " "),
        element.Name.replace(",", " ") || "N/A",
        element.DriveLetter || "N/A",
        element.size,
        element.UsedSpace,
        element.FreeSpace,
        this.getFreePercentage(element)
      ]);
    });
    let fileName = "Device Disk Space List";
    this.excelService.generateExcel(
      downloadCsvList,
      fileName,
      "devicediskspacereport"
    );
  }

  goToReportList() {
    this.leftPanelStateService.goToState("new-device-summary");
  }

  onFilter(field) {
    this.filter.onFilter(field, this.deviceDiskSpaceList);
  }

  public getFreePercentage(item: any) {
    var freeSpace = parseInt(item.FreeSpace)||0;
    var size = parseInt(item.size)||0;
    if(size == 0|| freeSpace ==0) {
      return '-';
    }

    return (freeSpace * 100/size).toFixed(0) +'%';
  }
}
