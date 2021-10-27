import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { CONFIGCONSTANTS } from "src/app/components/device/config/app-constants";
import { CommonHttpServices } from "src/app/components/device/_services/common_http.service";
import { ExcelService } from "src/app/components/device/_services/download_csv.service";
import { AgentService } from "src/app/services/agent/agent.service";
import { CompaniesStateService } from "src/app/states/company/companies-state.service";
import { LeftPanelStateService } from "src/app/states/left-panel/left-panel-state.service";
import { ReportValidate1 } from "../../class/report-validate1";
import { SoftwareSummaryReport1 } from "../../class/software-summary-report1";
import { ReportSendEmailComponent } from "../../report-additional-actions/report-send-email/report-send-email.component";
import { SoftwareSummaryReportFilter } from "./Class/software-summary-report1-filter";

@Component({
  selector: "software-summary-report1",
  templateUrl: "./software-summary-report1.component.html",
  styleUrls: ["./software-summary-report1.component.scss"],
})
export class SoftwareSummaryReport1Component implements OnInit {
  tempararyDeviceList: any = [];
  tempararySoftwareList: any = [];
  softwareReportList: any = [];
  tempReport: any = [];
  tempDevice: any = [];
  companies = [];
  devices = [];
  software = [];
  tempSoftware = [];
  publisher = [];
  company: any;
  clientName: string;
  validate: ReportValidate1 = new ReportValidate1();
  softwareSummaryReport: SoftwareSummaryReport1 = new SoftwareSummaryReport1();
  filter: SoftwareSummaryReportFilter = new SoftwareSummaryReportFilter();
  date = new Date();
  DateFormat = CONFIGCONSTANTS.DateFormat1;
  pdfUrl = "";
  loading = false;
  selectedClient = null;
  orientation: string = "LANDSCAPE";
  template: string = "PDF_TEMPLATE";
  fileName: string = "software-summary-report";
  accountType = "CLIENT";
  report: string = "software-summary";
  constructor(
    private agentService: AgentService,
    private companiesStateService: CompaniesStateService,
    private commonHttpServices: CommonHttpServices,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private companiesState: CompaniesStateService,
    public leftPanelStateService: LeftPanelStateService,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.companiesState.onInit();
    this.setPreviewDataDevice();
  }

