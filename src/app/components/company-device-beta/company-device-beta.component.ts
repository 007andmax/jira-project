import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild,} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { AgentService } from "src/app/services/agent/agent.service";
import { CompaniesStateService } from "src/app/states/company/companies-state.service";
import { KafkaStateService } from "src/app/states/kafka/kafka-state.service";
import { LeftPanelStateService } from "src/app/states/left-panel/left-panel-state.service";
import { RemoteControlService } from "../device/_services/remoteControl.service";
import { CompanyDeviceBetaFilter } from "./class/device-beta";

@Component({
  selector: "app-company-device-beta",
  templateUrl: "./company-device-beta.component.html",
  styleUrls: ["./company-device-beta.component.scss"],
})
export class CompanyDeviceBetaComponent implements OnInit {
  @ViewChild("templatePowersell") template;
  @ViewChild("templateConnection") templateconnection;
  selectAllDevices: boolean = false;
  assetList: any[] = [];
  assetID: any[] = [];
  system: any;
  showPreloader: boolean = true;
  search = "";
  filter: CompanyDeviceBetaFilter = new CompanyDeviceBetaFilter();
  selected: boolean = false;
  kafkaMessage: any;
  companyId: any;
  hardwareTypes: any[] = [];
  powershellmsg: string = "";
  temporaryCommand: string = "";
  assetId: number;
  isConnection: boolean = false;
  connectionType: string = "";
  restServerAddress = "";
  remoteConnectPort = 0;
  guid: number;
  toggleWindowSpecifications: boolean = false;
  toggleDeviceSpecifications: boolean = false;
  open: boolean = false;
  tab: string = "SYSTEM";
  assetData: any = undefined;
  softwareList: any = undefined;
  toggleIpSettings: boolean = false;
  networkData: any = undefined;
  operatingSystem: any = undefined;
  windowSystem: any = undefined;

  constructor(
    private leftPanelStateService: LeftPanelStateService,
    private agentService: AgentService,
    private companiesStateService: CompaniesStateService,
    private kafkaStateService: KafkaStateService,
    private activateRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private ngZone: NgZone,
    private remoteControlService: RemoteControlService
  ) {}

  ngOnInit() {
    this.companyId = this.activateRoute.snapshot.params["id"];
    this.leftPanelStateService.changeStateWithoutNavigate(
      "company-devices-beta"
    );
    this.setPreviewDataDevice();
    this.onPowerShellCommand();
    this.onAck();
    this.onInstallRemoteAgentCommand();
    this.onUninstallRemoteAgentCommand();
  }

  setPreviewDataDevice() {
    this.agentService
      .getAgentToken(
        "QuickTech",
        "s8Y1IuPCUUYlSLMbFijHvut5uOi/KnKNqOLtn57CBlw="
      )
      .subscribe((data) => {
        this.agentService.setAccessToken(data.AccessToken);
        this.AssetDetail();
        this.CurrentUser();
      });
  }

  toogleDevices() {
    this.assetList.forEach((item) => {
      item.selected = this.selectAllDevices ? true : false;
    });
  }
  public onFilter(field) {
    this.filter.onFilter(field, this.assetList);
  }

  onSelectDevice() {
    let find = this.assetList.find((item) => !item.selected);
    this.selectAllDevices = find ? false : true;
  }

  gotoDetailDevice(Guid: string) {
    localStorage.setItem("company_id", this.companyId);
    const type = "workstation";
    var url = `/#/${this.companiesStateService
      .getCurrentCompany()
      .name.replaceAll(" ", "")}/device/dashboard/${type}/${Guid}`;
    window.open(url, "_blank");
  }

  AssetDetail() {
    this.operatingSystem = [];
    this.agentService.getAssetsByCompanyId(this.companyId).subscribe((resp) => {
      this.assetList = resp;
      this.HardwareTypeList(resp[0].TechCompanyGuid);
      this.assetList.forEach((element, index) => {
        element.online = false;
        this.assetList[index].Title =
          element.Title != "" ? element.Title : element.Name;
        this.OperatingSystem(element.ID, index);
        this.GetCurrentConfig(element.ID);
      });
    });
    this.showPreloader = false;
  }

