import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild, } from "@angular/core";
import { FormControl } from "@angular/forms";
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
import { MatAutocompleteSelectedEvent } from '@angular/material';
import * as _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { DropDownComponent } from "../shared/drop-down/drop-down.component";
import { element } from "@angular/core/src/render3";
import { DatePickerComponent } from "../shared/date-picker/date-picker.component";
import { CommonHttpServices } from "../device/_services/common_http.service";
import { ExcelService } from "../device/_services/download_csv.service";
import { DraftEmailStateService } from "src/app/states/draft-email/draft-email-state.service";
import { DevicesStateService } from "src/app/states/devices/devices-state.service";

@Component({
  selector: "app-company-device-beta",
  templateUrl: "./company-device-beta.component.html",
  styleUrls: ["./company-device-beta.component.scss"]
})
export class CompanyDeviceBetaComponent implements OnInit {
  @ViewChild("templatePowersell") template;
  @ViewChild("templateConnection") templateconnection;
  @ViewChild('dropdownModel') dropdownModel: DropDownComponent;
  @ViewChild('dropdowndeviceCompany') dropdowndeviceCompany: DropDownComponent;
  @ViewChild('dropdowndeviceTp') dropdowndeviceTp: DropDownComponent;
  @ViewChild('dropdownManufacturer') dropdownManufacturer: DropDownComponent;
  @ViewChild('installdatePicker') installdatePicker: DatePickerComponent;
  @ViewChild('warrantydatePicker') warrantydatePicker: DatePickerComponent;
  @ViewChild('dropdownManufacturersidebar') dropdownManufacturersidebar: DropDownComponent;
  @ViewChild('dropdownModelSidebar') dropdownModelSidebar: DropDownComponent;
  selectAllDevices: boolean = false;
  assetList: any[] = [];
  assetID: any[] = [];
  system: any;
  showPreloader: boolean = false;
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
  comapanyId: string;
  assetTagName: string;
  modelNo: string;
  installDate: Date = new Date();
  warrantyDate: Date = new Date();
  manufacture: string;
  note: string;
  devicename: string;
  selectTag: string;
  selectedTagdevicelist: any[] = [];
  selectId: any[] = [];
  isOfflineDeviceSelected: boolean = false;
  selectedAssetList: any[] = [];
  manufactureId: any;
  selectManufactureNames: any;
  manufactureList: any[] = [];
  selectModelList: any[] = [];
  selectModelName: any;
  modelId: any;
  isDisabled: boolean = true;
  sidetagFilterValue: string = "";
  selectedSidebarTag: any[] = [];
  filteredSidebarTag = [];
  assetSidebarTag: any = [];
  companies = [];
  autosearchCompanyDevice: any[] = [];
  linkDevicesFilterValue: string = "";
  linkDevicesTag = [];
  selectManufactureNamessidebar: any;
  selectModelNameSidebar: any;
  securityUpdate: number;
  windowUpdatePendingList: any[] = [];
  categories: number;
  check: any[] = [];
  InstallUpdateselected: number = 0;
  selectednum = false;
  reloadWindowUpdatePendingList: any[] = [];
  isOverlay = false;
  selectAllSecurityDevices: boolean = false;
  device_beta_resize: boolean = false;
  System: any = undefined;
  serialnumber: string = "";
  clientName: string;
  loading = false;
  selectedClient = null;
  orientation: string = "PORTRAIT";
  report: string = "report-device-summary";
  fileName: string = "device-summary-report";
  accountType = "CLIENT";
  templatepdf: string = "PDF_TEMPLATE";
  @ViewChild('dropdownServices') selectedInput: ElementRef<HTMLInputElement>;

