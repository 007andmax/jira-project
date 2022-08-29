import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { xhr } from "d3";
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
  @ViewChild('dropdownDevice') dropdownDevice: DropDownComponent;
  @ViewChild('dropdownSoftware') dropdownSoftware: DropDownComponent;
  tempararyDeviceList: any = [];
  tempararySoftwareList: any = [];
  softwareReportList: any = [];
  temp: any = [];
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
    public elRef: ElementRef,
    public draftEmailStateService: DraftEmailStateService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.companiesState.onInit();
    this.setPreviewDataDevice();    
  }

  setPreviewDataDevice() {
    this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.loading = false;
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

  getCompanyApplication() {
    if (this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getCompanyApplication();
      }, 3000)
      return;
    }
    this.agentService.getCompanyApplications().subscribe((resp) => {
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
            let Name = resp[i].Assets;
            for (let j = 0; j < Name.length; j++) {
              let data = {
                DisplayName: resp[i].DisplayName,
                DisplayVersion: resp[i].DisplayVersion,
                Publisher: resp[i].Publisher,
                AssetCount: resp[i].AssetCount,
                AssetNames: Name[j].AssetName,
                CompanyName: Name[j].CompanyName,
              };
              this.tempReport.push(data);
            }
          } else {
            let data = {
              DisplayName: resp[i].DisplayName,
              DisplayVersion: resp[i].DisplayVersion,
              Publisher: resp[i].Publisher,
              AssetCount: resp[i].AssetCount,
              AssetNames: resp[i].Assets[0].AssetName,
              CompanyName: resp[i].Assets[0].CompanyName,
            };
            this.tempReport.push(data);
          }
        }
        this.devices = this.tempReport
          .map((item) => item.AssetNames)
          .filter((value, index, self) => self.indexOf(value) === index);

        this.softwareReportList = this.tempReport.sort((a, b) => a.AssetNames.toLowerCase() > b.AssetNames.toLowerCase() ? 1 : b.AssetNames.toLowerCase() > a.AssetNames.toLowerCase() ? -1 : 0);
      }
    })
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
        this.loading = false;
        this.tempReport = [];
        this.software = [];
        this.tempDevice = [];
        this.tempSoftware = [];
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
              let Name = resp[i].Assets;
              for (let j = 0; j < Name.length; j++) {
                let data = {
                  DisplayName: resp[i].DisplayName,
                  DisplayVersion: resp[i].DisplayVersion,
                  Publisher: resp[i].Publisher,
                  AssetCount: resp[i].AssetCount,
                  AssetNames: Name[j].AssetName,
                  CompanyName: Name[j].CompanyName,
                };
                this.tempReport.push(data);
              }
            } else {
              let data = {
                DisplayName: resp[i].DisplayName,
                DisplayVersion: resp[i].DisplayVersion,
                Publisher: resp[i].Publisher,
                AssetCount: resp[i].AssetCount,
                AssetNames: resp[i].Assets[0].AssetName,
                CompanyName: resp[i].Assets[0].CompanyName,
              };
              this.tempReport.push(data);
            }
          }
          this.devices = this.tempReport
            .map((item) => item.AssetNames)
            .filter((value, index, self) => self.indexOf(value) === index);

          this.softwareReportList = this.tempReport.sort((a, b) => a.AssetNames.toLowerCase() > b.AssetNames.toLowerCase() ? 1 : b.AssetNames.toLowerCase() > a.AssetNames.toLowerCase() ? -1 : 0);
        }
        else {
          this.softwareReportList = [];
        }
      });
  }

  onSelectSoftware(data) {  
    this.loading = true;  
    this.softwareSummaryReport.setSoftwareSoft(data ? data : null);
    if (data) {
      if (
        this.softwareSummaryReport.deviceName &&
        this.softwareSummaryReport.softwareSummarySoft
      ) {

        let softwareFilter = this.tempReport.filter(((x) => x.AssetNames == this.softwareSummaryReport.deviceName) && ((x) => x.DisplayName == this.softwareSummaryReport.softwareSummarySoft))
        if (softwareFilter.length > 0) {
          this.softwareReportList = [];
          this.tempDevice = [];
          this.softwareReportList = softwareFilter.filter((x) => x.AssetNames == this.softwareSummaryReport.deviceName);
          this.tempDevice = this.softwareReportList;
        }
        else {
          this.softwareReportList = [];
          this.tempDevice = [];
          let softwareFilterData = this.tempReport.filter(((x) => x.AssetNames == this.softwareSummaryReport.deviceName) && ((x) => x.Publisher == this.softwareSummaryReport.softwareSummarySoft))
          if (softwareFilterData)
            this.softwareReportList = softwareFilterData.filter((x) => x.AssetNames == this.softwareSummaryReport.deviceName);
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
          this.tempDevice = [];
          this.softwareReportList = this.tempReport.filter(
            ((x) =>
              x.AssetNames == this.softwareSummaryReport.deviceName) &&
            ((x) =>
              x.DisplayName ==
              this.softwareSummaryReport.softwareSummarySoft)
          );
          this.tempDevice = this.softwareReportList;
        } else {
          this.softwareReportList = [];
          this.tempDevice = [];
          this.softwareReportList = this.tempReport.filter(
            ((x) =>
              x.AssetNames == this.softwareSummaryReport.deviceName) &&
            ((x) =>
              x.Publisher ==
              this.softwareSummaryReport.softwareSummarySoft)
          );
          this.tempDevice = this.softwareReportList;
        }
      }
    } else {
      if (!this.softwareSummaryReport.deviceName) {
        this.temp = this.tempReport;
        this.softwareReportList = this.temp;
      }
      if (this.softwareSummaryReport.deviceName) {
        this.temp = this.tempReport;
        this.softwareReportList = this.temp.filter((x) => x.AssetNames == this.softwareSummaryReport.deviceName);
      }
      else {
        this.softwareReportList = this.tempReport;
      }
      this.software = this.tempSoftware
        .map((item) => item.DisplayName)
        .filter((value, index, self) => self.indexOf(value) === index);
    }
    this.loading = false;
  }

  onSelectDevice(data) {    
    this.loading = true;
    this.softwareSummaryReport.setDeviceName(data ? data : null);
    if (data) {
      if (this.softwareSummaryReport.deviceName && this.softwareSummaryReport.softwareSummarySoft) {
        let finddata = this.tempReport.filter(
          ((x) => x.AssetNames == this.softwareSummaryReport.deviceName) &&
          ((x) =>
            x.DisplayName ==
            this.softwareSummaryReport.softwareSummarySoft)
        );
        if (finddata.length > 0) {
          this.softwareReportList = finddata.filter(x => x.AssetNames == this.softwareSummaryReport.deviceName);
        }
        else {
          let filterDatas = this.tempReport.filter(((x) => x.AssetNames == this.softwareSummaryReport.deviceName) && ((x) => x.Publisher == this.softwareSummaryReport.softwareSummarySoft))
          if (filterDatas) {
            this.softwareReportList = filterDatas.filter(x => x.AssetNames == this.softwareSummaryReport.deviceName);
          }
        }
      }
      if (
        this.softwareSummaryReport.deviceName &&
        !this.softwareSummaryReport.softwareSummarySoft
      ) {
        this.softwareReportList = this.tempReport.filter(
          (x) => x.AssetNames == this.softwareSummaryReport.deviceName
        );        
        this.tempararySoftwareList = this.softwareReportList;
        this.tempSoftware = [];
        for (let i = 0; i < this.tempararySoftwareList.length; i++) {
          if (this.tempararySoftwareList[i].DisplayName != "") {
            let data = {
              DisplayName: this.tempararySoftwareList[i].DisplayName,
            };
            this.tempSoftware.push(data);
          }
          if (this.tempararySoftwareList[i].Publisher != "") {
            let data = {
              DisplayName: this.tempararySoftwareList[i].Publisher,
            };
            this.tempSoftware.push(data);
          }
          this.software = this.tempSoftware
            .map((item) => item.DisplayName)
            .filter((value, index, self) => self.indexOf(value) === index);
        }
      }


    } else {
      if (
        !this.softwareSummaryReport.deviceName &&
        this.softwareSummaryReport.softwareSummarySoft
      ) {
        let filter = this.tempReport.filter(
          ((x) =>
            x.DisplayName ==
            this.softwareSummaryReport.softwareSummarySoft)
        );
        if (filter.length > 0) {
          this.softwareReportList = [];
          this.tempDevice = [];
          this.softwareReportList = this.tempReport.filter(
            ((x) =>
              x.DisplayName ==
              this.softwareSummaryReport.softwareSummarySoft)
          );
          this.tempDevice = this.softwareReportList;
        } else {
          this.softwareReportList = [];
          this.tempDevice = [];
          this.softwareReportList = this.tempReport.filter(
            ((x) =>
              x.Publisher ==
              this.softwareSummaryReport.softwareSummarySoft)
          );
          this.tempDevice = this.softwareReportList;
        }
      }
      else {
        this.softwareReportList = this.tempReport;
      }
      this.devices = this.tempReport
        .map((item) => item.AssetNames)
        .filter((value, index, self) => self.indexOf(value) === index);

    }
    this.loading = false;
  }

  selectClient(selectClient) {
    this.loading = true;
    if (selectClient) {
      this.clientName = selectClient.name;
      this.softwareSummaryReport.setCompanyId(selectClient.id);
      this.validate.resetCompany();
      this.getReportBySoftwareSummary();
    } else {
      this.softwareSummaryReport.setCompanyId(null);
      this.softwareSummaryReport.setDeviceName(null);
      this.softwareSummaryReport.setSoftwareSoft(null);
      this.softwareReportList = [];
      this.dropdownDevice.clearWithOutChanges();
      this.dropdownSoftware.clearWithOutChanges();
      this.loading = false;
    }
  }

  onFilter(field) {
    this.filter.onFilter(field, this.softwareReportList);
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

  getPdfData() {
    let pdfList = [];
    this.softwareReportList.forEach((element) => {
      pdfList.push([
        element.CompanyName.replace(",", " ") || "N/A",
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
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 20%;">Company Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 20%;">Device Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 40%;">Software Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 20%;">Publisher</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 20%;">Version</th>
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
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 20%;vertical-align: top;">` +
        element[1] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 40%;vertical-align: top;">` +
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
        element.CompanyName.replace(",", " ") || "N/A",
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
    this.leftPanelStateService.goToState("new-device-summary");
  }
}
