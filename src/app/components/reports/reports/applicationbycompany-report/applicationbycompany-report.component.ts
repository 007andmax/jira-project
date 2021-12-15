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
import { LeftPanelStateService } from "src/app/states/left-panel/left-panel-state.service";
import { DeviceApplictionByCompanyReport } from "../../class/applicationbycompany-report";
import { ApplicationByCompanyValidate } from "../../class/applicationbycompanyvalidate";
import { ReportSendEmailComponent } from "../../report-additional-actions/report-send-email/report-send-email.component";
import { ApplicationByCompanyReportFilter } from "./Class/applicationbycompanyReportFilter";

@Component({
  selector: "applicationbycompany-report",
  templateUrl: "./applicationbycompany-report.component.html",
  styleUrls: ["./applicationbycompany-report.component.scss"],
})
export class ApplicationbycompanyReportComponent implements OnInit {
  @ViewChild('dropdownDevice') dropdownDevice : DropDownComponent;
  clientName: string;
  companies = [];
  application = [];
  temparyApplicationList=[];
  applicationByCompanyList: any = [];
  applicationByCompanyReport: DeviceApplictionByCompanyReport =
    new DeviceApplictionByCompanyReport();
  date = new Date();
  DateFormat = CONFIGCONSTANTS.DateFormat1;
  loading = false;
  validate: ApplicationByCompanyValidate = new ApplicationByCompanyValidate();
  filter: ApplicationByCompanyReportFilter =
    new ApplicationByCompanyReportFilter();
  selectedClient = null;
  orientation: string = "PORTRAIT";
  report: string = "applicationbyCompany-report";
  template: string = "PDF_TEMPLATE";
  fileName: string = "applicationbyCompany-report";
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
    public elRef: ElementRef
  ) {}

  ngOnInit() {
    this.clientName = "All Companies";
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

  getReportByCompanyApplication() {
    if (
      !this.validate.isValidateApplicationByCompany(
        this.applicationByCompanyReport.companyId
      )
    )
      return;
    this.agentService
      .getCompanyApplicationByGuid(this.applicationByCompanyReport.companyId)
      .subscribe((resp) => {
        if (resp.length > 0) {
          this.applicationByCompanyList = resp;
          this.temparyApplicationList = resp;
          this.application = this.temparyApplicationList.map((item)=>item.DisplayName).filter((value,index,self)=>self.indexOf(value)=== index);
        } else {
          this.applicationByCompanyList = [];
        }
      });
  }

  selectClient(selectClient) {
    if (selectClient) {
      this.clientName = selectClient.name;
      this.applicationByCompanyReport.setCompanyId(selectClient.id);
      this.validate.resetCompany();
      this.getReportByCompanyApplication();
    } else {
      this.applicationByCompanyReport.setCompanyId(null);
      this.applicationByCompanyReport.setDeviceName(null);
      this.application = [];
      this.dropdownDevice.clearWithOutChanges();
      this.clientName = "All Companies";
      this.applicationByCompanyList = [];
    }
  }

  onSelectApplication(data) {
    this.applicationByCompanyReport.setDeviceName(data ? data : null);
    if (data) {
      if (
        this.applicationByCompanyReport.companyId &&
        this.applicationByCompanyReport.deviceName
      ) {
        this.applicationByCompanyList = this.temparyApplicationList.filter(
          (x) => x.DisplayName == data
        );
      }
    } else {
      this.applicationByCompanyList = this.temparyApplicationList;
      this.application = this.temparyApplicationList
        .map((item) => item.DisplayName)
        .filter((value, index, self) => self.indexOf(value) === index);
    }
  }

  getReportApplicationByCompany() {}

  sendEmail() {
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
    this.applicationByCompanyList.forEach((element) => {
      pdfList.push([
        element.DisplayName.replace(","," ") || "N/A",
        element.DisplayVersion || "N/A",
        element.AssetCount || "N/A",
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
      ` - Device Application By Company Report</p>
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
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 60%;">Application</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 30%;">Version</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 10%;">Device Count</th>
                        </tr>
                    </thead>
                    <tbody>`;
    pdfList.forEach((element) => {
      html =
        html +
        `<tr style="width: 100%;">
          <td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 60%;vertical-align: top;">` +
        element[0] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 30%;vertical-align: top;">` +
        element[1] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 10%;vertical-align: top;">` +
        element[2] +
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
      fileName: "Device Application By Company Report",
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
    this.applicationByCompanyList.forEach((element) => {
      downloadCsvList.push([
        element.DisplayName.replace(","," ") || "N/A",
        element.DisplayVersion || "N/A",
        element.AssetCount || "N/A",
      ]);
    });
    let fileName = "Application By Company Report List";
    this.excelService.generateExcel(
      downloadCsvList,
      fileName,
      "applicationbycompanyreport"
    );
  }

  goToReportList() {
    this.leftPanelStateService.goToState("new-reports");
  }

  onFilter(field) {
    this.filter.onFilter(field, this.applicationByCompanyList);
  }
}
