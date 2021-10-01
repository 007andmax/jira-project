import { Component, OnInit, TemplateRef, OnDestroy } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { CommonHttpServices } from "./../_services/common_http.service";
import { ExcelService } from "./../_services/download_csv.service";
import { CONFIGCONSTANTS } from "../config/app-constants";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import * as moment from "moment";
import { environment } from "./../../../../environments/environment";
import { CompaniesStateService } from "src/app/states/company/companies-state.service";
import { AgentService } from "src/app/services/agent/agent.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SoftwareFilter } from "./class/software-filters";

@Component({
  selector: "app-software",
  templateUrl: "./software.component.html",
  styleUrls: ["./software.component.scss"],
})
export class SoftwareComponent implements OnInit, OnDestroy {
  url = environment.apiUrl + "upload";
  formData: FormData;
  loading = false;
  myDateValue: Date;
  check_all = false;
  selectedList: any[] = [];
  softwareList: any[] = [];
  deviceDetail: any = {};
  pdfUrl = "";
  search = "";
  DateFormat = CONFIGCONSTANTS.DateFormat;
  _id: string = "";
  type: string = "";
  pipe = new DatePipe("en-US");
  dtTrigger = new Subject();
  deletesoftwareList: any[] = [];
  softwaretoggle: boolean = false;
  filter: SoftwareFilter = new SoftwareFilter();
  asset: any = undefined;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private excelService: ExcelService,
    private companiesStateService: CompaniesStateService,
    private commonHttpServices: CommonHttpServices,
    private agentService: AgentService,
    private modalService: NgbModal,
    public activateRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.type = this.activateRoute.snapshot.params["type"];
    this._id = this.activateRoute.snapshot.params["id"];
    if (this.type === "printer") {
      this.router.navigate([
        `${this.companiesStateService
          .getCurrentCompany()
          .name.replaceAll(" ", "")}/device/dashboard/${this.type}/${this._id}`,
      ]);
    }
    this.myDateValue = new Date();
    this.deviceDetail = JSON.parse(
      localStorage.getItem("deviceDetail_" + this._id)
    );
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
        this.agentService.getAssetByGuid(this._id).subscribe((resp) => {
          if (resp.length > 0) {
            this.asset = resp[0];
            this.getSoftwareDetail(this.asset.ID);
          }
        });
      });
  }

  onFilter(field) {
    this.filter.onFilter(field, this.softwareList);
    this.getPdfData();
  }

  getSoftwareDetail(assetId) {
    this.agentService.getSoftwareListByAssetId(assetId).subscribe((resp) => {
      this.softwareList = resp;
      this.getPdfData();
    });
  }

  onDateChange(newDate: Date) {}

  selectedRecord(flag: string, index) {
    if (flag == "single") {
      if (this.softwareList[index].checked === true) {
        this.selectedList.push(index);
        this.deletesoftwareList.push({
          ID: this.softwareList[index].ID,
          ID2: this.softwareList[index].AssetID,
        });
      } else {
        this.selectedList.splice(this.selectedList.indexOf(index), 1);
        this.deletesoftwareList.splice(
          this.deletesoftwareList.indexOf(index),
          1
        );
      }
    } else if (flag == "all" && this.check_all === true) {
      this.selectedList = [];
      this.deletesoftwareList = [];
      for (let i = 0; i < this.softwareList.length; i++) {
        this.selectedList.push(index);
        this.softwareList[i].checked = true;
        this.deletesoftwareList.push({
          ID: this.softwareList[i].ID,
          ID2: this.softwareList[i].AssetID,
        });
      }
    } else {
      this.selectedList = [];
      this.softwareList.forEach((element) => {
        element.checked = false;
      });
      this.deletesoftwareList = [];
    }

    if (this.selectedList.length === this.softwareList.length) {
      this.check_all = true;
    } else {
      this.check_all = false;
    }
  }

  openModal(template: TemplateRef<any>, id) {
    if (this.selectedList.length === 0 && id !== "") {
      this.deletesoftwareList.push({ ID: id.ID, ID2: id.AssetID });
    }
    this.modalService.open(template, { windowClass: "modal-md" });
  }

  deleteSoftware() {
    this.loading = true;
    this.deletesoftwareList.forEach((element) => {
      const SoftwareList: any = {
        ID: element.ID,
        ID2: element.ID2,
        Password: "s8Y1IuPCUUYlSLMbFijHvuYhDDrEWfYjLyyYWDFvgW",
      };
      this.software(SoftwareList);
    });
    this.decline();
  }

  software(softwareList: any) {
    this.agentService.deleteSoftware(softwareList).subscribe(
      (data) => {
        this.loading = false;
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

  decline() {
    this.modalService.dismissAll();
    this.selectedList = [];
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  downloadCsv() {
    let downloadCsvList = [];
    this.softwareList.forEach((element) => {
      downloadCsvList.push([
        element.DisplayName.replace(",", " ") || "N/A",
        element.Publisher.replace(",", " ") || "N/A",
        element.DisplayVersion || "N/A",
        element.InstallDate !== "" && element.InstallDate !== null
          ? this.pipe.transform(new Date(element.InstallDate), this.DateFormat)
          : "N/A",
      ]);
    });
    let fileName = "Software List";
    this.excelService.generateExcel(downloadCsvList, fileName, "software");
  }

  getPdfData() {
    let pdfList = [];
    this.softwareList.forEach((element) => {
      pdfList.push([
        element.DisplayName.replace(",", " ") || "N/A",
        element.Publisher.replace(",", " ") || "N/A",
        element.DisplayVersion || "N/A",
        element.InstallDate !== "" && element.InstallDate !== null
          ? this.pipe.transform(new Date(element.InstallDate), this.DateFormat)
          : "N/A",
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
      this.deviceDetail.report.deviceName +
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
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Software Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 20%;">Publisher</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 14%;">Version</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 12%;">Installed on</th>
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

  printPdf() {
    window.open(this.pdfUrl, "_blank");
  }
}
