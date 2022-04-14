import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { KafkaStateService } from 'src/app/states/kafka/kafka-state.service';
import { ActivatedRoute } from '@angular/router';
import { AgentService } from 'src/app/services/agent/agent.service';
import { ServiceFilter } from './class/service-filters';
import { ExcelService } from '../_services/download_csv.service';
import { CommonHttpServices } from '../_services/common_http.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  public search: string;
  public serviceList: any[] = [];
  public loading: boolean;
  public Id: string;
  public assetId: number;
  public asset: any;
  public filter: ServiceFilter = new ServiceFilter();
  pdfUrl = "";


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
    this.kafkaStateService.onGetService.subscribe((resp) => this.onGetService(resp), (e) => this.onGetServiceError(e));
    this.getAllServicesList();
  }

  public getAllServicesList() {
    if(this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getAllServicesList();
      }, 300);
      return;
    }
      this.agentService.getAssetByGuid(this.Id).subscribe((resp) => {
        this.asset = resp[0];
        this.assetId = this.asset.ID;
        this.agentService.GetService(this.assetId);
        this.getReload(null);
      });
  }

  public onGetService(resp: any) {
    let item = resp.find((x) => x.key == this.assetId);
    if (item) {
      this.serviceList = JSON.parse(item.Value);
      for(let i=0;i<this.serviceList.length;i++)
      {
        this.serviceList[i] = Object.assign(this.serviceList[i],{Loaded:'False',RestartLoaded:'False',StopLoaded:'False'});
      }
    }
    this.loading = false;
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
    this.getPdfData();
  }

  public onGetServiceError(error: any) {
    console.log(error);
  }

  public onFilter(field: string) {
    this.filter.onFilter(field, this.serviceList);
  }

  public downloadCsv() {
    let downloadCsvList = [];
    this.serviceList.forEach((element) => {
      downloadCsvList.push([
        (element.DisplayName ? element.DisplayName.replace(",", " ") : "N/A"),
        (element.Description ? element.Description.replaceAll(",", " ") :""),
        (element.Started=='True' ? "Running" : "Stopped"),
        (element.StartMode ? element.StartMode.replace(",", " ") : "N/A"),
        (element.startName ? element.startName.replace(",", " ") : "N/A")
      ]);
    });
    let fileName = "Services";
    this.excelService.generateExcel(downloadCsvList, fileName, "services");
  }

  public getPdfData() {
    let pdfList = [];
    this.serviceList.forEach((element) => {
      pdfList.push([
        element.DisplayName.replace(",", " ") || "N/A",
        element.Description? element.Description.replace(",", " ") : "N/A",
        element.Started=='True' ? "Running" : "Stopped",
        element.StartMode ? element.StartMode.replace(",", " ") : "N/A",
        element.startName ? element.startName.replace(",", " ") : "N/A"
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
      ` - Services Summary Report</p>
                  <p style="line-height:1.5;color:#364656;margin:3px 0;font-size: 13px;font-family: Arial, Helvetica, sans-serif;font-weight:400;">Summary of ` +
      (this.asset.Title || this.asset.Name) +
      ` services(` +
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
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 14%;">Type</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 22%;">Account Name</th>
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
        `</td>`
        html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 12%;vertical-align: top;">` +
        element[3] +
        `</td>`
        html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 22%;vertical-align: top;">` +
        element[4] +
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
      fileName: "Services Summary Report",
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

  public getReload(res:any){
    if(res!=null)
    {
      this.serviceList = res;
    }
    if (this.cd) {
      this.cd.detectChanges();
    }
  }

  servicePlay(serviceName:string,index:number){
    this.serviceList[index] = Object.assign(this.serviceList[index],{Loaded:'True',RestartLoaded:'False',StopLoaded:'False'});
    let data: any = {};
    data.AssetID = this.assetId;
    data.MessageType = "StartService";
    data.Value = serviceName;
    this.agentService.serviceStartCommand(data);
    this.getReload(this.serviceList);
    this.getAllServicesList();
  }

  serviceRestart(serviceName:string,index:number){
    this.serviceList[index] = Object.assign(this.serviceList[index],{Loaded:'True',RestartLoaded:'True',StopLoaded:'False'});
    let data: any = {};
    data.AssetID = this.assetId;
    data.MessageType = "RestartService";
    data.Value = serviceName;
    this.agentService.serviceRestartCommand(data);
    this.getReload(this.serviceList);
    this.getAllServicesList();
  }

  servicePause(serviceName:string,index:number){
    this.serviceList[index] = Object.assign(this.serviceList[index],{Loaded:'True',RestartLoaded:'False',StopLoaded:'True' });
    let data: any = {};
    data.AssetID = this.assetId;
    data.MessageType = "StopService";
    data.Value = serviceName;
    this.agentService.servicePauseCommand(data);
    this.getReload(this.serviceList);
    this.getAllServicesList();
  }

  trackByMethod(index:number, service:any): string {
    return service.Name;
  }

}
