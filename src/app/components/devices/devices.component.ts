import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AgentService } from 'src/app/services/agent/agent.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { KafkaStateService } from 'src/app/states/kafka/kafka-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { DeviceFilter } from './class/devices';


@Component({
  selector: 'devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {
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

  constructor(
    private leftPanelStateService: LeftPanelStateService,
    private agentService: AgentService,
    private toastr: ToastrService,
    private kafkaStateService: KafkaStateService,
    private cd: ChangeDetectorRef,
    private companiesService: CompaniesService,
  ) { }

  ngOnInit() {
    this.leftPanelStateService.changeStateWithoutNavigate(
      "new-devices"
    );
    this.companiesService.getTechCompany().subscribe(data => {
      this.currentCompany = data;
      this.techCompnayGuid = this.currentCompany.id;
      this.setPreviewDataDevice();
    });
  }

  setPreviewDataDevice() {
    this.agentService
      .getAgentToken(
        "QuickTech",
        "s8Y1IuPCUUYlSLMbFijHvut5uOi/KnKNqOLtn57CBlw="
      )
      .subscribe((data) => {
        this.agentService.setAccessToken(data.AccessToken);
        this.add(undefined);
        this.CurrentUser();
      });
  }

  searchDeviceTag(data:any){
    this.agentService.searchDeviceWithTag(data).subscribe((resp)=>{
          this.operatingSystem = [];
          this.assetList = resp;
          this.HardwareTypeList(this.assetList[0].TechCompanyGuid);
          this.assetList.forEach((element, index) => {
            element.online = false;
            this.assetList[index].Title =
              element.Title != "" ? element.Title : element.Name;
            this.OperatingSystem(element.ID, index);
            this.GetCurrentConfig(element.ID);
          });
    })
    this.showPreloader = false;
  }

  remove(index:number){
    this.selectedTag.splice(index,1);
    this.searchTag.splice(index,1);
    let req: any = {};
    req.TechCompanyGuid = this.techCompnayGuid;
    req.Criteria = this.selectedTag;
    this.searchDeviceTag(req);
  }

  add(Tag): void {
    this.tagFilterValue = "";

    if (Tag) {
      this.selectedTag.push(Tag);
      this.searchTag.push(Tag);
    }

    let req: any = {};
    req.TechCompanyGuid = this.techCompnayGuid;
    req.Criteria = this.searchTag;

    this.searchDeviceTag(req);

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

  onFilter(field){
    this.filter.onFilter(field, this.assetList);
  }
}