  setPreviewDataDevice() {
    this.agentService
      .getAgentToken(
        "QuickTech",
        "s8Y1IuPCUUYlSLMbFijHvut5uOi/KnKNqOLtn57CBlw="
      )
      .subscribe((data) => {
        console.log("data", data);
        this.agentService.setAccessToken(data.AccessToken);
        this.companiesStateService.getOnCompanies().subscribe((data) => {
          this.companies = this.getClientsList(data);
        });
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

  getReportBySoftwareSummary() {
    if (
      !this.validate.isValidateSoftwareSummary(
        this.softwareSummaryReport.companyId
      )
    )
      return;
    this.agentService
      .getCompanyApplicationByGuid(this.softwareSummaryReport.companyId)
      .subscribe((resp) => {
        this.tempReport = [];
        this.software = [];
        if (resp.length > 0) {
          for (let i = 0; i < resp.length; i++) {
            if (resp[i].DisplayName != "") {
              let data = {
                DisplayName: resp[i].DisplayName,
              };
              this.tempSoftware.push(data);
            }
            if (resp[i].Publisher != "") {
              let data = {
                DisplayName: resp[i].Publisher,
              };
              this.tempSoftware.push(data);
            }
            this.software = this.tempSoftware
              .map((item) => item.DisplayName)
              .filter((value, index, self) => self.indexOf(value) === index);

            if (resp[i].AssetCount > 1) {
              let Name = resp[i].AssetNames;
              for (let j = 0; j < Name.length; j++) {
                let data = {
                  DisplayName: resp[i].DisplayName,
                  DisplayVersion: resp[i].DisplayVersion,
                  Publisher: resp[i].Publisher,
                  AssetCount: resp[i].AssetCount,
                  AssetNames: Name[j],
                };
                this.tempReport.push(data);
              }
            } else {
              let data = {
                DisplayName: resp[i].DisplayName,
                DisplayVersion: resp[i].DisplayVersion,
                Publisher: resp[i].Publisher,
                AssetCount: resp[i].AssetCount,
                AssetNames: resp[i].AssetNames[0],
              };
              this.tempReport.push(data);
            }
          }
          this.devices = this.tempReport
          .map((item) => item.AssetNames)
          .filter((value, index, self) => self.indexOf(value) === index);

          this.softwareReportList = this.tempReport;
        }
        else
        {
          this.softwareReportList = [];
        }
      });
  }

  onSelectSoftware(data) {
    this.softwareSummaryReport.setSoftwareSoft(data);
    if (data) {
      if (
        this.softwareSummaryReport.deviceName &&
        this.softwareSummaryReport.softwareSummarySoft
      ) {
        let filter = this.tempararySoftwareList.filter(
          ((x) => x.AssetNames == this.softwareSummaryReport.deviceName) &&
            ((x) =>
              x.DisplayName ==
              this.softwareSummaryReport.softwareSummarySoft)
        );
        if (filter.length > 0) {
          this.softwareReportList = [];
          this.softwareReportList = this.tempararySoftwareList.filter(
            ((x) =>
              x.AssetNames == this.softwareSummaryReport.deviceName) &&
              ((x) =>
                x.DisplayName ==
                this.softwareSummaryReport.softwareSummarySoft)
          );
        } else {
          this.softwareReportList = [];
          this.softwareReportList = this.tempararySoftwareList.filter(
            ((x) =>
              x.AssetNames == this.softwareSummaryReport.deviceName) &&
              ((x) =>
                x.Publisher ==
                this.softwareSummaryReport.softwareSummarySoft)
          );
        }
      }
      if (
        this.softwareSummaryReport.softwareSummarySoft &&
        !this.softwareSummaryReport.deviceName
      ) {
        let filter = this.tempReport.filter(
          ((x) => x.AssetNames == this.softwareSummaryReport.deviceName) &&
            ((x) =>
              x.DisplayName ==
              this.softwareSummaryReport.softwareSummarySoft)
        );
        if (filter.length > 0) {
          this.softwareReportList = [];
          this.softwareReportList = this.tempReport.filter(
            ((x) =>
              x.AssetNames == this.softwareSummaryReport.deviceName) &&
              ((x) =>
                x.DisplayName ==
                this.softwareSummaryReport.softwareSummarySoft)
          );
        } else {
          this.softwareReportList = [];
          this.softwareReportList = this.tempReport.filter(
            ((x) =>
              x.AssetNames == this.softwareSummaryReport.deviceName) &&
              ((x) =>
                x.Publisher ==
                this.softwareSummaryReport.softwareSummarySoft)
          );
        }
      }
    }  else {
      if(!this.softwareSummaryReport.deviceName)
      {
        this.softwareReportList = this.tempReport;
      }
      else
      {
        this.softwareReportList = this.tempararySoftwareList;
      }
      this.software = this.tempSoftware
              .map((item) => item.DisplayName)
              .filter((value, index, self) => self.indexOf(value) === index);
    }
  }

  onSelectDevice(data) {
    this.softwareSummaryReport.setDeviceName(data ? data: null);
    if (data) {
      if (
        this.softwareSummaryReport.deviceName &&
        this.softwareSummaryReport.softwareSummarySoft
      ) {
        let filter = this.tempReport.filter(
          ((x) => x.AssetNames == this.softwareSummaryReport.deviceName) &&
            ((x) =>
              x.DisplayName ==
              this.softwareSummaryReport.softwareSummarySoft)
        );
        if (filter.length > 0) {
          this.softwareReportList = [];
          this.softwareReportList = this.tempReport.filter(
            ((x) =>
              x.AssetNames == this.softwareSummaryReport.deviceName) &&
              ((x) =>
                x.DisplayName ==
                this.softwareSummaryReport.softwareSummarySoft)
          );
        } else {
          this.softwareReportList = [];
          this.softwareReportList = this.tempReport.filter(
            ((x) =>
              x.AssetNames == this.softwareSummaryReport.deviceName) &&
              ((x) =>
                x.Publisher ==
                this.softwareSummaryReport.softwareSummarySoft)
          );
        }
      } if (
        this.softwareSummaryReport.deviceName &&
        !this.softwareSummaryReport.softwareSummarySoft
      ) {
        this.softwareReportList = this.tempReport.filter(
          (x) => x.AssetNames == this.softwareSummaryReport.deviceName
        );
        this.tempararySoftwareList = this.softwareReportList;
      }
    } else {
      this.softwareReportList = this.tempReport;
      this.devices = this.tempReport
      .map((item) => item.AssetNames)
      .filter((value, index, self) => self.indexOf(value) === index);

    }
  }

  selectClient(selectClient) {
    if (selectClient) {
      this.clientName = selectClient.name;
      this.softwareSummaryReport.setCompanyId(selectClient.id);
      this.validate.resetCompany();
      this.getReportBySoftwareSummary();
    } else {
      this.softwareSummaryReport.setCompanyId(null);
      this.softwareReportList = [];
    }
  }

  onFilter(field) {
    this.filter.onFilter(field, this.softwareReportList);
  }

  sendEmail(){
    const modalRef = this.modalService.open(ReportSendEmailComponent, null);
    modalRef.componentInstance.selectedClient = this.selectedClient;
    modalRef.componentInstance.orientation = this.orientation;
    modalRef.componentInstance.report = this.report;
    modalRef.componentInstance.template = this.template;
    modalRef.componentInstance.fileName = this.fileName;
    modalRef.componentInstance.accountType = this.accountType;
  }

  getPdfData() {
    let pdfList = [];
    this.softwareReportList.forEach((element) => {
      pdfList.push([
        element.AssetNames.replace(",", " ") || "N/A",
        element.DisplayName.replace(",", " ") || "N/A",
        element.Publisher.replace(",", " ") || "N/A",
        element.DisplayVersion || "N/A",
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
      ` - Software Summary Report</p>
                  <p style="line-height:1.5;color:#364656;margin:3px 0;font-size: 13px;font-family: Arial, Helvetica, sans-serif;font-weight:400;">Summary of ` +
      this.clientName +
      ` softwares installed (` +
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
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Device Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 20%;">Software Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 14%;">Publisher</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 12%;">Version</th>
                        </tr>
                    </thead>
                    <tbody>`;
    pdfList.forEach((element) => {
      html =
        html +
        `<tr style="width: 100%;">
          <td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 40%;vertical-align: top;">` +
        element[0] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 20%;vertical-align: top;">` +
        element[1] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 14%;vertical-align: top;">` +
        element[2] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 12%;vertical-align: top;">` +
        element[3] +
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
      fileName: "Software Summary Report",
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

  printPdf() {
    this.getPdfData();
  }

  downloadCsv() {
    let downloadCsvList = [];
    this.softwareReportList.forEach((element) => {
      downloadCsvList.push([
        element.AssetNames.replace(",", " ") || "N/A",
        element.DisplayName.replace(",", " ") || "N/A",
        element.Publisher.replace(",", " ") || "N/A",
        element.DisplayVersion || "N/A",
      ]);
    });
    let fileName = "Software Summary Report List";
    this.excelService.generateExcel(
      downloadCsvList,
      fileName,
      "softwaresummaryreport"
    );
  }

  goToReportList() {
    this.leftPanelStateService.goToState("new-reports");
  }
}
