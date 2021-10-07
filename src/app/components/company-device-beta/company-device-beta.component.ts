import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { forEach } from "@angular/router/src/utils/collection";
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
  selectAllDevices: boolean = false;
  AssetList: any[] = [];
  Asset_ID: any[] = [];
  system: any;
  showPreloader: boolean = true;
  search = "";
  filter: CompanyDeviceBetaFilter = new CompanyDeviceBetaFilter();
  selected: boolean = false;
  kafkaMessage: any;
  companyId: any;
  hardwareTypes: any[] = [];

  constructor(
    private leftPanelStateService: LeftPanelStateService,
    private agentService: AgentService,
    private companiesStateService: CompaniesStateService,
    private kafkaStateService: KafkaStateService,
    private activateRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.companyId = this.activateRoute.snapshot.params["id"];
    this.leftPanelStateService.changeStateWithoutNavigate(
      "company-devices-beta"
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
        this.AssetDetail();
        this.CurrentUser();
      });
  }

  toogleDevices() {
    this.AssetList.forEach((item) => {
      item.selected = this.selectAllDevices ? true : false;
    });
  }
  public onFilter(field) {
    this.filter.onFilter(field, this.AssetList);
  }

  onSelectDevice() {
    let find = this.AssetList.find((item) => !item.selected);
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
      this.AssetList = resp;
      this.HardwareTypeList(resp[0].TechCompanyGuid);
      this.AssetList.forEach((element, index) => {
        element.online = false;
        this.AssetList[index].Title =
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
        this.AssetList[index].Caption =
          resp[0].Caption.replace("Microsoft", "") +
          " " +
          resp[0].OSArchitecture +
          " " +
          resp[0].Version;
      }
    });
  }

  GetCurrentConfig(Asset_ID: any) {
    this.agentService.GetCurrentConfig(Asset_ID);
  }

  CurrentUser() {
    this.kafkaStateService.onCurrentConfig.subscribe((resp) => {
      if (resp.length > 0) {
        this.AssetList.forEach((element, index) => {
          let item = resp.find((x) => x.key == element.ID);
          if (item != undefined) {
            this.kafkaMessage = JSON.parse(item.value);
            this.AssetList[index].CurrentUser =
              this.kafkaMessage.CurrentLoggedInUser;
            if (this.kafkaMessage.IdleTime != null) {
              let Time = this.kafkaMessage.IdleTime.split("Idle for");
              this.AssetList[index].IdelTime = Time[1] != "" ? Time[1] : "";
              this.AssetList[index].online = true;
            }

            this.cd.detectChanges();
          }
        });
      }
    });
  }

  public setIcon(assetId, hardwareId) {
    var asset = this.AssetList.find(x => x.ID == assetId);
    if (asset) {
      asset.HardwareTypeID = hardwareId;
      var ht = this.hardwareTypes.find(x => x.ID == hardwareId);
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
        this.AssetList.forEach((element, index) => {
          var ht = this.hardwareTypes.find(x => x.ID == element.HardwareTypeID);
          if (ht) {
            element.iconName = ht.Name;
          }
        });
      });
  }
}
