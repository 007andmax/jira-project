import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AgentService } from 'src/app/services/agent/agent.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { KafkaStateService } from 'src/app/states/kafka/kafka-state.service';
import { NETWORK_REMOVE_DEVICE } from '../../const/confirm';
import { DisabledBtnDirective } from '../../directives/disabled-btn.directive';
import { DevicesService } from '../../services/devices/devices.service';
import { PasswordManagerService } from '../../services/password-manager/password-manager.service';
import { PermissionsService } from '../../services/permissions/permissions.service';
import { WebsocketService } from '../../services/websocket/websocket.service';
import { DevicesRealTimeService } from '../../states/devices/devices-real-time.service';
import { DevicesStateService } from '../../states/devices/devices-state.service';
import { LeftPanelStateService } from '../../states/left-panel/left-panel-state.service';
import { NetworkScanStateService } from '../../states/network-scan/network-scan-state.service';
import { Device } from '../company-devices/class/device';
import { ConfirmStateService } from '../shared/confirm/services/confirm-state.service';
import { NetworkScanDevice } from './class/network-scan-device';
import { NetworkScanDevices } from './class/network-scan-devices';
import { NetworkScanFilter } from './class/network-scan-filter';
import { NetworkScanInstallAgent } from './class/network-scan-install-agent';
import { NetworkScanSomeInfoForDevice } from './class/network-scan-some-info-for-devices';
import { installationStatuses } from './const/const';
import { CompanyNetworkScanService } from './services/company-network-scan.service';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-network-scan',
  templateUrl: './company-network-scan.component.html',
  styleUrls: ['./company-network-scan.component.scss'],
  providers: [CompanyNetworkScanService]
})
export class CompanyNetworkScanComponent implements OnInit, OnDestroy {
  @ViewChild('btnInstallAgent') btnInstallAgent: DisabledBtnDirective;
  devices: Array<Device> = [];
  networkScanInstallAgent: NetworkScanInstallAgent = new NetworkScanInstallAgent();
  networkScanDevices: NetworkScanDevices = new NetworkScanDevices();
  networkScanSomeInfoForDevice: NetworkScanSomeInfoForDevice;
  masterAgent: Device = null;
  showPreloader: boolean = true;
  noExistDevices: boolean = false;
  showMinPreloader: boolean = false;
  isGetDevices: boolean = false;
  selectAllDevices: boolean = false;
  companyId: string;
  isScaning: boolean = false;
  networkScanFilter: NetworkScanFilter = new NetworkScanFilter(new CompanyNetworkScanService);
  sub: Subscription = new Subscription();
  assetList: any[] = [];
  filteredAssetList: any[] = [];
  kafkaMessage: any;
  networkvalue: any[] = [];
  nets: [] = [];
  asset: any;
  assetName: any;  
  selectedMasterAgent:any;
  nonAgentVersionList: any[] = [];  
  constructor(private devicesStateService: DevicesStateService,
    private devicesService: DevicesService,
    private permissionsService: PermissionsService,
    private networkScanStateService: NetworkScanStateService,
    private devicesRealTimeService: DevicesRealTimeService,
    private passwordManagerService: PasswordManagerService,
    public activateRoute: ActivatedRoute,
    private confirmStateService: ConfirmStateService,
    private companyNetworkScanService: CompanyNetworkScanService,
    private leftPanelStateService: LeftPanelStateService,
    private companiesStateService: CompaniesStateService,
    private websocketService: WebsocketService,
    private agentService: AgentService,
    public cd: ChangeDetectorRef,
    private kafkaStateService: KafkaStateService,
    private ngZone: NgZone,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.kafkaStateService.onNetworkScan.subscribe((resp) => {
      this.onNetworkScan(resp)
    });
    this.leftPanelStateService.changeStateWithoutNavigate('company-network-scan');
    let id = this.activateRoute.snapshot.params['id'];
    if (id) this.companiesStateService.setCompanyRoutingId(id);
    let subscription = this.activateRoute.params.subscribe(params => {
      id = params['id'];
      if (id) this.companiesStateService.setCompanyRoutingId(id);
      this.companyId = id;
      this.devicesStateService.subsribeToNetScan(this.companyId);
      this.getDevices();
    });
     
  }

  getDevices() {
    if (!this.agentService.hasAccessToken()) {
      setTimeout(() => {
        this.getDevices();
      }, 300);
      return;
    }

    this.AssetDetail();
  }

