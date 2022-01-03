import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AgentService } from 'src/app/services/agent/agent.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { KafkaStateService } from 'src/app/states/kafka/kafka-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { RemoteControlService } from '../device/_services/remoteControl.service';


@Component({
  selector: 'devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {
  @ViewChild("templatePowersell") template;
  @ViewChild("templateConnection") templateconnection;
  selectAllDevices: boolean = false;
  assetList: any[] = [];
  assetID: any[] = [];
  system: any;
  showPreloader: boolean = true;
  Preloader: boolean = true;
  search = "";
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
  selectedTag: any[] = [];
  selectable = true;
  removable = true;
  tagCtrl = new FormControl();
  filteredTag = [];
  tagFilterValue: string ="";
  tag : any[] = [];
  constructor(
    private leftPanelStateService: LeftPanelStateService,
    private agentService: AgentService,
    private companiesStateService: CompaniesStateService,
    private kafkaStateService: KafkaStateService,
    private activateRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.companyId = this.activateRoute.snapshot.params["id"];
    this.leftPanelStateService.changeStateWithoutNavigate(
      "newdevices"
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

  GetCurrentConfig(assetID: any) {
    this.agentService.GetCurrentConfig(assetID);
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

  toogleDevices() {
    this.assetList.forEach((item) => {
      item.selected = this.selectAllDevices ? true : false;
    });
  }

  public onFilter(field) {

  }

  onSelectDevice() {
    let find = this.assetList.find((item) => !item.selected);
    this.selectAllDevices = find ? false : true;
  }

  openAside(type,asset){
    this.open = true;
    this.tab = type;
    this.assetData = this.assetList.find((x)=>x.Guid === asset.Guid);
    this.Preloader = false;
  }

  gotoDetailDevice(Guid: string) {
    localStorage.setItem("company_id", this.companyId);
    const type = "workstation";
    var url = `/#/${this.companiesStateService
      .getCurrentCompany()
      .name.replaceAll(" ", "")}/device/dashboard/${type}/${Guid}`;
    window.open(url, "_blank");
  }

  remoteAccess(connectionType, guid) {
  }

  sendCommand(command, assetId) {
  }


  remove(index){
    this.selectedTag.splice(index,1);
  }

  onSelectTag(){

  }


  add(Tag): void {
    this.tagFilterValue = "";
    let Tags : any ={}
    Tags.Name=Tag;
    this.selectedTag.push(Tags);
    this.tag.push(Tag);
    let req : any = {};
    req.TechCompanyGuid = '73221c72-f87c-4519-8235-c4b57ad1cc19';
    req.Criteria = this.tag;

    this.agentService.searchDeviceWithTag(req).subscribe((resp)=>{
       console.log(resp);
    })

  }




}