  IsUpdateInstalling: boolean = false;
  IsCurrentConfigLoading: boolean = false;
  devices: any[] = [];
  todaysDate: any;
  companyDeviceSelect:any = null;
  deviceIPAddress:string;
  deviceMacAddress:string;
  deviceRemotePort:string;

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
    private remoteControlService: RemoteControlService,
    private companiesState: CompaniesStateService,
    private commonHttpServices: CommonHttpServices,
    private excelService: ExcelService,
    public draftEmailStateService: DraftEmailStateService,
    private devicesStateService: DevicesStateService
  ) { }

  ngOnInit() {    
    this.showPreloader = true;
    this.leftPanelStateService.changeStateWithoutNavigate('company-devices-beta');    
    this.companiesState.onInit();
    this.devicesStateService.onInit();    
    this.clientName = "All Companies";
    this.companyId = this.activateRoute.snapshot.params["id"];
    let id = this.activateRoute.snapshot.params['id'];
    this.getAlldevicedata(this.activateRoute.snapshot.params['id']);
    if (id) this.companiesStateService.setCompanyRoutingId(id);
    this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.companies = this.getClientsList(data);        
    });
    let company = this.companiesStateService.getCurrentCompany();
    if (company) {
      this.currentCompany = company;
      this.techCompnayGuid = company.id;
      this.companyGuid = company.id;
      if (this.devices.length == 0) {
        this.getAlldevicedata(this.activateRoute.snapshot.params['id']);
      }      
      this.setPreviewDataDevice();
      this.getManufacturers(this.techCompnayGuid);
      this.getModels(this.techCompnayGuid);
    }
    //when current company changes
    // this.companiesStateService.onCurrentCompany.subscribe(data => {
    //   this.currentCompany = data;
    //   this.techCompnayGuid = this.currentCompany.id;
    //   this.companyGuid = this.currentCompany.id;
    //   this.setPreviewDataDevice();
    //   this.getManufacturers(this.techCompnayGuid);
    //   this.getModels(this.techCompnayGuid);
    // });

    //this.setPreviewDataDevice();
    this.onPowerShellCommand();
    this.onAck();
    this.onInstallRemoteAgentCommand();
    this.onUninstallRemoteAgentCommand();

    this.kafkaStateService.onCurrentConfig.subscribe((resp) => {
      if (resp.length > 0) {
        this.onCurrentConfig(resp)
      }
    });

    this.kafkaStateService.onInstallWindowsUpdates.subscribe((resp) => {
      this.IsCurrentConfigLoading = true;
      this.agentService.GetCurrentConfig(this.asset.ID);
    });

    this.todaysDate = Date.now();
  }

  getCountSelected() {
    return this.assetList.filter(item => item.selected).length;
  }

  setPreviewDataDevice() {    
    this.AssetDetail();
    this.CurrentUser();
  }

  toogleDevices(isChecked: boolean) {
    this.assetList.forEach((item) => {
      item.selected = this.selectAllDevices ? true : false;
    });
    this.isOfflineDeviceSelected = (this.assetList.find(item => item.selected && !item.online)) ? true : false;
    if (isChecked) {
      this.assetList.forEach((element, index) => {
        this.selectedAssetList.push(this.assetList[index]);
      })
    }
    else {
      this.selectedAssetList = [];
    }
  }
  public onFilter(field) {
    this.filter.onFilter(field, this.assetList);
  }

  onSelectDevice(index: number, isChecked: boolean) {
    let find = this.assetList.find((item) => !item.selected);
    this.selectAllDevices = find ? false : true;
    this.isOfflineDeviceSelected = (this.assetList.find(item => item.selected && !item.online)) ? true : false;
    if (isChecked) {
      this.selectedAssetList.push(this.assetList[index]);
    } else {
      let AssetId = this.assetList[index].ID;
      let AssetIndex = this.selectedAssetList.findIndex(item => item.ID == AssetId);
      this.selectedAssetList.splice(AssetIndex, 1);
    }
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
    if (this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.AssetDetail();
      }, 300);
      return;
    }
    this.agentService.getAssetsByCompanyId(this.companyId).subscribe((resp) => {                  
      if (!resp || resp.length === 0) {
        this.assetList = [];
        this.asset = {};
        if (this.cd) {
          this.cd.detectChanges();
        }
        return;
      }      
      this.assetList = resp;
      this.asset = resp[0];
      this.getDevices(this.assetList);
      this.operatingSystemWindow(resp[0].ID);
      this.HardwareTypeList(resp[0].TechCompanyGuid);
      this.showPreloader = false;
      this.assetList.forEach((element, index) => {        
        element.online = false;
        this.assetList[index].Title =
          element.Title != "" ? element.Title : element.Name;
        if (element.AgentVersion != null) {
          this.GetDeviceListConfig(element.ID);
        }
        this.getAssetTagDropDownDetail();
      });
    });
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
            if (this.kafkaMessage.UpTime != "") {
              let result = this.kafkaMessage.UpTime.split(" ");

              if (result[0] == "0" && result[2] == "0" && result[4] == "0") {
                let Sec = result[6]+'s';
                asset.UpTime = Sec;
              }
              else if (result[0] == "0" && result[2] == "0" && result[4] != "0") {
                let Minutes = result[4]+'m'+ ' ' + result[6]+'s';
                asset.UpTime = Minutes;
              }
              else if (result[0] == "0" && result[2] != "0") {
                let Hours = result[2]+'h'+ ' ' + result[4]+'m';
                asset.UpTime = Hours;
              }
              else {
                let Days = result[0]+'d'+ ' ' + result[2]+'h';
                asset.UpTime = Days;
              }
            }
          }
          asset.online = true;
        }
        if (!this.cd['destroyed']) {
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


  sendCommandHeader(command) {
    let headerData: any = {};
    if (command === "r") {
      this.assetList.forEach((element) => {
        headerData.AssetID = element.ID;
        headerData.MessageType = "RunPowerShellCommand";
        headerData.Value = "Restart-Computer";
        this.agentService.SendPowerShellCommand(headerData);
      })
    }
    if (command === "s") {
      this.assetList.forEach((element) => {
        headerData.AssetID = element.ID;
        headerData.MessageType = "RunPowerShellCommand";
        headerData.Value = "Stop-Computer";
        this.agentService.SendPowerShellCommand(headerData);
      })
    }
    if (command === "ar") {
      this.assetList.forEach((element) => {
        this.agentService.UninstallAgent(element.ID);
      })
    }
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
    this.device_beta_resize = true;
    this.open = true;
    this.tab = type;
    this.assetData = this.assetList.find((x) => x.Guid === asset.Guid);
    this.assetData.Caption = this.assetData.OperatingSystem;
    this.selectManufactureNamessidebar = this.manufactureList.find(x => x.ID == asset.ManufacturerId);
    this.selectModelNameSidebar = this.selectModelList.find(x => x.ID == asset.ModelID);
    this.operatingSystemWindow(asset.ID);
    this.getSoftwareDetail(asset);
    this.getNetworkDetail(asset);
    this.getSecurityUpdate(asset.Guid);
    this.Preloader = false;
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  menuclose() {
    this.open = false;
    this.device_beta_resize = false;
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
        this.networkData = resp.find((x) => x.Gateway !== null);
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
    return this.todaysDate;
  }

  onOperatingSystem(data, type) {
    if (type === "Warranty") {
      this.assetData.WarrantyExpires = data || null;
    }
    if (type === "Install") {
      this.assetData.InstallDate = data || null;
    }
    this.agentService.overrideAsset(this.assetData).subscribe(
      (resp) => {
      },
      (error) => {
        this.toastr.error("Something went wrong please try again.");
      }
    );
    if (this.assetData.WarrantyExpires && this.minDate(this.assetData.WarrantyExpires)) {
      this.assetData.WarrantyExpires = "";
    }

    if (this.assetData.InstallDate && this.minDate(this.assetData.InstallDate)) {
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
    let data = this.selectedTag.find(x => x.toLowerCase() == event.option.viewValue.toLocaleLowerCase());
    if (!data) {
      console.log('selected fired');
      this.selectedTag.push(event.option.viewValue);
      this.searchTag.push(event.option.viewValue);
      this.selectedInput.nativeElement.value = '';
      this.selectedCtrl.setValue(null);
      this.add(event.option.viewValue);
    }
    this.selectedInput.nativeElement.value = '';
  }

  add(Tag): void {
    console.log('add event fired');
    this.tagFilterValue = "";
    this.selectedInput.nativeElement.value = '';
    this.selectedCtrl.setValue(null);
    var findTag = this.selectedTag.find(x => x.toLowerCase() == Tag.toLowerCase());

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
      if (!resp || resp.length === 0) {
        this.showPreloader = false;
        this.assetList = [];
        this.asset = {};
        if (this.cd) {
          this.cd.detectChanges();
        }
        return;
      }
      this.onFilter('CompanyName');
      this.showPreloader = false;
      this.operatingSystem = [];
      if (this.devices.length > 0) {
        this.assetList = resp;
        this.HardwareTypeList(this.assetList[0].TechCompanyGuid);
        this.HardwareTypeList(this.assetList[0].CompanyGuid);
        this.getDevices(this.assetList);
        this.showPreloader = false;
        this.assetList.forEach((element, index) => {
          element.online = false;
          this.assetList[index].Title =
            element.Title != "" ? element.Title : element.Name;
          if (element.AgentVersion != null) {
            this.GetDeviceListConfig(element.ID)
          }
        });
      }
      else {
        this.showPreloader = false;
        this.getAlldevicedata(this.activateRoute.snapshot.params['id']);
      }

      if (this.cd) {
        this.cd.detectChanges();
      }
    });
  }

  remove(index: number) {
    this.selectedTag.splice(index, 1);
    this.searchTag.splice(index, 1);
    if (this.selectedTag.length == 0) {
      this.showPreloader = true;
      this.AssetDetail();
    }
    else {
      let req: any = {};
      req.TechCompanyGuid = this.techCompnayGuid;
      req.Criteria = this.selectedTag;
      this.searchDeviceTag(req);
    }
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  getAddDevice() {          
    this.opened = true;  
    this.companyDeviceSelect = this.companies.find(x=>x.id == this.activateRoute.snapshot.params["id"]);    
    this.onSelectCompanyName(this.companyDeviceSelect);       
  }

  closed() {
    this.opened = false;
    this.getclear();
  }

  getAssetTagDropDownDetail() {
    this.agentService.getAssetTag().subscribe((resp) => {
      this.agentService.getAssetTagByAssetId(this.asset.ID).subscribe((res) => {
        this.selectedTagDevice = res;

        if (this.selectedTagDevice.length !== 0) {
          this.assetTag = resp;
          this.filteredTag = resp;
        }
      });
    });
  }

  onRemoveTag(index: number): void {
    this.selectedTagdevicelist.splice(index, 1);
  }


  selectedSearchTag(event: MatAutocompleteSelectedEvent): void {
    console.log('selected fired');
    this.selectedTagdevicelist.push(event.option.viewValue);
    this.tagSearch.push(event.option.viewValue);
    this.selectedInput.nativeElement.value = '';
    this.selectedCtrl.setValue(null);
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
    data.ModelID = this.modelId;
    data.ManufactureID = this.manufactureId;
    data.InstallDate = moment(this.installDate).format("YYYY-MM-DD");
    data.Warrantry = moment(this.warrantyDate).format("YYYY-MM-DD");
    data.Tag = this.assetTagName;
    data.CompanyGuid = this.comapanyId;
    data.IPAddress = this.deviceIPAddress;
    data.deviceMacAddress = this.deviceMacAddress;
    data.deviceRemotePort = this.deviceRemotePort;
    this.agentService.nonAgentAsset(data).subscribe(
      (result) => {
        if (result.length > 0) {
          if (this.note != '' && this.note != undefined && this.note != null) {
            this.createNotes(result)
          }
          if (this.selectedSidebarTag.length > 0) {
            this.createTag(result, this.selectedSidebarTag)
          }
          if (this.linkDevicesTag.length > 0) {
            this.linkDevicesTags(result)
          }
          this.opened = false;
          this.setPreviewDataDevice();
          this.toastr.success('Save non agent asset successfully');
          this.getclear();
        }
      },
      (error) => {
        this.toastr.error('Error saving your non agent asset! Please try again');
      })
  }

  linkDevicesTags(id) {
    this.linkDevicesTag.forEach((element) => {
      const newlinkDevice: any = { AssetId: id, AssociatedAssetID: element.ID }
      this.agentService.createAssociatedAsset(newlinkDevice).subscribe((resp) => {

      })
    })
  }

  createNotes(id) {
    const newnote: any = { AssetID: id, IsActive: true, Description: this.note, Title: this.deviceName };
    this.agentService.addAssetNotes(newnote).subscribe((resp) => {
    })
  }

  createTag(id, Tages) {
    for (let i = 0; i < Tages.length; i++) {
      const newTag: any = { AssetID: id, Name: Tages[i].Name };
      this.agentService.addNewTag(newTag).subscribe(
        (res) => {
        }
      );
    }
  }

  onSelectTag(tag: any): void {
    const addTag: any = { ID: tag.ID, AssetID: this.asset.ID, Name: tag.Name };
    this.selectedTagdevicelist.push(addTag);
    this.selectId.push(addTag.ID);
  }

  getManufacturers(TechCompanyGuid: any) {
    if (this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getManufacturers(TechCompanyGuid);
      }, 300);
      return;
    }
    this.agentService.getManufactures(TechCompanyGuid)
      .subscribe((resp) => {
        this.manufactureList = resp;
        if (this.asset) {
          this.selectManufacture(this.asset.ManufacturerId);
        }
      });
  }

  selectManufacture(manufactureId) {
    this.selectManufactureNames = this.manufactureList.find(x => x.ID == manufactureId);
  }


  onSelectManufactureName(SelectManufacturer) {
    if (SelectManufacturer) {
      this.manufactureId = SelectManufacturer.ID;
      this.selectManufactureNames = this.manufactureList.find(x => x.ID == this.manufactureId);
      this.agentService.getModelsByManufacturer(this.manufactureId).subscribe((resp) => {
        this.selectModelList = resp;
        this.isDisabled = false;
      })
    }
    else {
      this.getModels(this.techCompnayGuid);
      this.selectManufactureNames = "";
      this.isDisabled = true;
      this.dropdownModel.clearWithOutChanges();
    }
  }

  getModels(TechCompanyGuid: any) {
    if (this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getModels(TechCompanyGuid);
      }, 300);
      return;
    }
    this.agentService
      .getModels(TechCompanyGuid)
      .subscribe((resp) => {
        this.selectModelList = resp;
        if (this.asset) {
          this.selectModel(this.asset.ModelID);
        }
      });
  }

  selectModel(modelId) {
    this.selectModelName = this.selectModelList.find(x => x.ID == modelId);
  }

  onSelectModel(SelectModel) {
    if (SelectModel) {
      this.modelId = SelectModel.ID;
      this.selectModelName = this.selectModelList.find(x => x.ID == this.modelId);
    }
    else {
      this.selectModelName = "";
    }
  }

  addTags(Tag) {
    if (!Tag) {
      return;
    }
    const newTag: any = { ID: Tag.ID, AssetID: this.asset.ID, Name: Tag };
    this.selectedSidebarTag.push(newTag);
    this.sidetagFilterValue = "";
    this.getSidebarAssetTagDropDownDetail();
  }

  getSidebarAssetTagDropDownDetail() {
    this.agentService.getAssetTag().subscribe((resp) => {
      this.assetSidebarTag = resp;
    });
  }

  onSidebarSearchTag(value: string) {
    let filter = value.toLowerCase();

    if (filter != "" && this.filteredSidebarTag.length > 0) {
      this.filteredSidebarTag = _.differenceBy(
        this.filteredSidebarTag.filter((x) => x.Name.toLowerCase().includes(filter)),
        this.selectedSidebarTag,
        "ID"
      );
    } else if (this.filteredSidebarTag.length > 0) {
      this.filteredSidebarTag = _.differenceBy(
        this.filteredSidebarTag,
        this.selectedSidebarTag,
        "ID"
      );
    } else {
      this.filteredSidebarTag = this.assetTag;
    }
  }

  onSidebarSelectTag(tag: any): void {
    const addTag: any = { ID: tag.ID, AssetID: this.asset.ID, Name: tag.Name };
    this.selectedSidebarTag.push(addTag);
    this.sidetagFilterValue = "";
  }

  onTagRemove(index: number): void {
    this.selectedSidebarTag.splice(index, 1);
  }

  getClientsList(data) {
    return data
      .filter((item) => item.accountType === "CLIENT" && !item.deletedAt)
      .sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase()
          ? 1
          : b.name.toLowerCase() > a.name.toLowerCase()
            ? -1
            : 0
      );
  }

  onSelectCompanyName(company) {                     
    if(company)
    {
      this.comapanyId = company.id;   
      this.companyDeviceSelect = company;   
    }  
    else{
      this.companyDeviceSelect = null;
    }  
  }

  Deviceremove(index: number) {
    this.linkDevicesTag.splice(index, 1);
  }

  onSearchLinkDevices(Tag) {
    console.log('onSearchLinkDevices fired');
    if ((Tag || '').length <= 2) {
      return;
    }
    let req: any = {};
    req.companyGuid = this.activateRoute.snapshot.params["id"];
    req.Criteria = Tag;
    this.agentService.autoCompleteDevices(req).subscribe((result) => {
      this.autosearchCompanyDevice = result;
      if (this.cd) {
        this.cd.detectChanges();
      }
    });
  }

  onLinkDeviceSelectTag(Tag) {
    this.linkDevicesTag.push(Tag);
    this.linkDevicesFilterValue = "";
  }

  getclear() {
    this.deviceName = "";
    this.assetTagName = "";
    this.dropdownModel.clearWithOutChanges();
    this.dropdownManufacturer.clearWithOutChanges();
    this.dropdowndeviceCompany.clearWithOutChanges();
    this.dropdowndeviceTp.clearWithOutChanges();
    this.note = "";
    this.selectedSidebarTag = [];
    this.linkDevicesTag = [];
    this.installdatePicker.reset();
    this.warrantydatePicker.reset();    
  }

  onSelectManufactureNamesidebar(SelectManufacturerSidebar) {
    if (SelectManufacturerSidebar) {
      this.manufactureId = SelectManufacturerSidebar.ID;
      this.selectManufactureNamessidebar = this.manufactureList.find(x => x.ID == this.manufactureId);
      this.agentService.getModelsByManufacturer(this.manufactureId).subscribe((resp) => {
        this.selectModelList = resp;
        this.updateAsset();
        this.updateSerialNo();
      })
    }
    else {
      this.getModels(this.techCompnayGuid);
      this.selectManufactureNamessidebar = "";
      this.dropdownModelSidebar.clearWithOutChanges();
    }
  }

  onSelectModelsidebar(SelectModelSidebar) {
    if (SelectModelSidebar) {
      this.modelId = SelectModelSidebar.ID;
      this.selectModelNameSidebar = this.selectModelList.find(x => x.ID == this.modelId);
      this.updateAsset();
      this.updateSerialNo();
    }
    else {
      this.selectModelName = "";
      this.updateAsset();
      this.updateSerialNo();
    }
  }


  getSecurityUpdate(id) {
    this.agentService.getAssetByGuid(id).subscribe((resp) => {
      if (resp.length > 0) {
        this.asset = resp[0];
        this.agentService.GetCurrentConfig(this.asset.ID);
        this.IsCurrentConfigLoading = true;
      }
    });
  }

  onCurrentConfig(resp: any) {
    if (resp.length > 0) {
      if (this.asset.ID && this.asset.ID != 0) {
        let item = resp.find((x) => x.key == this.asset.ID);
        if (item) {
          this.kafkaMessage = JSON.parse(item.Value);
          this.IsCurrentConfigLoading = false;
          this.securityUpdate = this.kafkaMessage.PendingWindowsUpdates.length;

          if (this.securityUpdate > 0) {
            this.windowUpdatePendingList = [];
            for (let i = 0; i < this.securityUpdate; i++) {
              let data: any = {};
              data.UpdateID = this.kafkaMessage.PendingWindowsUpdates[i].UpdateID;
              data.Title = this.kafkaMessage.PendingWindowsUpdates[i].Title;
              data.Size = this.kafkaMessage.PendingWindowsUpdates[i].Size;
              this.categories = this.kafkaMessage.PendingWindowsUpdates[i].Categories.length;
              if (this.categories > 0) {
                for (let j = 0; j < this.categories; j++) {
                  data.Categories = this.kafkaMessage.PendingWindowsUpdates[i].Categories[j].Name
                }
              }
              if (this.kafkaMessage.PendingWindowsUpdates[i].RebootIsRequired == "0") {
                data.RebootIsRequired = "Never Reboots"
              }
              if (this.kafkaMessage.PendingWindowsUpdates[i].RebootIsRequired == "1") {
                data.RebootIsRequired = "Always Requires Reboot";
              }
              if (this.kafkaMessage.PendingWindowsUpdates[i].RebootIsRequired == "2") {
                data.RebootIsRequired = "Can Request Reboot";
              }
              data.loading = false;
              data.IsUpdateInstalling = false;
              this.windowUpdatePendingList.push(data);
            }
          }

          if (!this.cd['destroyed']) {
            this.cd.detectChanges();
          }
        }
      }
    }

  }

  InstallUpdate() {
    let count = this.windowUpdatePendingList.filter(item => item.selected == true)
    if (count.length > 0) {
      var clonedItems = [];
      count.forEach((item) => {
        if (item.selected) {
          var itemToUpdate: any = {};
          itemToUpdate.UpdateID = item.UpdateID;
          itemToUpdate.Title = item.Title;
          itemToUpdate.RebootIsRequired = item.RebootIsRequired;

          if (itemToUpdate.RebootIsRequired == "Never Reboots") {
            itemToUpdate.RebootIsRequired = "0";
          }
          else if (itemToUpdate.RebootIsRequired == "Always Requires Reboot") {
            itemToUpdate.RebootIsRequired = "1";
          }
          else if (itemToUpdate.RebootIsRequired == "Can Request Reboot") {
            itemToUpdate.RebootIsRequired = "2";
          }
          clonedItems.push(itemToUpdate);
          item.IsUpdateInstalling = true;
        }
      });
      this.IsUpdateInstalling = true;
      this.agentService.GetWindowUpdateList(this.asset.ID, clonedItems);
      this.cd.detectChanges();
    }
  }

  toogleSecurityDevices() {
    this.windowUpdatePendingList.forEach((item) => {
      item.selected = this.selectAllSecurityDevices ? true : false;
    });
  }

  onSelectSecurityDevice() {
    let find = this.windowUpdatePendingList.find((item) => !item.selected);
    this.selectAllSecurityDevices = find ? false : true;
  }

  getSecurityCountSelected() {
    return this.windowUpdatePendingList.filter(item => item.selected).length;
  }

  SecurityUpdate(i, id) {
    if (id) {
      let index = this.windowUpdatePendingList.findIndex(item => item.UpdateID == id);
      if (index == i) {
        let item = this.windowUpdatePendingList.find(item => item.UpdateID == id);
        var itemToUpdate: any = {};
        itemToUpdate.UpdateID = item.UpdateID;
        itemToUpdate.Title = item.Title;
        itemToUpdate.RebootIsRequired = item.RebootIsRequired;

        if (itemToUpdate.RebootIsRequired == "Never Reboots") {
          itemToUpdate.RebootIsRequired = "0";
        }
        else if (itemToUpdate.RebootIsRequired == "Always Requires Reboot") {
          itemToUpdate.RebootIsRequired = "1";
        }
        else if (itemToUpdate.RebootIsRequired == "Can Request Reboot") {
          itemToUpdate.RebootIsRequired = "2";
        }
        item.IsUpdateInstalling = true;
        this.agentService.GetWindowUpdateList(this.asset.ID, itemToUpdate);
        this.cd.detectChanges();
      }
    }
  }

  operatingSystemWindow(ID) {
    this.agentService
      .getOperatingSystemByAssetId(ID)
      .subscribe((resp) => {
        this.System = resp.filter((x) => x.IsActive);
        if (this.System.length > 0) {
          this.operatingSystem = this.System[0];
          this.serialnumber = this.System[0].SerialNumber;
        }
        else {
          this.serialnumber = '';
          this.operatingSystem = '';
        }
      });
  }

  updateSerialNo() {
    this.operatingSystem.SerialNumber = this.serialnumber;
    this.agentService.overrideOperationSystem(this.operatingSystem).subscribe(
      (resp) => {
        this.toastr.success("Asset info save successfully.");
      },
      (error) => {
        this.toastr.error("Something went wrong please try again.");
      }
    );
  }

  ngOnDestroy(): void {
    this.companiesStateService.setCompanyRoutingId(null);
    this.kafkaStateService.onInstallWindowsUpdates.unsubscribe();
  }

  printPdf() {
    this.getPdfData();
  }

  getPdfData() {
    let pdfList = [];
    this.assetList.forEach((element) => {
      pdfList.push([
        element.Name.replace(",", " ") || "N/A",
        element.ManufacturerName != "" && element.ManufacturerName != null ? element.ManufacturerName.replace(",", " ") : "N/A",
        element.ModelName != "" && element.ModelName != null ? element.ModelName.replace(",", " ") : "N/A",
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
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 30%;">Device Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 25%;">Manufacturer</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 20%;">Model</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 25%;">SerialNumber</th>
                        </tr>
                    </thead>
                    <tbody>`;
    pdfList.forEach((element) => {
      html =
        html +
        `<tr style="width: 100%;">
          <td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 30%;vertical-align: top;">` +
        element[0] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 25%;vertical-align: top;">` +
        element[1] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 20%;vertical-align: top;">` +
        element[2] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 25%;vertical-align: top;">` +
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
        element.CompanyName.replace(",", "") || "N/A",
        element.Name.replace(",", " ") || "N/A",
        element.ManufacturerName != "" && element.ManufacturerName != null ? element.ManufacturerName.replace(",", " ") : "N/A",
        element.ModelName != "" && element.ModelName != null ? element.ModelName.replace(",", " ") : "N/A",
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

  sendEmail() {
    this.draftEmailStateService.toogleAsideAddReport({
      selectedClient: this.selectedClient,
      orientation: this.orientation,
      report: this.report,
      template: this.templatepdf,
      fileName: this.fileName,
      accountType: this.accountType
    });
  }

  getDevices(assetList) {
    assetList.forEach((element, index) => {
      element.RemoteOnline = false;     
      let result = this.devices.find(x => x.agentId === element.Guid);
      if (result) {
        assetList[index].RemoteOnline = result.online;       
      }
    });
  }

  getAlldevicedata(id) {
    this.devicesStateService.getOnDevices().subscribe(data => {
      if (!data[id]) return;
      if (data[id].length) {
        data[id].forEach(item => {
          this.devices.push(item);
        });
      }
    });
  }

  getLastCheckIn(asset) {
    let result = '';
    if (!asset) {
      return;
    }
    if(asset.LastCheckInDate !=null && asset.LastCheckInDate !='' && asset.LastCheckInDate !=undefined)
    {
      let humanData = moment.duration(moment().diff(moment(asset.LastCheckInDate)));
      if(humanData.years()!=0)
      {
        result = result + humanData.years()+'y'+' '+humanData.months()+'mo';
      }
      if(humanData.years()==0 && humanData.months()!=0)
      {
        result = result + humanData.months()+'mo'+' '+humanData.days()+'d';
      }
      if(humanData.years()==0 && humanData.months()==0 && humanData.days()!=0)
      {
        result = result + humanData.days()+'d'+' '+humanData.hours()+'h';
      }
      if(humanData.years()==0 && humanData.months()==0 && humanData.days()==0 && humanData.hours()!=0)
      {
        result = result + humanData.hours()+'h'+' '+humanData.minutes()+'m';
      }
      if(humanData.years()==0 && humanData.months()==0 && humanData.days()==0 && humanData.hours()==0 && humanData.minutes()!=0)
      {
        result = result + humanData.minutes()+'m'+' '+humanData.seconds()+'s';
      }
      if(humanData.years()==0 && humanData.months()==0 && humanData.days()==0 && humanData.hours()==0 && humanData.minutes()==0 && humanData.seconds()!=0)
      {
        result = result + humanData.seconds()+'s';
      }       
    }    
    return result;    
  }  

  removeMicrosoft(assetOperationgSystem){    
    if(!assetOperationgSystem){
      return;
    }
    return assetOperationgSystem.replace("Microsoft","");
  }

}