  AssetDetail() {    
    this.agentService.getAssetsByCompanyId(this.companyId).subscribe((resp) => {      
      if (resp.length > 0) {
        this.isGetDevices = true
        this.assetList = resp;
        this.filteredAssetList = resp.filter(x => x.AgentVersion);                
        this.masterAgent = this.assetList.find(x => x.IsMasterAgent == true);
        if (this.masterAgent) {
          this.masterAgent.online = true;
        }   
        this.selectedMasterAgent = this.assetList.find(x=>x.IsMasterAgent == true);                       
        this.selectMasterNetwork(this.selectedMasterAgent.ID);         
      }
      else {
        this.isGetDevices = false;
      }
      this.showPreloader = false;
    })
  }

  selectMasterNetwork(Id) {      
    this.asset = this.assetList.find((x) => x.ID == Id);
    this.assetName = this.asset.Name;
    let data: any = {};
    data.AssetID = Id;
    data.MessageType = "NetworkScan";
    this.showMinPreloader = true;
    this.agentService.SendNetworkCommand(data);
  }

  onNetworkScan(resp: any) {
    this.ngZone.run(() => {
      let data = JSON.parse(resp[0].Value);
      if (data && data.length > 0) {
        let createdOn = data[0].CreatedOn;
        this.networkvalue = data.filter(x => x.CreatedOn == createdOn);
      }
      else {
        this.noExistDevices = true;
      }
      this.showMinPreloader = false;
    });
  }

  public AddAsset(item: any) {
    let data: any = {};
    data.Guid = uuidv4();
    data.CompanyGuid = this.asset.CompanyGuid;
    data.Name = item.Title ? item.Title : item.MacAddress;
    data.Tag = "";
    data.Manufacturer = item.Manufacturer;
    data.Model = "";
    data.HardwareTypeID = "";
    data.InternalIPAddress = item.IP;
    data.ExternalIPAddress = "";
    data.Location = "";
    data.Site = "";
    data.Description = "";
    data.Title = item.Title ? item.Title : item.MacAddress;
    item.Guid = data.Guid;

    this.agentService.nonAgentAsset(data).subscribe((result) => {
      this.toastr.success("Device added!");
      item.IsAgentInstalled = true;
    },
      error => {
        this.toastr.error("Error adding device, please try again!");
      });
  }


  checkCanInstallAgent() {
    return this.checkSelected() && this.networkScanInstallAgent.getCredential();
  }
  installAgent() {
    this.btnInstallAgent.setDisabled(true);
    let selectedAsset = this.networkvalue.find(x => x.selected == true);
    var cred = this.networkScanInstallAgent.getCredential();
    let data: any = {};
    data.MessageType = "NetworkScan";
    data.Username = cred.username;
    data.Password = cred.password;
    data.RemoteAgentItem = [];
    let item: any = {};
    item.IP = selectedAsset.IP;
    item.HostName = selectedAsset.HostName;
    item.ReturnMessage = "";
    item.success = "";
    data.RemoteAgentItem.push(item);
    this.agentService.SendNetworkCommand(data);
  }
  onSelectCredential(data) {
    this.networkScanInstallAgent.setCredential(data);
    this.passwordManagerService.setOpenRecord(data.id).subscribe((res: any) => {
      this.networkScanInstallAgent.getCredential().setPassword(res.password);
    })
  }
  onSelectDevice() {
    this.selectAllDevices = true;
    this.networkScanDevices.devices.forEach(item => {
      if (!item.selected) this.selectAllDevices = false;
    })

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
  checkSelected() {
    return (!this.networkvalue) ? false : this.networkvalue.find(item => item.selected);
  }
  onToggleAll(event) {
    this.networkScanDevices.devices.forEach(item => {
      item.selected = event.target.checked;
    })
  }
  runScanDevices() {
    if (!this.masterAgent.online || this.isScaning) return;
    this.devicesService.runScanDevices(this.companyId).subscribe(data => {
      this.isScaning = true;
    })
  }

  setSort(data) {
    this.networkScanFilter.onSort(data, this.networkScanDevices.devices);
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  openAside() {
    this.networkScanStateService.openAside();
  }
  getSomeInfoForDevices() {
    return new Promise((resolve, reject) => {
      this.isGetDevices = true;
      this.devicesService.getSomeInfoForDevices(this.companyId).subscribe(data => {
        this.networkScanSomeInfoForDevice = new NetworkScanSomeInfoForDevice(data);
        resolve(true);

      })
    });

  }
  selectMasterAgent(device) {
    this.devicesService.markDeviceAsMaster(this.companyId, device.agentId).subscribe(data => {
    })
  }

  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.websocketService.unSubsribeNetScan();
    this.companiesStateService.setCompanyRoutingId(null);
  }
}
