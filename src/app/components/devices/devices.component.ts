import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AgentService } from 'src/app/services/agent/agent.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { KafkaStateService } from 'src/app/states/kafka/kafka-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { RemoteControlService } from '../device/_services/remoteControl.service';
import { DeviceFilter } from './class/devices';


@Component({
  selector: 'devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {
  @ViewChild("templatePowersell") template;
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
  @ViewChild('dropdownServices') selectedInput: ElementRef<HTMLInputElement>;


  constructor(
    private leftPanelStateService: LeftPanelStateService,
    private agentService: AgentService,
    private toastr: ToastrService,
    private kafkaStateService: KafkaStateService,
    private cd: ChangeDetectorRef,
    private companiesService: CompaniesService,
    private companiesStateService: CompaniesStateService,
    private ngZone: NgZone,
    private modalService: NgbModal,
    private remoteControlService: RemoteControlService,
  ) { }

  ngOnInit() {
    this.leftPanelStateService.changeStateWithoutNavigate(
      "new-devices"
    );
    this.companiesService.getTechCompany().subscribe(data => {
      this.currentCompany = data;
      this.techCompnayGuid = this.currentCompany.id;
      this.setPreviewDataDevice();
      this.onPowerShellCommand();
    });

    this.showPreloader = false;
  }

  setPreviewDataDevice() {       
    this.agentService
    .getAgentToken(
      "QuickTech",
      "s8Y1IuPCUUYlSLMbFijHvut5uOi/KnKNqOLtn57CBlw="
    )
    .subscribe((data) => {
      this.agentService.setAccessToken(data.AccessToken);
      //this.add(undefined);
      this.CurrentUser();
    });
  }

  searchDeviceTag(data: any) {
    this.showPreloader = true;
    if (this.selectedTag.length == 0) {
      this.autosearchDevice = [];
    }
    this.agentService.searchDeviceWithTag(data).subscribe((resp) => {
      this.showPreloader = false;

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

      if(this.cd) {
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

  createConnection(type) {
    this.showPreloader = true;
    let data = {
      assetId: this._id,
      type: type,
      companyId: this.companyGuid,
    };
    this.remoteControlService
      .createConnection2(data)
      .pipe()
      .subscribe(
        (resp) => {
          this.showPreloader = false;
          if (type === "CSS") {
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
    this.showPreloader = true;
    this.remoteControlService
      .getViewer()
      .pipe()
      .subscribe(
        (resp) => {
          this.showPreloader = false;
        },
        (error) => { }
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
    this.selectedInput.nativeElement.value = '';
    this.selectedCtrl.setValue(null);
    this.add(event.option.viewValue);
  }
  
  remove(index: number) {
    this.selectedTag.splice(index, 1);
    this.searchTag.splice(index, 1);
    let req: any = {};
    req.TechCompanyGuid = this.techCompnayGuid;
    req.Criteria = this.selectedTag;
    this.searchDeviceTag(req);
  }

  add(Tag): void {
    console.log('add event fired');
    this.tagFilterValue = "";
    
    this.selectedInput.nativeElement.value = '';
    this.selectedCtrl.setValue(null);
    var findTag = this.selectedTag.find(x=> x == Tag);

    if (Tag && !findTag) {
      this.selectedTag.push(Tag);
      this.searchTag.push(Tag);
    }
    
    let req: any = {};
    req.TechCompanyGuid = this.techCompnayGuid;
    req.Criteria = this.searchTag;

    this.searchDeviceTag(req);

  }
}
