import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild, } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { AgentService } from "src/app/services/agent/agent.service";
import { CompaniesStateService } from "src/app/states/company/companies-state.service";
import { KafkaStateService } from "src/app/states/kafka/kafka-state.service";
import { LeftPanelStateService } from "src/app/states/left-panel/left-panel-state.service";
import { RemoteControlService } from "../device/_services/remoteControl.service";
import { CompanyDeviceBetaFilter } from "./class/device-beta";
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import * as _ from "lodash";
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: "app-company-device-beta",
  templateUrl: "./company-device-beta.component.html",
  styleUrls: ["./company-device-beta.component.scss"],
})
export class CompanyDeviceBetaComponent implements OnInit {
  @ViewChild("templatePowersell") template;
  @ViewChild("templateConnection") templateconnection;
  @ViewChild("templatedevice") templatedevice;
  selectAllDevices: boolean = false;
  assetList: any[] = [];
  assetID: any[] = [];
  system: any;
  showPreloader: boolean = true;
  Preloader: boolean = true;
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
  selectedTag: any[] = [];
  searchTag: any[] = [];
  techCompnayGuid: string = "";
  autosearchDevice: any[] = [];
  selectedCtrl = new FormControl();
  tagFilterValue: string = "";
  currentCompany: any = null;
  companyGuid: string = "";
  closeResult: string = '';
  opened: boolean = false;
  asset: any = undefined;
  filteredTag = [];
  selectedTagDevice: any[] = [];
  tagSearch: any[] = [];
  assetTag: any = [];
  tagFilter: string = "";
  deviceName: string;
  deviceTypId: Number;
  assetTagName: string;
  modelNo: string;
  installDate: Date;
  warrantyDate: Date;
  manufacture: string;
  note: string;
  devicename: string;
  selectTag: string;

