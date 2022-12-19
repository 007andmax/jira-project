import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AgentService } from 'src/app/services/agent/agent.service';
import { KafkaStateService } from 'src/app/states/kafka/kafka-state.service';
import { CommonHttpServices } from '../_services/common_http.service';
import { ExcelService } from '../_services/download_csv.service';
import { ProcessesFilter } from './Class/processes-filter';

@Component({
  selector: 'processes',
  templateUrl: './processes.component.html',
  styleUrls: ['./processes.component.scss']
})
export class ProcessesComponent implements OnInit, OnDestroy {
  public processesList: any[] = [];
  public loading: boolean;
  public Id: string;
  public assetId: number;
  public asset: any;
  pdfUrl = "";
  public search: string;
  public processId: number;
  public filter: ProcessesFilter = new ProcessesFilter();
  public kafkaresponse: boolean = false;
  public processview: boolean = false;
  sub: Subscription = new Subscription();
  constructor(
    private kafkaStateService: KafkaStateService,
    private cd: ChangeDetectorRef,
    private activateRoute: ActivatedRoute,
    private agentService: AgentService,
    private excelService: ExcelService,
    private commonHttpServices: CommonHttpServices,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.Id = this.activateRoute.snapshot.params["id"];
    this.kafkaStateService.GetProcesses.subscribe((resp) => {
      if (resp.length > 0) {
        this.kafkaresponse = true;
        this.onGetProcess(resp)
      }
    })
    if (this.agentService.hasAccessToken()) this.getAllServicesList();
    let onSetAccessToken = this.agentService.onSetAccessToken.subscribe(data => {
      this.getAllServicesList();
    })
    this.sub.add(onSetAccessToken);
    this.time();
  }

  public time() {
    setTimeout(() => {
      if (this.kafkaresponse == false) {
        this.loading = false;
        this.processview = true;
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }
    }, 60000);

  }

  public onGetProcessError(error: any) {
    console.log(error);
  }

  public onFilter(field: string) {
    this.filter.onFilter(field, this.processesList);
  }
  public getAllServicesList() {
    this.agentService.getAssetByGuid(this.Id).subscribe((resp) => {
      this.asset = resp[0];
      if (resp.length > 0) {
        this.assetId = this.asset.ID;
        this.agentService.GetProcesses(this.assetId);
      }
    });
  }

  public onGetProcess(resp: any) {
    this.loading = false;
    let item = resp.find((x) => x.key == this.assetId);
    if (item) {
      this.processesList = JSON.parse(item.Value);
      for (let i = 0; i < this.processesList.length; i++) {
        this.processesList[i] = Object.assign(this.processesList[i], { Loaded: 'False', RestartLoaded: 'False', StopLoaded: 'False' });
        this.processId = this.processesList[i].PID;
      }
    }

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
    this.getPdfData();
  }

  stopProcesses(process) {
    this.agentService.KillProcesses(this.assetId, process.PID);
  }

  public downloadCsv() {
    let downloadCsvList = [];
    this.processesList.forEach((element) => {
      downloadCsvList.push([
        element.PID == null ? "N/A" : element.PID,
        element.Name == null ? "N/A" : element.Name,
        element.CPU == null ? "N/A" : element.CPU,
        element.MemoryMB == null ? "N/A" : element.MemoryMB,
        element.MemoryPercent == null ? "N/A" : element.MemoryPercent,
        element.DiskMB == null ? "N/A" : element.DiskMB,
        element.Network == null ? "N/A" : element.Network
      ]);
    });
    let fileName = "Processes";
    this.excelService.generateExcel(downloadCsvList, fileName, "processes");
  }

  printPdf() {
    window.open(this.pdfUrl, "_blank");
    this.getPdfData();
  }

  public getPdfData() {
    let pdfList = [];
    this.processesList.forEach((element) => {
      pdfList.push([
        element.PID == null ? "N/A" : element.PID,
        element.Name ? element.Name.replace(",", " ") : "N/A",
        element.CPU == null ? "N/A" : element.CPU,
        element.MemoryMB == null ? "N/A" : element.MemoryMB,
        element.MemoryPercent == null ? "N/A" : element.MemoryPercent,
        element.DiskMB == null ? "N/A" : element.DiskMB,
        element.Network == null ? "N/A" : element.Network
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
      ` - Process Report</p>
                  <p style="line-height:1.5;color:#364656;margin:3px 0;font-size: 13px;font-family: Arial, Helvetica, sans-serif;font-weight:400;">Summary of ` +
      (this.asset.Title || this.asset.Name) +
      ` Processes(` +
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
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 15%;">PID</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 30%;">Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 14%;">CPU</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 14%;">Ram</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 14%;">Memory</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 14%;">Disk</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 14%;">Network</th>
                        </tr>
                    </thead>
                    <tbody>`;
    pdfList.forEach((element) => {
      html =
        html +
        `<tr style="width: 100%;">
          <td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 15%;vertical-align: top;">` +
        element[0] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 30%;vertical-align: top;">` +
        element[1] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 14%;vertical-align: top;">` +
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
      fileName: "Processes Report",
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

  trackByMethod(index: number, service: any): string {
    return service.Name;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
