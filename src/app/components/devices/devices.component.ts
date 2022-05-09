import { Subscription } from 'rxjs';
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Session } from 'inspector';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AgentService } from 'src/app/services/agent/agent.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { KafkaStateService } from 'src/app/states/kafka/kafka-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { CommonHttpServices } from '../device/_services/common_http.service';
import { ExcelService } from '../device/_services/download_csv.service';
import { RemoteControlService } from '../device/_services/remoteControl.service';
import { ReportSendEmailComponent } from '../reports/report-additional-actions/report-send-email/report-send-email.component';
import { DeviceFilter } from './class/devices';


@Component({
  selector: 'devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {
  @ViewChild("templatePowersell") template;
  @ViewChild("templateConnection") templateconnection;
  @ViewChild("screenConnect") screenConnect;
  @ViewChild("screenConnectAcces") screenConnectAcces;
  companyId: any;
  tagFilterValue: string = "";
  searchTag: any[] = [];
  selectedTag: any[] = [];
  assetList: any[] = [];
  selectAllDevices: boolean = false;
  techCompnayGuid: string = "";
  hardwareTypes: any[] = [];
  operatingSystem: any = undefined;
  kafkaMessage: any;
  showPreloader: boolean = true;
  currentCompany: any = null;
  filter: DeviceFilter = new DeviceFilter();
  temporaryCommand: string = "";
  assetId: number;
  powershellmsg: string = "";
  closeResult = "";
  _id: string = "";
  restServerAddress = "";
  remoteConnectPort = 0;
  companyGuid: string = "";
  autosearchDevice: any[] = [];
  selectedCtrl = new FormControl();
  guid: number;
  connectionType: string = "";
  isConnection: boolean = false;
  selectedClient = null;
  orientation: string = "PORTRAIT";
  report: string = "report-device-summary";
  fileName: string = "device-summary-report";
  accountType = "CLIENT";
  clientName: string;
  loading = false;
  deviceSummaryList: any = [];
  modalReference: any;
  favouriteName: string;
  searchSubscription: any;
  screenConnectList: any[] = [];
  userName: any;
  password: any;
  OneTimeCode: any;
  getMacAddress: any;
  launchSchemeUrl: string = '';
  guestConnected: any;
  hostConnected: any;
  hostUserName: string;
  company: any;
  searches: any[];


  @ViewChild('dropdownServices') selectedInput: ElementRef<HTMLInputElement>;


  constructor(
    private leftPanelStateService: LeftPanelStateService,
    private agentService: AgentService,
    private toastr: ToastrService,
    private kafkaStateService: KafkaStateService,
    private cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService,
    private ngZone: NgZone,
    private modalService: NgbModal,
    private remoteControlService: RemoteControlService,
    private commonHttpServices: CommonHttpServices,
    private excelService: ExcelService,
  ) { }

  ngOnInit() {
    this.showPreloader = true;
    this.clientName = "All Companies";
    this.leftPanelStateService.changeStateWithoutNavigate(
      "new-devices"
    );

    this.onPowerShellCommand();

    this.company = this.companiesStateService.getCurrentCompany();
    //load if company data available
    if (this.company) {
      this.load(this.company);
    }
    this.companiesStateService.onCurrentCompany.subscribe(data => {
      this.load(data);
    });

    if (!this.searchSubscription) {
      this.searchSubscription = this.leftPanelStateService.onSearchChange.subscribe(data => {
        this.selectedTag = data.Criteria || [];
        this.searchTag = this.selectedTag;
        localStorage.removeItem("currentSearch");
        this.add(undefined);
      });
    }
  }

  load(company: any) {
    this.company = company;
    this.currentCompany = company;
    this.techCompnayGuid = this.currentCompany.id;
    if (!localStorage.getItem("currentSearch")) {
      let req: any = {};
      req.TechCompanyGuid = this.techCompnayGuid;
      req.Criteria = [];
      this.searchDeviceTag(req);
      this.getAssets();
    }
    else {
      this.setPreviewDataDevice();
    }
  }

  getAssets() {
    this.agentService.getByTechCompany(this.company.id).subscribe((res) => {
      this.searches = res;
    });
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  setPreviewDataDevice() {
    let searchData: any = localStorage.getItem("currentSearch");
    if (searchData) {
      let searchObj = JSON.parse(searchData);
      this.selectedTag = searchObj.Criteria || [];
      this.searchTag = this.selectedTag;
      localStorage.removeItem("currentSearch");
    }
    this.add(undefined);
    this.CurrentUser();
  }

  searchDeviceTag(data: any) {
    this.showPreloader = true;    
    if (!this.selectedTag) {
      this.autosearchDevice = [];
      data.Criteria = [];
    }
    this.agentService.searchDeviceWithTag(data).subscribe((resp) => {
      this.onFilter('CompanyName');
      this.showPreloader = false;

      this.operatingSystem = [];
      this.assetList = resp;
      this.HardwareTypeList(this.assetList[0].TechCompanyGuid);

      this.assetList.forEach((element, index) => {
        element.online = false;
        this.assetList[index].Title =
          element.Title != "" ? element.Title : element.Name;
        if (element.AgentVersion != null) {
          this.GetDeviceListConfig(element.ID);
        }
      });
      this.loading = false;
      if (this.cd) {
        this.cd.detectChanges();
      }
    });
  }


  toogleDevices() {
    this.assetList.forEach((item) => {
      item.selected = this.selectAllDevices ? true : false;
    });
  }

  onSelectDevice() {
    let find = this.assetList.find((item) => !item.selected);
    this.selectAllDevices = find ? false : true;
  }

  HardwareTypeList(TechCompanyGuid: any) {
    this.agentService
      .getHardwareTypeByTechCompanyGuid(TechCompanyGuid)
      .subscribe((resp) => {
        this.hardwareTypes = resp;
        this.assetList.forEach((element) => {
          var ht = this.hardwareTypes.find(
            (x) => x.ID == element.HardwareTypeID
          );
          if (ht) {
            element.iconName = ht.Name;
          }
        });
      });
  }

  public setIcon(assetId, hardwareId) {
    var asset = this.assetList.find((x) => x.ID == assetId);
    if (asset) {
      asset.HardwareTypeID = hardwareId;
      var ht = this.hardwareTypes.find((x) => x.ID == hardwareId);
      if (ht) {
        asset.iconName = ht.Name;
      }
      this.agentService.overrideAsset(asset).subscribe((resp) => {
        this.toastr.success("HardwareType change successfully.");
      });
    }
  }

  GetDeviceListConfig(assetID: any) {
    this.agentService.GetDeviceListConfig(assetID);
  }

  CurrentUser() {
    this.kafkaStateService.onDeviceListConfig.subscribe((resp) => {
      if (resp.length > 0) {
        if (resp[0].Value != "Unknown message type received : GetDeviceListConfig:") {
          let asset = this.assetList.find((x) => x.ID === resp[0].key);
          if (asset) {
            this.kafkaMessage = JSON.parse(resp[0].Value);
            asset.CurrentUser = this.kafkaMessage.CurrentLoggedInUser;
            if (this.kafkaMessage.IdleTime != null) {
              let Time = this.kafkaMessage.IdleTime.split("Idle for");
              asset.IdelTime = Time[1] != "" ? Time[1] : "";
            }
            asset.UpTime = this.kafkaMessage.UpTime;
          }
          asset.online = true;
        }
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }

      }
    });
  }

  onFilter(field) {
    this.filter.onFilter(field, this.assetList);
  }

  gotoDetailDevice(Guid: string) {
    localStorage.setItem("company_id", this.companyId);
    const type = "workstation";
    var url = `/#/${this.companiesStateService
      .getCurrentCompany()
      .name.replaceAll(" ", "")}/device/dashboard/${type}/${Guid}`;
    window.open(url, "_blank");
  }

  sendCommand(command, assetId) {
    let data: any = {};
    this.assetId = assetId;
    if (command === 'ura') {
      this.temporaryCommand = command;
      data.AssetID = assetId;
      data.MessageType = "UninstallRemoteAgent";
      this.agentService.SendPowerShellCommand(data);
    }
    if (command === 'ira') {
      this.temporaryCommand = command;
      data.AssetID = assetId;
      data.MessageType = "InstallRemoteAgent";
      this.agentService.SendPowerShellCommand(data);
    }
    if (command === 'd') {
      this.temporaryCommand = command;
      data.AssetID = assetId;
      data.MessageType = "UninstallAgent";
      this.agentService.SendPowerShellCommand(data);
    }
    if (command === 'u') {
      this.temporaryCommand = command;
      data.AssetID = assetId;
      data.MessageType = "UpdateAgent";
      this.agentService.SendPowerShellCommand(data);
    }
  }

  onPowerShellCommand() {
    this.kafkaStateService.onPowerShellCommand.subscribe((resp) => {
      let item = resp.find((x) => x.key == this.assetId);
      if (item) {
        this.kafkaMessage = item.Value;
        this.powershellmsg = this.kafkaMessage;
        this.ngZone.run(() => {
          if (
            item.Value.startsWith("Failed") ||
            item.Value.startsWith("This")
          ) {
            this.powershellmsg = item.Value.startsWith("Failed")
              ? this.powershellmsg + "<br/> Do you want to force restart?"
              : this.powershellmsg + "<br/> Do you want to force shutdown?";
            this.modalService.open(this.template, {
              windowClass: "modal-md",
              centered: true,
            });
          }
        });
      }
    });
  }

  decline() {
    this.modalService.dismissAll();
  }

  Reboot(assetID) {
    let data: any = {};
    if (this.temporaryCommand == "r") {
      data.AssetID = assetID;
      data.MessageType = "RunPowerShellCommand";
      data.Value = "Restart-Computer -force";
      this.agentService.SendPowerShellCommand(data);
      this.decline();
      this.toastr.success(
        "Rebooting computer now, please wait for a min to get it restarted"
      );
    }
    if (this.temporaryCommand == "s") {
      data.AssetID = assetID;
      data.MessageType = "RunPowerShellCommand";
      data.Value = "Stop-Computer -force";
      this.agentService.SendPowerShellCommand(data);
      this.decline();
      this.toastr.success("Shutting down computer now.");
    }
  }

  openModal(template, Guid, companyGuid) {
    this._id = Guid;
    this.companyGuid = companyGuid;
    this.modalService
      .open(template, { ariaLabelledBy: "modal-basic-title", centered: true })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismiss(reason)}`;
        }
      );
  }

  private getDismiss(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  getConstant(sessionId) {
    this.remoteControlService
      .getConstant()
      .pipe()
      .subscribe(
        (resp) => {
          this.restServerAddress = resp["rest.server.url"];
          this.remoteConnectPort = resp["remote.connect.port"];
          let url =
            "quicktech://connect?serverIP=" +
            this.restServerAddress +
            "&port=" +
            this.remoteConnectPort +
            "&sessionID=" +
            sessionId;
          window.open(url, "_self");
        },
        (error) => { }
      );
  }

  getViewer() {
    this.remoteControlService
      .getViewer()
      .pipe()
      .subscribe(
        (resp) => {
        },
        (error) => {
        }
      );
  }

  onSearchTag(Tag) {
    console.log('onSearchTag fired');
    if ((Tag || '').length <= 2) {
      return;
    }
    setTimeout(() => {
      let req: any = {};
      req.TechCompanyGuid = this.techCompnayGuid;
      req.Criteria = Tag;
      this.autosearchDevice = ['loading...'];
      if (this.cd) {
        this.cd.detectChanges();
      }
      this.agentService.autoComplete(req).subscribe((result) => {
        this.autosearchDevice = result;
        if (this.cd) {
          this.cd.detectChanges();
        }
      });
    }, 500);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log('selected fired');
    this.selectedTag.push(event.option.viewValue);
    this.searchTag.push(event.option.viewValue);
    this.selectedInput.nativeElement.value = '';
    this.selectedCtrl.setValue(null);
    this.add(event.option.viewValue);
  }

  remove(index: number) {
    this.selectedTag.splice(index, 1);
    this.searchTag.splice(index, 1);
    let req: any = {};
    req.TechCompanyGuid = this.techCompnayGuid;
    req.Criteria = this.selectedTag || [];
    this.searchDeviceTag(req);
  }

  add(Tag): void {
    console.log('add event fired');
    this.tagFilterValue = "";

    this.selectedInput.nativeElement.value = '';
    this.selectedCtrl.setValue(null);
    let findTag: any[] = [];

    if (this.selectedTag) {
      findTag = this.selectedTag.find(x => x == Tag);
    }

    if (Tag && !findTag) {
      this.selectedTag.push(Tag);
      this.searchTag.push(Tag);
    }

    let req: any = {};
    req.TechCompanyGuid = this.techCompnayGuid;
    req.Criteria = this.searchTag;

    this.searchDeviceTag(req);

  }

  remoteAccess(connectionType, guid) {
    this.guid = guid;
    this.connectionType = connectionType;
    this.modalService.open(this.templateconnection, {
      windowClass: "modal-md",
      centered: true,
    });
  }

  screenConnectAccess(macAddress) {
    let screenConnect = this.screenConnectList.find((x) => x.MACAddress == macAddress);
    if (screenConnect) {
      this.getMacAddress = screenConnect.MACAddress;
      this.guestConnected = screenConnect.GuestConnected;
      this.hostConnected = screenConnect.HostConnected;
      this.hostUserName = screenConnect.HostUserName;
    }

    this.modalService.open(this.screenConnectAcces, {
      windowClass: "modal-md",
      centered: true,
    });
  }

  close() {
    this.modalService.dismissAll("Cross click");
  }

  downloadViewer() {
    window.location.href = "/data/connection-viewer";
  }

  launchRemoteApp() {
    var asset = this.assetList.find(x => x.Guid == this.guid);
    let data = {
      assetId: this.guid,
      type: this.connectionType,
      companyId: asset.CompanyGuid,
    };
    this.remoteControlService
      .createConnection2(data)
      .pipe()
      .subscribe(
        (resp) => {
          if (this.connectionType === "CSS") {
            this.getConstant(resp.sessionId);
          } else {
            this.getConstant(resp.sessionId);
          }
        },
        (error) => {
          this.toastr.error("Something went wrong please try again.");
        }
      );
  }


  createConnection(connectionType: any) {
    var asset = this.assetList.find(x => x.Guid == this.guid);
    let data = {
      assetId: this.guid,
      type: connectionType,
      companyId: asset.CompanyGuid,
    };
    this.remoteControlService
      .createConnection2(data)
      .pipe()
      .subscribe(
        (resp) => {
          this.showPreloader = false;
          if (connectionType === "CSS") {
            this.getConstant(resp.sessionId);
          } else {
            this.getConstant(resp.sessionId);
          }
        },
        (error) => {
          this.toastr.error("Something went wrong please try again.");
        }
      );
  }

  createScreenConnect() {
    let connect = this.screenConnectList.find((x) => x.MACAddress == this.getMacAddress);
    window.open(connect.launchSchemeURL);
  }

  sendEmail() {
    const modalRef = this.modalService.open(ReportSendEmailComponent, null);
    modalRef.componentInstance.selectedClient = this.selectedClient;
    modalRef.componentInstance.orientation = this.orientation;
    modalRef.componentInstance.report = this.report;
    modalRef.componentInstance.template = this.template;
    modalRef.componentInstance.fileName = this.fileName;
    modalRef.componentInstance.accountType = this.accountType;
  }

  printPdf() {
    this.getPdfData();
  }

  getPdfData() {
    let pdfList = [];
    this.assetList.forEach((element) => {
      pdfList.push([
        element.Name.replace(",", " ") || "N/A",
        element.Manufacturer !== null ? element.Manufacturer.replace(",", " ") : element.Manufacturer || "N/A",
        element.Model !== null ? element.Model.replace(",", " ") : element.Model || "N/A",
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
      ` From Devices (` +
      pdfList.length +
      ` terms)</p>
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
    this.assetList.forEach((element) => {
      downloadCsvList.push([
        element.Name.replace(",", " ") || "N/A",
        element.Manufacturer !== null ? element.Manufacturer.replace(",", " ") : element.Manufacturer || "N/A",
        element.Model !== null ? element.Model.replace(",", " ") : element.Model || "N/A",
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

  showDlg(savefavourite) {
    if (this.selectedTag && this.selectedTag.length > 0) {
      this.modalReference = this.modalService.open(savefavourite, { ariaLabelledBy: "modal-basic-title", centered: true, size: "sm" }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      });
    }
  }

  showScreenConnect(screenConnect) {
    this.ngZone.run(() => {
      this.modalService
        .open(screenConnect, { ariaLabelledBy: "modal-basic-title", centered: true, size: 'lg', })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismiss(reason)}`;
          }
        );
    });
  }

  closed() {
    this.modalService.dismissAll("Cross click");
  }
  saveFavourite() {
    let req: any = {};
    req.Criteria = this.selectedTag;
    req.Name = this.favouriteName
    req.TechCompanyGuid = this.techCompnayGuid;
    req.IsActive = true;
    this.agentService.createAssetSearch(req).subscribe((data: any) => {
      this.modalService.dismissAll();
      this.toastr.success('Your search is saved');
    },
      (err) => {
        this.toastr.error('Error saving your search! Please try again');
      })
  }

  screenConnectLogin() {
    let data: any = {};
    data.UserName = this.userName;
    data.Password = this.password;
    data.OneTimeCode = this.OneTimeCode;
    data.URL = "http://inventory.activeinfosystems.com:8040"
    this.agentService.screenConnect(data).subscribe((resp) => {
      this.screenConnectList = resp.HostSessions;
      this.toastr.success('Successfully')
    },
      (err) => {
        this.toastr.error('Error ! Please try again')
      })
  }
}
