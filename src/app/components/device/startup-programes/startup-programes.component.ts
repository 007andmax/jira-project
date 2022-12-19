import { StartupFilter } from './class/startup-filters';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AgentService } from 'src/app/services/agent/agent.service';
import { KafkaStateService } from 'src/app/states/kafka/kafka-state.service';
import { ActivatedRoute } from '@angular/router';
import { ExcelService } from '../_services/download_csv.service';
import { CommonHttpServices } from '../_services/common_http.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';


@Component({
  selector: 'app-startup-programes',
  templateUrl: './startup-programes.component.html',
  styleUrls: ['./startup-programes.component.scss']
})
export class StartupComponent implements OnInit, OnDestroy {

  searchname = "";
  public startupList: any[] = [];
  public loading: boolean;
  public Id: string;
  public assetId: number;
  public asset: any;
  public pdfUrl: string;
  public filter: StartupFilter = new StartupFilter();
  startup: number = 0;
  searchstartup = false;
  public startupview: boolean = false;
  public kafkaresponse: boolean = false;
  sub: Subscription = new Subscription();
  constructor(
    private agentService: AgentService,
    private kafkaStateService: KafkaStateService,
    private cd: ChangeDetectorRef,
    private activateRoute: ActivatedRoute,
    private excelService: ExcelService,
    private commonHttpServices: CommonHttpServices,
    private toastr: ToastrService) {

  }

  ngOnInit() {
    this.Id = this.activateRoute.snapshot.params["id"];
    this.loading = true;
    this.kafkaStateService.onGetStartupPrograms.subscribe((resp) => {
      if (resp.length > 0) {
        this.kafkaresponse = true;
        this.onGetStartupPrograms(resp)
      }
    })
    if (this.agentService.hasAccessToken()) this.GetStartupPrograms();
    let onSetAccessToken = this.agentService.onSetAccessToken.subscribe(data => {
      this.GetStartupPrograms();
    })
    this.sub.add(onSetAccessToken);
    this.time();
  }

  public GetStartupPrograms() {
    this.agentService.getAssetByGuid(this.Id).subscribe((resp) => {
      this.asset = resp[0];
      if (resp.length > 0) {
        this.assetId = this.asset.ID;
        this.agentService.GetStartupPrograms(this.assetId);
      }
    });
  }

  public time() {
    setTimeout(() => {
      if (this.kafkaresponse == false) {
        this.loading = false;
        this.startupview = true;
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }
    }, 60000);

  }


  public onGetStartupPrograms(resp: any) {
    this.startup = resp.length;
    if (resp.length > 0) {
      this.loading = false;
      this.searchstartup = true;
    }
    let item = resp.find((x) => x.key == this.assetId);
    if (item) {
      this.startupList = JSON.parse(item.Value);
    }
    if (!this.cd['destroyed']) this.cd.detectChanges();
    this.getPdfData();
  }

  public onGetStartupProgramsError(error: any) {
  }


  public onFilter(field: string) {
    this.filter.onFilter(field, this.startupList);
  }


  public downloadCsv() {
    let downloadCsvList = [];
    this.startupList.forEach((element) => {
      downloadCsvList.push([
        element.Name.replace(",", " ") || "N/A",
        element.Command || "N/A",
        element.User || "N/A"
      ]);
    });
    let fileName = "Startup Programmes";
    this.excelService.generateExcel(downloadCsvList, fileName, "startupprogrammes");
  }

  public getPdfData() {
    let pdfList = [];
    this.startupList.forEach((element) => {
      pdfList.push([
        element.Name.replace(",", " ") || "N/A",
        element.Command || "N/A",
        element.User || "N/A"
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
      ` - Startup Programs Summary Report</p>
                  <p style="line-height:1.5;color:#364656;margin:3px 0;font-size: 13px;font-family: Arial, Helvetica, sans-serif;font-weight:400;">Summary of ` +
      (this.asset.Title || this.asset.Name) +
      ` Startup Programs (` +
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
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 20%;">Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 45%;">Description</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 14%;">Status</th>
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
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 12%;vertical-align: top;">` +
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
      fileName: "Startup Programs Summary Report",
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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