  OperatingSystem(value: any, index: any) {
    this.agentService.getOperatingSystemByAssetId(value).subscribe((resp) => {
      if (resp && resp.length > 0 && resp[0].Caption) {
        this.operatingSystem.push(resp[0]);
        this.assetList[index].Caption =
          resp[0].Caption.replace("Microsoft", "") +
          " " +
          resp[0].OSArchitecture +
          " " +
          resp[0].Version;
        this.assetList[index].OSArchitecture = resp[0].OSArchitecture;
      }
    });
  }

  GetCurrentConfig(assetID: any) {
    this.agentService.GetCurrentConfig(assetID);
  }

  CurrentUser() {
    this.kafkaStateService.onCurrentConfig.subscribe((resp) => {
      if (resp.length > 0) {
        let asset = this.assetList.find((x) => x.ID === resp[0].key);
        if (asset) {
          this.kafkaMessage = JSON.parse(resp[0].Value);
          asset.CurrentUser = this.kafkaMessage.CurrentLoggedInUser;
          if (this.kafkaMessage.IdleTime != null) {
            let Time = this.kafkaMessage.IdleTime.split("Idle for");
            asset.IdelTime = Time[1] != "" ? Time[1] : "";
          }
        }
        asset.online = true;
        this.cd.detectChanges();
      }
    });
  }

