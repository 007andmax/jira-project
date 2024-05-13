import { Subscription } from 'rxjs';
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AgentService } from 'src/app/services/agent/agent.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { KafkaStateService } from 'src/app/states/kafka/kafka-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { CommonHttpServices } from '../device/_services/common_http.service';
import { ExcelService } from '../device/_services/download_csv.service';
import { RemoteControlService } from '../device/_services/remoteControl.service';
import { DeviceFilter } from './class/devices';
import { DropDownComponent } from '../shared/drop-down/drop-down.component';
import { v4 as uuidv4 } from 'uuid';
import { DatePickerComponent } from '../shared/date-picker/date-picker.component';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { Device } from '../company-devices/class/device';
import { DevicesService } from 'src/app/services/devices/devices.service';


@Component({
  selector: 'devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit, OnDestroy {
  @ViewChild("templatePowersell") template;
  @ViewChild("templateConnection") templateconnection;
  @ViewChild("screenConnect") screenConnect;
  @ViewChild("screenConnectAcces") screenConnectAcces;
  @ViewChild('dropdownModel') dropdownModel: DropDownComponent;
  @ViewChild('dropdowndeviceCompany') dropdowndeviceCompany: DropDownComponent;
  @ViewChild('dropdowndeviceTp') dropdowndeviceTp: DropDownComponent;
  @ViewChild('dropdownManufacturer') dropdownManufacturer: DropDownComponent;
  @ViewChild('installdatePicker') installdatePicker: DatePickerComponent;
  @ViewChild('warrantydatePicker') warrantydatePicker: DatePickerComponent;
  @ViewChild('dropdownManufacturersidebar') dropdownManufacturersidebar: DropDownComponent;
  @ViewChild('dropdownModelSidebar') dropdownModelSidebar: DropDownComponent;
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
  showPreloader: boolean = false;
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
  isOfflineDeviceSelected: boolean = false;
  selectedAssetList: any[] = [];
  opened: boolean = false;
  manufactureId: any;
  selectManufactureNames: any;
  manufactureList: any[] = [];
  selectModelList: any[] = [];
  selectModelName: any;
  modelId: any;
  isDisabled: boolean = true;
  asset: any = undefined;
  installDate: Date = new Date();
  warrantyDate: Date = new Date();
  open: boolean = false;
  tab: string = "SYSTEM";
  assetData: any = undefined;
  softwareList: any = undefined;
  Preloader: boolean = true;
  networkData: any = undefined;
  toggleWindowSpecifications: boolean = false;
  toggleDeviceSpecifications: boolean = false;
  toggleIpSettings: boolean = false;
  comapanyId: string;
  deviceName: string;
  deviceTypId: Number;
  assetTagName: string;
  note: string;
  selectedSidebarTag: any[] = [];
  companies = [];
  sidetagFilterValue: string = "";
  assetSidebarTag: any = [];
  filteredSidebarTag = [];
  selectedTagDevice: any[] = [];
  assetTag: any = [];
  filteredTag = [];
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
  devices_resize: boolean = false;
  System: any = undefined;
  serialnumber: string = "";
  templatepdf: string = "PDF_TEMPLATE";
  @ViewChild('dropdownServices') selectedInput: ElementRef<HTMLInputElement>;
  clientCompanyGuid: string;
  IsUpdateInstalling: boolean = false;
  IsCurrentConfigLoading: boolean = false;
  searchTagName: any;
  todaysDate: any;
  isAdvSearchOpen: boolean = false;
  advanceSearchHardware = [];
  advanceSearchModel = [];
  advanceSearchManufacturer = [];
  advanceSearchSoftwareItem = [];
  advanceSearchOperatingVersion = [];
  advanceSearchOperatingType = [];
  advanceSearchMemory: number = 0;
  advanceSearchDiskSpace: number = 0;
  advanceSearchFreeSpace: number = 0;
  advanceSearchMemorySelect: any;
  advanceSearchDiskSpaceSelect: any;
  advanceSearchFreeSpaceSelect: any;
  advanceSearchOperation: any[] = [
    {
      "name": "=",
    },
    {
      "name": ">"
    },
    {
      "name": "<"
    }
  ]
  advancesearchCompanyTag = [];
  advancesearchHardwareTag = [];
  advancesearchManufacturerTag = [];
  advancesearchModelTag = [];
  advancesearchSoftwareTag = [];
  advancesearchOSVersion = [];
  advancesearchOSType = [];
  advancesearchOSVersionNameTag = [];
  advancesearchCompanyFilterValue: string = "";
  advancesearchHardwareFilterValue: string = "";
  advancesearchManufacturerFilterValue: string = "";
  advancesearchModelFilterValue: string = "";
  advancesearchSoftwareFilterValue: string = "";
  advancesearchOSVersionNameFilterValue: string = "";
  advancesearchPreloader: boolean = false;
  devices: any[] = [];
  tempDevices: any[] = [];
  deviceIPAddress: string;
  deviceMacAddress: string;
  deviceRemotePort: string;
  deviceSuccess: boolean = true;
  sub: Subscription = new Subscription();
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
    private companiesState: CompaniesStateService,
    public draftEmailStateService: DraftEmailStateService,
    private devicesStateService: DevicesStateService,
    private devicesService: DevicesService,
  ) { }

  ngOnInit() {
    // this.companiesState.onInit();
    //this.devicesStateService.onInit();
    this.clientName = "All Companies";
    this.leftPanelStateService.changeStateWithoutNavigate('new-devices');

    if (this.companiesStateService.getCompanies().length > 0) this.getClientsList(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
    this.onPowerShellCommand();

    this.company = this.companiesStateService.getCurrentCompany();
    //load if company data available
    if (this.company) {
      this.load(this.company);
    }
    let onCurrentCompany = this.companiesStateService.onCurrentCompany.subscribe(data => {
      this.load(data);
      // this.getManufacturers(data.id);
      //  this.getModels(data.id);
    });
    this.sub.add(onCurrentCompany);
    let onSetAccessToken = this.agentService.onSetAccessToken.subscribe(data => {
      if (this.currentCompany) this.getManufacturers(data.id);
      if (this.currentCompany) this.getModels(data.id);
      if (this.currentCompany) this.getSoftwarItem(data.id);
      if (this.currentCompany) this.getOperatingSystemVersion(data.id);
      if (this.currentCompany) this.getOperatingSystemType(data.id);
    })
    this.sub.add(onSetAccessToken);

    let onSearchChange = this.leftPanelStateService.onSearchChange.subscribe(data => {
      this.selectedTag = JSON.parse(data.Json) || [];
      this.searchTag = this.selectedTag;
      localStorage.removeItem("currentSearch");
      this.add(undefined);
    });
    this.sub.add(onSearchChange);


    let onSearchCompanyChange = this.leftPanelStateService.onSearchCompanyChange.subscribe(data => {
      this.selectedTag = [];
      if (data.name != 'undefined' && data.name != null && data.name != "") {
        this.selectedTag.push(data.name);
      }
      this.searchTag = this.selectedTag;
      localStorage.removeItem("currentSearchCompany");
      this.add(undefined);
    })
    this.sub.add(onSearchCompanyChange);
    let onDeviceUninstalled = this.devicesStateService.onChangeDevice.subscribe(newChange => {
      if (this.clientCompanyGuid == newChange.data.clientCompanyId) this.devicesStateService.changeDevice(this.devices, newChange);
    })
    this.sub.add(onDeviceUninstalled);

    let onCurrentConfig = this.kafkaStateService.onCurrentConfig.subscribe((resp) => {
      if (resp.length > 0) {
        this.onCurrentConfig(resp)
      }
    });
    this.sub.add(onCurrentConfig);

    let onInstallWindowsUpdates = this.kafkaStateService.onInstallWindowsUpdates.subscribe((resp) => {
      this.IsCurrentConfigLoading = true;
      this.agentService.GetCurrentConfig(this.asset.ID);
    });
    this.sub.add(onInstallWindowsUpdates);
    this.CurrentUser();

    this.todaysDate = Date.now();
  }

  getCountSelected() {
    return this.assetList.filter(item => item.selected).length;
  }
  parseDateFromDatePicker(value) {
    return moment(new Date(value.year, value.month - 1, value.day)).format('YYYY/MM/DD');
  }
  load(company: any) {
    this.company = company;
    this.currentCompany = company;
    this.techCompnayGuid = this.currentCompany.id;
    if ((!localStorage.getItem("currentSearch")) && (!localStorage.getItem("currentSearchCompany"))) {
      let req: any = {};
      req.TechCompanyGuid = this.techCompnayGuid;
      req.Criteria = [];
      this.getAssets();
      this.HardwareTypeList(this.techCompnayGuid);
      if (this.agentService.hasAccessToken()) this.getManufacturers(this.techCompnayGuid);
      if (this.agentService.hasAccessToken()) this.getModels(this.techCompnayGuid);
      if (this.agentService.hasAccessToken()) this.getSoftwarItem(this.techCompnayGuid);
      if (this.agentService.hasAccessToken()) this.getOperatingSystemVersion(this.techCompnayGuid);
      if (this.agentService.hasAccessToken()) this.getOperatingSystemType(this.techCompnayGuid);
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



  setPreviewDataDevice() {
    let searchData: any = localStorage.getItem("currentSearch");
    if (searchData) {
      let searchObj = JSON.parse(searchData);
      this.selectedTag = JSON.parse(searchObj.Json) || [];
      this.searchTag = this.selectedTag;
      localStorage.removeItem("currentSearch");
    }
    let searchCompanyData: any = localStorage.getItem("currentSearchCompany");
    if (searchCompanyData) {
      this.selectedTag = [];
      let searchCompanyObj = JSON.parse(searchCompanyData);
      this.selectedTag.push(searchCompanyObj.name);
      this.searchTag = this.selectedTag;
      localStorage.removeItem("currentSearchCompany");
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
      if (resp.length > 0) this.getAlldevicedata(resp[0].CompanyGuid);
      this.onFilter('CompanyName');
      this.showPreloader = false;
      this.operatingSystem = [];
      this.assetList = resp;
      this.getDevices(resp);
      this.HardwareTypeList(this.techCompnayGuid);
      this.assetList.forEach((element, index) => {
        element.online = false;
        this.assetList[index].Title =
          element.Title != "" ? element.Title : element.Name;
        if (element.AgentVersion != null) {
          this.GetDeviceListConfig(element.ID);
        }
      });
      this.loading = false;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    });
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

  HardwareTypeList(TechCompanyGuid: any) {
    this.agentService
      .getHardwareTypeByTechCompanyGuid(TechCompanyGuid)
      .subscribe((resp) => {
        this.advanceSearchHardware = resp.filter(x => x.IsActive);
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
            if (this.kafkaMessage.UpTime != "") {
              let result = this.kafkaMessage.UpTime.split(" ");

              if (result[0] == "0" && result[2] == "0" && result[4] == "0") {
                let Sec = result[6] + 's';
                asset.UpTime = Sec;
              }
              else if (result[0] == "0" && result[2] == "0" && result[4] != "0") {
                let Minutes = result[4] + 'm' + ' ' + result[6] + 's';
                asset.UpTime = Minutes;
              }
              else if (result[0] == "0" && result[2] != "0") {
                let Hours = result[2] + 'h' + ' ' + result[4] + 'm';
                asset.UpTime = Hours;
              }
              else {
                let Days = result[0] + 'd' + ' ' + result[2] + 'h';
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

  onFilter(field) {
    this.filter.onFilter(field, this.assetList);
  }

  gotoDetailDevice(Guid: string, AssetCompanyGuid: string) {
    localStorage.setItem("company_id", AssetCompanyGuid);
    const type = "workstation";
    var url = `/#/${this.companiesStateService
      .getCurrentCompany()
      .name.replaceAll(" ", "")}/device/dashboard/${type}/${Guid}`;
    window.open(url, "_blank");
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
    let data = this.selectedTag.find(x => x.toLowerCase() == event.option.viewValue.toLocaleLowerCase());
    if (!data) {
      this.selectedTag.push(event.option.viewValue);
      this.searchTag = [];
      this.searchTag = this.selectedTag;
      this.selectedInput.nativeElement.value = '';
      this.selectedCtrl.setValue(null);
      this.add(event.option.viewValue);
    }
    this.selectedInput.nativeElement.value = '';
  }

  remove(index: number) {
    this.showPreloader = true;
    this.selectedTag.splice(index, 1);
    this.searchTag = [];
    this.searchTag = this.selectedTag;
    let req: any = {};
    req.TechCompanyGuid = this.techCompnayGuid;
    req.Criteria = this.selectedTag || [];
    if (this.selectedTag.length > 0) {
      this.searchDeviceTag(req);
    }
    else {
      this.assetList = [];
      this.showPreloader = false;
    }
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  add(Tag): void {
    this.tagFilterValue = "";

    this.selectedInput.nativeElement.value = '';
    this.selectedCtrl.setValue(null);
    let findTag: any[] = [];

    if (this.selectedTag) {
      if (Tag != 'undefined' && Tag != null && Tag != "") {
        findTag = this.selectedTag.find(x => x.toLowerCase() == Tag.toLowerCase());
      }
    }

    if (Tag && !findTag) {
      this.selectedTag.push(Tag);
      this.searchTag = [];
      this.searchTag = this.selectedTag;
    }
    this.searchTagName = this.selectedTag;
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
    this.draftEmailStateService.toogleAsideAddReport({
      selectedClient: this.selectedClient,
      orientation: this.orientation,
      report: this.report,
      template: this.templatepdf,
      fileName: this.fileName,
      accountType: this.accountType
    });
  }

  printPdf() {
    this.getPdfData();
  }

  getPdfData() {
    let pdfList = [];
    this.assetList.forEach((element) => {
      pdfList.push([
        element.CompanyName.replace(",", "") || "N/A",
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
      <p style="line-height:1.5;color:#4f5f79;font-size:12px;font-family: Arial, Helvetica, sans-serif;font-weight:400;">Search devices by ` +
      this.searchTagName +
      `</p>
                  <p style="margin:0;line-height:2;color:#4f5f79;font-size:11px;font-family: Arial, Helvetica, sans-serif;font-weight:400;">Generated on ` +
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
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 25%;">Company Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 25%;">Device Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 20%;">Manufacturer</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 15%;">Model</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 15%;">SerialNumber</th>
                        </tr>
                    </thead>
                    <tbody>`;
    pdfList.forEach((element) => {
      html =
        html +
        `<tr style="width: 100%;">
          <td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 25%;vertical-align: top;">` +
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
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 15%;vertical-align: top;">` +
        element[3] +
        `</td>`;
      html =
        html +
        `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 15%;vertical-align: top;">` +
        element[4] +
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
    req.Json = JSON.stringify(this.selectedTag);
    req.Name = this.favouriteName
    req.TechCompanyGuid = this.techCompnayGuid;
    req.IsActive = true;
    this.agentService.createAssetSearch(req).subscribe((data: any) => {
      this.modalService.dismissAll();
      this.leftPanelStateService.onSearchItemAdded.emit(null);
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

  getAddDevice() {
    this.opened = true;
  }

  deviceclosed() {
    this.opened = false;
    this.getclear();
  }

  getManufacturers(TechCompanyGuid: any) {
    if (this.agentService.hasAccessToken()) {
      setTimeout(() => {
        this.getManufacturers(TechCompanyGuid);
      }, 300);
      return;
    }
    this.agentService.getManufactures(TechCompanyGuid)
      .subscribe((resp) => {
        this.advanceSearchManufacturer = resp.filter(x => x.IsActive);
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
    this.agentService
      .getModels(TechCompanyGuid)
      .subscribe((resp) => {
        this.advanceSearchModel = resp.filter(x => x.IsActive);
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

  openAside(type, asset) {
    this.devices_resize = true;
    this.open = true;
    this.tab = type;
    this.assetData = this.assetList.find((x) => x.Guid === asset.Guid);
    this.assetData.Caption = this.assetData.OperatingSystem;
    this.selectManufactureNamessidebar = this.manufactureList.find(x => x.ID == asset.ManufacturerId);
    this.selectModelNameSidebar = this.selectModelList.find(x => x.ID == asset.ModelID);
    this.operatingSystemWindow(asset);
    this.getSoftwareDetail(asset);
    this.getNetworkDetail(asset);
    this.getSecurityUpdate(asset.Guid);
    this.Preloader = false;
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  getSoftwareDetail(asset) {
    this.softwareList = [];
    this.agentService.getSoftwareListByAssetId(asset.ID).subscribe((resp) => {
      if (resp.length > 0) {
        this.softwareList = resp;
      }
    });
  }

  getNetworkDetail(asset) {
    this.networkData = [];
    this.agentService.getNetworkAdapter(asset.ID).subscribe((resp) => {
      if (resp.length > 0) {
        this.networkData = resp.find((x) => x.Gateway !== null);
      }
    });
  }

  gotiDetailDevice(Guid: string) {
    localStorage.setItem("company_id", this.companyId);
    const type = "workstation";
    var url = `/#/${this.companiesStateService
      .getCurrentCompany()
      .name.replaceAll(" ", "")}/device/dashboard/${type}/${Guid}`;
    window.open(url, "_blank");
  }

  menuclose() {
    this.open = false;
    this.devices_resize = false;
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

  getToDayDate() {
    return this.todaysDate;
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

  public getDate(date) {
    return (date !== "" && date !== null) ? moment(date).format('YYYY-MM-DD') : "No installed date";
  }
  public getVersion(softVersion) {
    return (softVersion !== "") ? `, version - ${softVersion}` : ', No version';
  }

  onSelectCompanyName(company) {
    this.comapanyId = company.id;
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
    data.InternalIPAddress = this.deviceIPAddress;
    data.MacAddress = this.deviceMacAddress;
    data.Port = this.deviceRemotePort;
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
      const newlinkDevice: any = { ID: id, Name: element.Name }
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

  addTags(Tag) {
    if (!Tag) {
      return;
    }
    const newTag: any = { Name: Tag };
    this.selectedSidebarTag.push(newTag);
    this.sidetagFilterValue = "";
    this.getSidebarAssetTagDropDownDetail();
  }

  getSidebarAssetTagDropDownDetail() {
    this.agentService.getAssetTag().subscribe((resp) => {
      this.assetSidebarTag = resp;
    });
  }

  onTagRemove(index: number): void {
    this.selectedSidebarTag.splice(index, 1);
  }

  onSidebarSelectTag(tag: any): void {
    const addTag: any = { ID: tag.ID, AssetID: this.asset.ID, Name: tag.Name };
    this.selectedSidebarTag.push(addTag);
    this.sidetagFilterValue = "";
  }

  addLinkDevices(Tag) {
    if (!Tag) {
      return;
    }
    this.linkDevicesTag.push(Tag);
    this.linkDevicesFilterValue = "";
  }

  Deviceremove(index: number) {
    this.linkDevicesTag.splice(index, 1);
  }

  onSearchLinkDevices(Tag) {
    if ((Tag || '').length <= 2) {
      return;
    }
    setTimeout(() => {
      let req: any = {};
      req.CompanyGuid = this.companyGuid
      req.Criteria = Tag;
      this.autosearchCompanyDevice = ['loading...'];
      if (this.cd) {
        this.cd.detectChanges();
      }
      this.agentService.autoCompleteDevices(req).subscribe((result) => {
        this.autosearchCompanyDevice = result;
        if (this.cd) {
          this.cd.detectChanges();
        }
      });
    }, 500);
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
        this.IsUpdateInstalling = true;
        this.agentService.GetWindowUpdateList(this.asset.ID, itemToUpdate);
        this.cd.detectChanges();
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

  operatingSystemWindow(asset) {
    this.agentService
      .getOperatingSystemByAssetId(asset.ID)
      .subscribe((resp) => {
        this.System = resp.filter((x) => x.IsActive);
        if (this.System.length > 0) {
          this.serialnumber = this.System[0].SerialNumber || '';
        }
        else {
          this.serialnumber = '';
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

  openAsideAdvSearch() {
    this.isAdvSearchOpen = true;
    this.devices_resize = true;
  }

  advanceSearchClosed() {
    this.isAdvSearchOpen = false;
    this.devices_resize = false;
    this.advancesearchPreloader = false;
    this.advancesearchClear();
  }

  advanchSearch() {
    this.advancesearchPreloader = true;
    let data: any = {};
    let datasize: any = {};
    data.TechCompanyGuid = this.techCompnayGuid;
    data.CompanyList = [];
    data.searchItems = [];
    if (this.advancesearchCompanyTag && this.advancesearchCompanyTag.length > 0) {
      for (let i = 0; i < this.advancesearchCompanyTag.length; i++) {
        data.CompanyList.push(this.advancesearchCompanyTag[i].id);
      }
    }
    //data.CompanyList = this.advancesearchCompanyTag;
    if (this.advanceSearchMemory > 0 && this.advanceSearchMemorySelect != undefined) {
      datasize.ColumnName = "Memory";
      datasize.Comparison = this.advanceSearchMemorySelect.name;
      datasize.Value = this.advanceSearchMemory;
      data.searchItems.push(datasize);
    }
    if (this.advanceSearchDiskSpace > 0 && this.advanceSearchDiskSpaceSelect != undefined) {
      datasize.ColumnName = "DiskSpace";
      datasize.Comparison = this.advanceSearchDiskSpaceSelect.name;
      datasize.Value = this.advanceSearchDiskSpace;
      data.searchItems.push(datasize);
    }
    if (this.advanceSearchFreeSpace > 0 && this.advanceSearchFreeSpaceSelect != undefined) {
      datasize.ColumnName = "FreeSpace";
      datasize.Comparison = this.advanceSearchFreeSpaceSelect.name;
      datasize.Value = this.advanceSearchFreeSpace;
      data.searchItems.push(datasize);
    }

    data.OSType = '';
    if (this.advancesearchOSType) {
      data.OSType = this.advancesearchOSType
    }

    data.OSVersion = [];
    if (this.advancesearchOSVersionNameTag && this.advancesearchOSVersionNameTag.length > 0) {
      for (let i = 0; i < this.advancesearchOSVersionNameTag.length; i++) {
        data.OSVersion.push(this.advancesearchOSVersionNameTag[i]);
      }
    }

    data.HardwareTypesList = [];
    if (this.advancesearchHardwareTag && this.advancesearchHardwareTag.length > 0) {
      for (let i = 0; i < this.advancesearchHardwareTag.length; i++) {
        data.HardwareTypesList.push(this.advancesearchHardwareTag[i].id);
      }
    }

    data.ManufacturerList = [];
    if (this.advancesearchManufacturerTag && this.advancesearchManufacturerTag.length > 0) {
      for (let i = 0; i < this.advancesearchManufacturerTag.length; i++) {
        data.ManufacturerList.push(this.advancesearchManufacturerTag[i].ID);
      }
    }

    data.ModelList = [];
    if (this.advancesearchModelTag && this.advancesearchModelTag.length > 0) {
      for (let i = 0; i < this.advancesearchModelTag.length; i++) {
        data.ModelList.push(this.advancesearchModelTag[i].ID);
      }
    }

    data.SoftwareList = [];
    if (this.advancesearchSoftwareTag && this.advancesearchSoftwareTag.length > 0) {
      for (let i = 0; i < this.advancesearchSoftwareTag.length; i++) {
        data.SoftwareList.push(this.advancesearchSoftwareTag[i].id);
      }
    }

    this.agentService.getAssetByAdvanceSearch(data).subscribe(
      (result) => {
        if (result && result.length > 0) {
          this.assetList = result;
          this.HardwareTypeList(this.techCompnayGuid);
          this.assetList.forEach((element, index) => {
            element.online = false;
            this.assetList[index].Title =
              element.Title != "" ? element.Title : element.Name;
            if (element.AgentVersion != null) {
              this.GetDeviceListConfig(element.ID);
            }
          });

          if (!this.cd['destroyed']) {
            this.cd.detectChanges();
          }
        }
        else {
          this.assetList = [];
        }
        this.advancesearchPreloader = false;
      });
  }


  getSoftwarItem(TechCompanyGuid: any) {
    this.agentService
      .getSoftwareListByTechCompanyGuid(TechCompanyGuid)
      .subscribe((resp) => {
        this.advanceSearchSoftwareItem = resp;
      });
  }

  getOperatingSystemVersion(TechCompanyGuid: any) {
    this.agentService
      .getOperationgSystemGetVersionByTechCompanyGuid(TechCompanyGuid)
      .subscribe((resp) => {
        this.advanceSearchOperatingVersion = resp;
      });
  }

  getOperatingSystemType(TechCompanyGuid: any) {
    this.agentService
      .getOperationgSystemGetTypeByTechCompanyGuid(TechCompanyGuid)
      .subscribe((resp) => {
        this.advanceSearchOperatingType = resp;
      });
  }

  AdvanceSearchOSVersionName(OSVersion) {
    this.advancesearchOSVersion = [];
    if (OSVersion != undefined || OSVersion != null) {
      this.advancesearchOSVersion.push(OSVersion);
    }
  }

  AdvanceSearchOSType(OSType) {
    this.advancesearchOSType = [];
    if (OSType != undefined || OSType != null) {
      this.advancesearchOSType.push(OSType);
    }
  }

  AdvanceSearchMemory(memory) {
    if (memory != undefined || memory != null) {
      this.advanceSearchMemorySelect = memory;
    }
  }

  AdvanceSearchDiskSpace(diskSpace) {
    if (diskSpace != undefined || diskSpace != null) {
      this.advanceSearchDiskSpaceSelect = diskSpace;
    }
  }

  AdvanceSearchFreeSpace(freeSpace) {
    if (freeSpace != undefined || freeSpace != null) {
      this.advanceSearchFreeSpaceSelect = freeSpace;
    }
  }

  onCompaniesSelectTag(Tag) {
    if (this.advancesearchCompanyTag.length > 0) {
      let result = this.advancesearchCompanyTag.find(x => x.id == Tag.id);
      if (result) {
        return;
      }
    }
    this.advancesearchCompanyTag.push(Tag);
    this.advancesearchCompanyFilterValue = "";
  }

  searchCompanyRemove(index: number) {
    this.advancesearchCompanyTag.splice(index, 1);
  }

  searcOSVersionNameRemove(index: number) {
    this.advancesearchOSVersionNameTag.splice(index, 1);
  }

  onHardwareSelectTag(Tag) {
    if (this.advancesearchHardwareTag.length > 0) {
      let result = this.advancesearchHardwareTag.find(x => x.ID == Tag.ID);
      if (result) {
        return;
      }
    }
    this.advancesearchHardwareTag.push(Tag);
    this.advancesearchHardwareFilterValue = "";
  }

  onOSVersionNameSelectTag(Tag) {
    if (this.advancesearchOSVersionNameTag && this.advancesearchOSVersionNameTag.length > 0) {
      let result = this.advancesearchOSVersionNameTag.find(x => x == Tag);
      if (result) {
        return;
      }
    }
    this.advancesearchOSVersionNameTag.push(Tag);
    this.advancesearchOSVersionNameFilterValue = "";
  }

  searchHardwareRemove(index: number) {
    this.advancesearchHardwareTag.splice(index, 1);
  }

  onManufacturerSelectTag(Tag) {
    if (this.advancesearchManufacturerTag.length > 0) {
      let result = this.advancesearchManufacturerTag.find(x => x.ID == Tag.ID);
      if (result) {
        return;
      }
    }
    this.advancesearchManufacturerTag.push(Tag);
    this.advancesearchManufacturerFilterValue = "";
  }


  searchManufacturerRemove(index: number) {
    this.advancesearchManufacturerTag.splice(index, 1);
  }

  onModelSelectTag(Tag) {
    if (this.advancesearchModelTag.length > 0) {
      let result = this.advancesearchModelTag.find(x => x.ID == Tag.ID);
      if (result) {
        return;
      }
    }
    this.advancesearchModelTag.push(Tag);
    this.advancesearchModelFilterValue = "";
  }

  searchModelRemove(index: number) {
    this.advancesearchModelTag.splice(index, 1);
  }

  onSoftwareSelectTag(Tag) {
    if (this.advancesearchSoftwareTag.length > 0) {
      let result = this.advancesearchSoftwareTag.find(x => x.DisplayName == Tag.DisplayName);
      if (result) {
        return;
      }
    }
    this.advancesearchSoftwareTag.push(Tag);
    this.advancesearchSoftwareFilterValue = "";
  }

  searchSoftwareRemove(index: number) {
    this.advancesearchSoftwareTag.splice(index, 1);
  }

  advancesearchClear() {
    this.advancesearchCompanyTag = [];
    this.advancesearchOSVersion = [];
    this.advancesearchOSType = [];
    this.advancesearchHardwareTag = [];
    this.advancesearchManufacturerTag = [];
    this.advancesearchModelTag = [];
    this.advancesearchSoftwareTag = [];
    this.advanceSearchDiskSpace = 0;
    this.advanceSearchFreeSpace = 0;
    this.advanceSearchMemory = 0;
  }

  getLastCheckIn(asset) {
    let result = '';
    if (!asset) {
      return;
    }
    if (asset.LastCheckInDate != null && asset.LastCheckInDate != '' && asset.LastCheckInDate != undefined) {
      let humanData = moment.duration(moment().diff(moment(asset.LastCheckInDate)));
      if (humanData.years() != 0) {
        result = result + humanData.years() + 'y' + ' ' + humanData.months() + 'mo';
      }
      if (humanData.years() == 0 && humanData.months() != 0) {
        result = result + humanData.months() + 'mo' + ' ' + humanData.days() + 'd';
      }
      if (humanData.years() == 0 && humanData.months() == 0 && humanData.days() != 0) {
        result = result + humanData.days() + 'd' + ' ' + humanData.hours() + 'h';
      }
      if (humanData.years() == 0 && humanData.months() == 0 && humanData.days() == 0 && humanData.hours() != 0) {
        result = result + humanData.hours() + 'h' + ' ' + humanData.minutes() + 'm';
      }
      if (humanData.years() == 0 && humanData.months() == 0 && humanData.days() == 0 && humanData.hours() == 0 && humanData.minutes() != 0) {
        result = result + humanData.minutes() + 'm' + ' ' + humanData.seconds() + 's';
      }
      if (humanData.years() == 0 && humanData.months() == 0 && humanData.days() == 0 && humanData.hours() == 0 && humanData.minutes() == 0 && humanData.seconds() != 0) {
        result = result + humanData.seconds() + 's';
      }
    }
    return result
  }

  removeMicrosoft(assetOperationgSystem) {
    if (!assetOperationgSystem) {
      return;
    }
    return assetOperationgSystem.replace("Microsoft", "");
  }

  getAlldevicedata(id) {
    if (id) {
      this.clientCompanyGuid = id;
      this.devicesService.getCompanyDevices(id).subscribe((data: any) => {
        if (Object.keys(data).length > 0) {
          this.devices = data[id].map(item => new Device(item));
        } else {
          this.devices = [];
        }
      });
      this.tempDevices.forEach(item => {
        if (item[id].length) {
          item[id].forEach(data => {
            this.devices.push(data);
          })
        }
      })
    }
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
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
