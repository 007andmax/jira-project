import { Component, OnInit } from "@angular/core";
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

  constructor(
    private leftPanelStateService: LeftPanelStateService,
    private agentService: AgentService,
    private companiesStateService: CompaniesStateService,
    private kafkaStateService: KafkaStateService
  ) {}

  ngOnInit() {
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
  gotiDetailDevice(Guid: string) {
    const type = "workstation";
    var url = `/#/${this.companiesStateService
      .getCurrentCompany()
      .name.replaceAll(" ", "")}/device/dashboard/${type}/${Guid}`;
    window.open(url, "_blank");
  }

  AssetDetail() {
    this.agentService
      .getAssetsByCompanyId("fdadb2df-ed3d-4e28-b41e-741617b7ffa6")
      .subscribe((resp) => {
        this.AssetList = resp;
        this.AssetList.forEach((element, index) => {
          this.AssetList[index].Title =
            element.Title != "" ? element.Title : element.Name;
          this.OperatingSystem(element.ID, index);
          this.AssetID(element.ID);
        });
      });
    this.showPreloader = false;
  }

  OperatingSystem(value: any, index: any) {
    this.agentService.getOperatingSystemByAssetId(value).subscribe((resp) => {
      this.AssetList[index].Caption =
        resp[0].Caption.replace("Microsoft", "") +
        " " +
        resp[0].OSArchitecture +
        " " +
        resp[0].Version;
    });
  }

  AssetID(Asset_ID: any) {
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
            let Time = this.kafkaMessage.IdleTime.split("Idle for");
            this.AssetList[index].IdelTime = Time[1] != "" ? Time[1] : "";
          }
        });
      }
    });
  }
}