  onAck() {
    this.kafkaStateService.onAck.subscribe((resp) => {
      console.log("OnAck");
      let asset = this.assetList.find((x) => x.ID === resp.data.AssetID);
      if (asset) {
        this.ngZone.run(() => {
          this.toastr.success(
            "Computer restarted and up now!"
          );
          this.GetCurrentConfig(resp.data.AssetID);
        });
      }
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

  HardwareTypeList(TechCompanyGuid: any) {
    this.agentService
      .getHardwareTypeByTechCompanyGuid(TechCompanyGuid)
      .subscribe((resp) => {
        this.hardwareTypes = resp;
        this.assetList.forEach((element, index) => {
          var ht = this.hardwareTypes.find(
            (x) => x.ID == element.HardwareTypeID
          );
          if (ht) {
            element.iconName = ht.Name;
          }
        });
      });
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

  sendCommand(command, assetId) {
    let data: any = {};
    this.assetId = assetId;
    if (command === "r") {
      this.temporaryCommand = command;
      data.AssetID = assetId;
      data.MessageType = "RunPowerShellCommand";
      data.Value = "Restart-Computer";
      this.agentService.SendPowerShellCommand(data);
    }
    if (command === "s") {
      this.temporaryCommand = command;
      data.AssetID = assetId;
      data.MessageType = "RunPowerShellCommand";
      data.Value = "Stop-Computer";
      this.agentService.SendPowerShellCommand(data);
    }
    if (command === "ar") {
      this.agentService.UninstallAgent(assetId);
    }
    if(command === 'ura') {
      this.temporaryCommand = command;
      data.AssetID = assetId;
      data.MessageType = "UninstallRemoteAgent";
      this.agentService.SendPowerShellCommand(data);
    }
    if(command === 'ira') {
      this.temporaryCommand = command;
      data.AssetID = assetId;
      data.MessageType = "InstallRemoteAgent";
      this.agentService.SendPowerShellCommand(data);
    }

  }

  remoteAccess(connectionType, guid) {
    this.guid = guid;
    this.connectionType = connectionType;
    this.modalService.open(this.templateconnection, {
      windowClass: "modal-md",
      centered: true,
    });
  }

  close() {
    this.modalService.dismissAll("Cross click");
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
          this.isConnection = true;
        },
        (error) => {}
      );
  }

  downloadViewer() {
    window.location.href = "/data/connection-viewer";
  }

  launchRemoteApp() {
    let data = {
      assetId: this.guid,
      type: this.connectionType,
      companyId: this.companyId,
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

  onInstallRemoteAgentCommand() {
    this.kafkaStateService.onInstallRemoteAgent.subscribe((resp) => {
      console.log("onInstallRemoteAgent");
      let item = resp.find((x) => x.key == this.assetId);
      if (item) {
        this.kafkaMessage = item.Value;
        this.powershellmsg = this.kafkaMessage;
        this.ngZone.run(() => {
          this.toastr.success(`${this.powershellmsg}`);
          this.setPreviewDataDevice();
        });
      }
    });
  }

  onUninstallRemoteAgentCommand() {
    this.kafkaStateService.onUninstallRemoteAgent.subscribe((resp) => {
      console.log("onUninstallRemoteAgent");
      let item = resp.find((x) => x.key == this.assetId);
      if (item) {
        this.kafkaMessage = item.Value;
        this.powershellmsg = this.kafkaMessage;
        this.ngZone.run(() => {
          this.toastr.success(`${this.powershellmsg}`);
          this.setPreviewDataDevice();
        });
      }
    });
  }

  decline() {
    this.modalService.dismissAll();
  }

  openAside(type,asset){
    this.open = true;
    this.tab = type;
    this.showPreloader = false;
    this.assetData = this.assetList.find((x)=>x.Guid === asset.Guid);
    this.getSoftwareDetail(asset);
    this.getNetworkDetail(asset);

  }

  menuclose(){
    this.open = false;
    this.tab = "SYSTEM";
  }

  updateAsset(){
    this.agentService.overrideAsset(this.assetData).subscribe(
      (resp) => {
      },
      (error) => {
        this.toastr.error("Something went wrong please try again.");
      }
    );
    if (this.minDate(this.assetData.WarrantyExpires)) {
      this.assetData.WarrantyExpires = "";
    }

    if (this.minDate(this.assetData.InstallDate)) {
      this.assetData.InstallDate = "";
    }
  }

  minDate(dateVal: any) {
    var minDate = moment.utc("0001-01-01");
    var receiveDate = moment(dateVal);
    if (moment.utc(receiveDate).isAfter(minDate)) {
      return false;
    } else {
      return true;
    }
  }

  updateOperationgSystem(id,asset){
    let data = this.operatingSystem.find((x)=>x.AssetID === id);
    data.OSArchitecture = asset.OSArchitecture;
    this.agentService.overrideOperationSystem(data).subscribe(
      (resp)=>{
        this.setPreviewDataDevice();
    },
    (error)=>{
      this.toastr.error("Something went wrong please try again.");
    }
    );

  }

  getSoftwareDetail(asset) {
    this.agentService.getSoftwareListByAssetId(asset.ID).subscribe((resp) => {
      if(resp.length>0)
      {
        this.softwareList = resp;
      }
    });
  }

  public getDate(date) {
    return (date !== "" && date !== null) ? moment(date).format('YYYY-MM-DD') : "No installed date";
  }
  public getVersion(softVersion) {
    return (softVersion !== "") ? `, version - ${softVersion}` : ', No version';
  }

  getNetworkDetail(asset) {
    this.agentService.getNetworkAdapter(asset.ID).subscribe((resp) => {
      if (resp.length > 0) {
        this.networkData = resp[0];
      }
    });
  }

  public chackDefaultValue(value) {
    return (!value || value === "") ? "N\A" : value.replace("Microsoft","");
  }

  getLinkSpeed(value) {
    return ((value != 0)) ? (Number(value / 1000000)) : 0;
  }
  formatMacAddress(mac: any) {
    if (mac) {
      return mac.match(/.{1,2}/g).join(' ');
    } else {
      return 'N/A';
    }
  };

  serviceClass(update: boolean, alert: boolean) {
    return { updated: update == true, alert: alert == true };
  }

  getToDayDate() {
    return Date.now();
  }

  onOperatingSystem(data,type) {
    if(type === "Warranty")
    {
      this.assetData.WarrantyExpires = data || '0001-01-01';
    }
    if(type === "Install")
    {
      this.assetData.InstallDate = data || '0001-01-01';
    }
    this.agentService.overrideAsset(this.assetData).subscribe(
      (resp) => {
      },
      (error) => {
        this.toastr.error("Something went wrong please try again.");
      }
    );
    if (this.minDate(this.assetData.WarrantyExpires)) {
      this.assetData.WarrantyExpires = "";
    }

    if (this.minDate(this.assetData.InstallDate)) {
      this.assetData.InstallDate = "";
    }
  }

  parseDateFromDatePicker(value) {
    return moment(new Date(value.year, value.month - 1, value.day)).format('YYYY/MM/DD');
  }

  gotiDetailDevice(Guid:string){
    localStorage.setItem("company_id", this.companyId);
    const type = "workstation";
    var url = `/#/${this.companiesStateService
      .getCurrentCompany()
      .name.replaceAll(" ", "")}/device/dashboard/${type}/${Guid}`;
    window.open(url, "_blank");
  }

}
