import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { AgentService } from "src/app/services/agent/agent.service";
import { CompaniesStateService } from "src/app/states/company/companies-state.service";
import { KafkaStateService } from "src/app/states/kafka/kafka-state.service";
import { LeftPanelStateService } from "src/app/states/left-panel/left-panel-state.service";
import { CompanyDeviceBetaFilter } from "./class/device-beta";

@Component({
  selector: "app-company-device-beta",
  templateUrl: "./company-device-beta.component.html",
  styleUrls: ["./company-device-beta.component.scss"],
})
export class CompanyDeviceBetaComponent implements OnInit {
  @ViewChild("templatePowersell") template;
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

  constructor(
    private leftPanelStateService: LeftPanelStateService,
    private agentService: AgentService,
    private companiesStateService: CompaniesStateService,
    private kafkaStateService: KafkaStateService,
    private activateRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.companyId = this.activateRoute.snapshot.params["id"];
    this.leftPanelStateService.changeStateWithoutNavigate(
      "company-devices-beta"
    );
    this.setPreviewDataDevice();
    this.onPowerShellCommand();
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
        this.assetList[index].Caption =
          resp[0].Caption.replace("Microsoft", "") +
          " " +
          resp[0].OSArchitecture +
          " " +
          resp[0].Version;
      }
    });
  }

  GetCurrentConfig(assetID: any) {
    this.agentService.GetCurrentConfig(assetID);
  }

  CurrentUser() {
    this.kafkaStateService.onCurrentConfig.subscribe((resp) => {
      if (resp.length > 0) {
        this.assetList.forEach((element, index) => {
          let item = resp.find((x) => x.key == element.ID);
          if (item != undefined) {
            this.kafkaMessage = JSON.parse(item.Value);
            this.assetList[index].CurrentUser =
              this.kafkaMessage.CurrentLoggedInUser;
            if (this.kafkaMessage.IdleTime != null) {
              let Time = this.kafkaMessage.IdleTime.split("Idle for");
              this.assetList[index].IdelTime = Time[1] != "" ? Time[1] : "";
            }
            this.assetList[index].online = true;
            this.cd.detectChanges();
          }
        });
      }
    });
  }

  public setIcon(assetId, hardwareId,myDrop) {
    var asset = this.assetList.find((x) => x.ID == assetId);
    if (asset) {
      asset.HardwareTypeID = hardwareId;
      var ht = this.hardwareTypes.find((x) => x.ID == hardwareId);
      if (ht) {
        asset.iconName = ht.Name;
      }
      myDrop.close();
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
      if (item != undefined) {
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

  decline() {
    this.modalService.dismissAll();
  }
}
