import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { CONFIGCONSTANTS } from "src/app/components/device/config/app-constants";
import { CommonHttpServices } from "src/app/components/device/_services/common_http.service";
import { ExcelService } from "src/app/components/device/_services/download_csv.service";
import { AgentService } from "src/app/services/agent/agent.service";
import { CompaniesStateService } from "src/app/states/company/companies-state.service";
import { DeviceSummaryReport } from "../../class/device-summary-report";
import { ReportValidate1 } from "../../class/report-validate1";
import { DeviceSummaryReportFilter } from "./Class/device-summary-report";

@Component({
  selector: "report-device-summary",
  templateUrl: "./report-device-summary.component.html",
  styleUrls: ["./report-device-summary.component.scss"],
})
export class ReportDeviceSummaryComponent implements OnInit {
  tempararyDevice: any = [];
  deviceSummaryList: any = [];
  tempararyDeviceSummaryList: any = [];
  companies = [];
  deviceSummaryReport: DeviceSummaryReport = new DeviceSummaryReport();
  clientName: string;
  validate: ReportValidate1 = new ReportValidate1();
  devices = [];
  loadingInProgress: boolean = false;
  date = new Date();
  DateFormat = CONFIGCONSTANTS.DateFormat1;
  filter: DeviceSummaryReportFilter = new DeviceSummaryReportFilter();
  pdfUrl = "";
  loading = false;

  constructor(
    private agentService: AgentService,
    private companiesStateService: CompaniesStateService,
    private commonHttpServices: CommonHttpServices,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private companiesState: CompaniesStateService
  ) {}

  ngOnInit() {
    this.clientName = "All Company";
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
        this.tempararyDevice = [];
        this.companiesStateService.getOnCompanies().subscribe((data) => {
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].accountType === "CLIENT" && !data[i].deletedAt) {
                this.getDeviceSummary(data[i].id);
              }
            }
            this.deviceSummaryList = this.tempararyDevice;
            this.getPdfData();
          }
          this.companies = this.getClientsList(data);
        });
      });
  }

  getDeviceSummary(id) {
    this.agentService.getDeviceSummaryByGuid(id).subscribe((resp) => {
      if (resp.length > 0) {
        for (let j = 0; j < resp.length; j++) {
          this.tempararyDevice.push(resp[j]);
          this.tempararyDeviceSummaryList.push(resp[j]);
        }
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

  printPdf() {
    window.open(this.pdfUrl, "_blank");
  }

  getReportByDeviceSummary() {
    this.agentService
      .getDeviceSummaryByGuid(this.deviceSummaryReport.companyId)
      .subscribe((resp) => {
        if (resp.length > 0) {
          if (
            this.deviceSummaryReport.companyId &&
            this.deviceSummaryReport.deviceName
          ) {
            this.tempararyDevice = resp.filter(
              (x) => x.Name == this.deviceSummaryReport.deviceName
            );
            this.deviceSummaryList = this.tempararyDevice;
          } else {
            this.deviceSummaryList = [];
            this.deviceSummaryList = resp;
          }
        } else {
          this.deviceSummaryList = [];
        }
        this.getPdfData();
      });
  }

  public getDevicesByCompany(companyId) {
    this.agentService.getAssetsByCompanyId(companyId).subscribe((resp) => {
      if (resp.length > 0) {
        this.devices = resp.filter((x) => x.Description != "");
      } else {
        this.devices = [];
      }
    });
  }

  onSelectDevice(data) {
    this.deviceSummaryReport.setDeviceName(data ? data.Description : null);
    if (data) {
      this.getReportByDeviceSummary();
    } else {
      this.getReportByDeviceSummary();
    }
  }

  selectClient(selectClient) {
    if (selectClient) {
      this.clientName = selectClient.name;
      this.deviceSummaryReport.setCompanyId(selectClient.id);
      this.getDevicesByCompany(selectClient.id);
      this.getReportByDeviceSummary();
    } else {
      this.deviceSummaryReport.setCompanyId(null);
      this.getDevicesByCompany(null);
      this.deviceSummaryList = this.tempararyDeviceSummaryList;
    }
  }

  onFilter(field) {
    this.filter.onFilter(field, this.deviceSummaryList);
  }

  getPdfData() {
    let pdfList = [];
    this.deviceSummaryList.forEach((element) => {
      pdfList.push([
        element.Name.replace(",", " ") || "N/A",
        element.Manufacturer.replace(",", " ") || "N/A",
        element.Model.replace(",", " ") || "N/A",
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
      ` Device installed (` +
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
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 20%;">Manufacturer</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 14%;">Model</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 18%;">SerialNumber</th>
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
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 18%;vertical-align: top;">` +
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
          this.pdfUrl = data.url;
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
    this.deviceSummaryList.forEach((element) => {
      downloadCsvList.push([
        element.Name.replace(",", " ") || "N/A",
        element.Manufacturer.replace(",", " ") || "N/A",
        element.Model.replace(",", " ") || "N/A",
        element.SerialNumber || "N/A",
      ]);
    });
    let fileName = "Device Summary Report List";
    this.excelService.generateExcel(
      downloadCsvList,
      fileName,
      "devicesummaryreport"
    );
  }
}