  @ViewChild('dropdownServices') selectedInput: ElementRef<HTMLInputElement>;


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
  ) { }

  ngOnInit() {
    this.opened = true;
    this.companyId = this.activateRoute.snapshot.params["id"];
    this.leftPanelStateService.changeStateWithoutNavigate(
      "company-devices-beta"
    );
    let company = this.companiesStateService.getCurrentCompany();
    if(company) {
      this.currentCompany = company;
      this.techCompnayGuid = company.id;
      this.companyGuid = company.id;
      this.setPreviewDataDevice();      
    }
    this.companiesStateService.onCurrentCompany.subscribe(data => {
      this.currentCompany = data;
      this.techCompnayGuid = this.currentCompany.id;
      this.companyGuid = this.currentCompany.id;
      this.setPreviewDataDevice();      
    });

    this.setPreviewDataDevice();
    this.onPowerShellCommand();
    this.onAck();
    this.onInstallRemoteAgentCommand();
    this.onUninstallRemoteAgentCommand();
  }

  setPreviewDataDevice() {
    this.AssetDetail();
    this.CurrentUser();
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
    if(this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.AssetDetail();
      }, 300);
      return;
    }
    this.agentService.getAssetsByCompanyId(this.companyId).subscribe((resp) => {
      if(!resp || resp.length === 0) {
        this.showPreloader = false;
        this.assetList=[];
        this.asset = {};     
        if (this.cd) {
          this.cd.detectChanges();
        }   
        return;
      }
      this.assetList = resp;
      this.asset = resp[0];
      this.HardwareTypeList(resp[0].TechCompanyGuid);
      this.assetList.forEach((element, index) => {
        element.online = false;
        this.assetList[index].Title =
          element.Title != "" ? element.Title : element.Name;
          if(element.AgentVersion !=null){
            this.GetDeviceListConfig(element.ID);
          }
        this.getAssetTagDropDownDetail();
      });
    });
    this.showPreloader = false;
  }

  GetDeviceListConfig(assetID: any) {
    this.agentService.GetDeviceListConfig(assetID);
  }


  CurrentUser() {
    this.kafkaStateService.onDeviceListConfig.subscribe((resp) => {
      if (resp.length > 0) {
        if(resp[0].Value != "Unknown message type received : GetDeviceListConfig:"){
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
      if(this.cd){
        this.cd.detectChanges();
      }
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
          this.GetDeviceListConfig(resp.data.AssetID)
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
    if (command === 'm') {
      this.agentService.getAssetByGuid(assetId).subscribe((resp) => {
        let cAsset = resp[0];
        cAsset.IsMasterAgent = true;

        this.agentService.overrideAsset(cAsset).subscribe(result => {
          this.toastr.success('Device set as master agent');
        });

      });
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
        (error) => { }
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

  openAside(type, asset) {
    this.open = true;
    this.tab = type;
    this.assetData = this.assetList.find((x) => x.Guid === asset.Guid);
    this.getSoftwareDetail(asset);
    this.getNetworkDetail(asset);
    this.Preloader = false;
  }

  menuclose() {
    this.open = false;
    this.tab = "SYSTEM";
  }

  updateAsset() {
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

  updateOperationgSystem(id, asset) {
    let data = this.operatingSystem.find((x) => x.AssetID === id);
    data.OSArchitecture = asset.OSArchitecture;
    this.agentService.overrideOperationSystem(data).subscribe(
      (resp) => {
        this.setPreviewDataDevice();
      },
      (error) => {
        this.toastr.error("Something went wrong please try again.");
      }
    );

  }

  getSoftwareDetail(asset) {
    this.softwareList = [];
    this.agentService.getSoftwareListByAssetId(asset.ID).subscribe((resp) => {
      if (resp.length > 0) {
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
    this.networkData = [];
    this.agentService.getNetworkAdapter(asset.ID).subscribe((resp) => {
      if (resp.length > 0) {
        this.networkData = resp[0];
      }
    });
  }

  public chackDefaultValue(value) {
    return (!value || value === "") ? "N/A" : value.replace("Microsoft", "");
  }

  getLinkSpeed(value) {
    return ((value != 0 && value != undefined)) ? (Number(value / 1000000)) : 0;
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

  onOperatingSystem(data, type) {
    if (type === "Warranty") {
      this.assetData.WarrantyExpires = data || '0001-01-01';
    }
    if (type === "Install") {
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

  gotiDetailDevice(Guid: string) {
    localStorage.setItem("company_id", this.companyId);
    const type = "workstation";
    var url = `/#/${this.companiesStateService
      .getCurrentCompany()
      .name.replaceAll(" ", "")}/device/dashboard/${type}/${Guid}`;
    window.open(url, "_blank");
  }

  onSearchTag(Tag) {
    console.log('onSearchTag fired');
    if ((Tag || '').length <= 2) {
      return;
    }
    setTimeout(() => {
      let req: any = {};
      req.TechCompanyGuid = this.techCompnayGuid;
      req.CompanyGuid = this.companyGuid
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

  selectedSearch(event: MatAutocompleteSelectedEvent): void {
    console.log('selected fired');
    this.selectedTag.push(event.option.viewValue);
    this.searchTag.push(event.option.viewValue);
    this.selectedInput.nativeElement.value = '';
    this.selectedCtrl.setValue(null);
    this.add(event.option.viewValue);
  }

  add(Tag): void {
    console.log('add event fired');
    this.tagFilterValue = "";
    this.selectedInput.nativeElement.value = '';
    this.selectedCtrl.setValue(null);
    var findTag = this.selectedTag.find(x => x == Tag);

    if (Tag && !findTag) {
      this.selectedTag.push(Tag);
      this.searchTag.push(Tag);
    }

    let req: any = {};
    req.TechCompanyGuid = this.techCompnayGuid;
    req.Criteria = this.searchTag;

    this.searchDeviceTag(req);

  }

  searchDeviceTag(data: any) {
    this.showPreloader = true;
    if (this.selectedTag.length == 0) {
      this.autosearchDevice = [];
    }
    this.agentService.searchDeviceWithTag(data).subscribe((resp) => {
      if(!resp || resp.length === 0) {
        this.showPreloader = false;
        this.assetList=[];
        this.asset = {};   
        if (this.cd) {
          this.cd.detectChanges();
        }     
        return;
      }
      this.onFilter('CompanyName');
      this.showPreloader = false;
      this.operatingSystem = [];
      this.assetList = resp;
      this.HardwareTypeList(this.assetList[0].TechCompanyGuid);
      this.HardwareTypeList(this.assetList[0].CompanyGuid)

      this.assetList.forEach((element, index) => {
        element.online = false;
        this.assetList[index].Title =
          element.Title != "" ? element.Title : element.Name;
          if(element.AgentVersion !=null){
            this.GetDeviceListConfig(element.ID)
          }
      });

      if (this.cd) {
        this.cd.detectChanges();
      }
    });
  }

  remove(index: number) {    
    this.selectedTag.splice(index, 1);
    this.searchTag.splice(index, 1);
    if(this.selectedTag.length == 0 ) 
    {
      this.AssetDetail();
    }
    else {
      let req: any = {};
      req.TechCompanyGuid = this.techCompnayGuid;
      req.Criteria = this.selectedTag;    
      this.searchDeviceTag(req);
    }   
  }

  getAddDevice(templatedevice) {
    this.ngZone.run(() => {
      this.modalService
        .open(templatedevice, { ariaLabelledBy: "modal-basic-title", centered: false, size: 'lg', windowClass:'right' })
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

  private getDismiss(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  closed() {
    this.modalService.dismissAll("Cross click");
  }

  getAssetTagDropDownDetail() {
    this.agentService.getAssetTag().subscribe((resp) => {
      this.agentService.getAssetTagByAssetId(this.asset.ID).subscribe((res) => {
        this.selectedTagDevice = res;

        if (this.selectedTagDevice.length !== 0) {
          this.assetTag = resp;
          this.filteredTag = _.differenceBy(resp, this.selectedTagDevice, "ID");
        } else {
          this.assetTag = resp;
          this.filteredTag = resp;
        }
      });
    });
  }

  addTag(tag): void {
    console.log('add event fired');

    this.tagFilter = "";
    this.selectedInput.nativeElement.value = '';
    this.selectedCtrl.setValue(null);
    var findTag = this.selectedTagDevice.find(x => x == tag);
    this.selectTag = tag;

    if (tag && !findTag) {
      this.selectedTagDevice.push(tag);
      this.tagSearch.push(tag);
    }
  }

  onRemoveTag(index: number): void {
    const removetag: any = {
      ID: this.asset.ID,
      ID2: this.selectedTagDevice[index].ID,
      Password: "s8Y1IuPCUUYlSLMbFijHvuYhDDrEWfYjLyyYWDFvgW",
    };

    this.agentService.removeAssetTag(removetag).subscribe(
      (resp) => {
        this.selectedTagDevice.splice(index, 1);
        this.filteredTag = _.differenceBy(
          this.assetTag,
          this.selectedTagDevice,
          "ID"
        );
      }
    );
  }


  selectedSearchTag(event: MatAutocompleteSelectedEvent): void {
    console.log('selected fired');
    this.selectedTagDevice.push(event.option.viewValue);
    this.tagSearch.push(event.option.viewValue);
    this.selectedInput.nativeElement.value = '';
    this.selectedCtrl.setValue(null);
    this.addTag(event.option.viewValue);
  }

  getDeviceName(ID) {
      this.deviceTypId = ID;
  }

  getDateWarranty(date: any) {
    let dateWarrantry = new Date(date.year, date.month, date.day);
    this.warrantyDate = dateWarrantry;
  }

  getDateInstalled(date: any) {
    let dateInstalled = new Date(date.year, date.month, date.day);
    this.installDate = dateInstalled;
  }

  saveDevice() {
    let data: any = {};
    data.Guid = uuidv4();
    data.Name = this.deviceName;
    data.Title = this.deviceName;
    data.HardwareTypeID = this.deviceTypId;
    data.Tag = this.selectTag && this.selectTag.length > 0 ? this.selectTag : null;
    data.Model = this.modelNo;
    data.Manufacture = this.manufacture;
    data.NoteDescription = this.note;
    data.InstallDate = this.installDate;
    data.Warrantry = this.warrantyDate;
    data.CompanyGuid = this.asset.CompanyGuid;

    this.agentService.nonAgentAsset(data).subscribe(
      (result) => {
      this.modalService.dismissAll();
      this.toastr.success('Save non agent asset successfully');
    },
      (error) => {
        this.toastr.error('Error saving your non agent asset! Please try again');
      })
  }
}
