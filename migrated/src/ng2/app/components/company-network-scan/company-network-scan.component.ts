import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NETWORK_REMOVE_DEVICE } from '../../const/confirm';
import { DisabledBtnDirective } from '../../directives/disabled-btn.directive';
import { DevicesService } from '../../services/devices/devices.service';
import { ApiPasswordManagerService } from '../../services/password-manager/api-password-manager.service';
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
  constructor(private devicesStateService: DevicesStateService,
    private devicesService: DevicesService,
    private permissionsService: PermissionsService,
    private networkScanStateService: NetworkScanStateService,
    private devicesRealTimeService: DevicesRealTimeService,
    private apiPasswordManagerService: ApiPasswordManagerService,
    private confirmStateService: ConfirmStateService,
    private companyNetworkScanService: CompanyNetworkScanService,
    private leftPanelStateService: LeftPanelStateService,
    private websocketService: WebsocketService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.leftPanelStateService.setCompanyPage("company-network-scan");
    this.companyId = localStorage.getItem("company_id");
    this.devicesStateService.subsribeToNetScan(this.companyId);
    if (this.devicesStateService.getAllDevices()) {
      this.devices = (this.devicesStateService.getAllDevices()[this.companyId]) ? JSON.parse(JSON.stringify(this.devicesStateService.getAllDevices()[this.companyId])).map(item => new Device(item)) : [];
      this.companyNetworkScanService.onFilterName(this.devices);
      if (this.devices.length > 0) this.getSomeInfoForDevices().then(result => {
        this.findMasterAgent();
        if (this.getPermissions('NETWORK_SCAN_CLIENTS') && this.masterAgent.online) this.runScanDevices();
      });
      this.showPreloader = false;
      this.cd.detectChanges();
    }
    let getOnDevices = this.devicesStateService.getOnDevices().subscribe(data => {
      this.devices = (data[this.companyId]) ? JSON.parse(JSON.stringify(data[this.companyId])).map(item => new Device(item)) : [];
      this.companyNetworkScanService.onFilterName(this.devices);
      if (this.devices.length > 0 && !this.isGetDevices) this.getSomeInfoForDevices().then(result => {
        this.findMasterAgent();
        if (this.getPermissions('NETWORK_SCAN_CLIENTS') && this.masterAgent.online) this.runScanDevices();
      });
      this.cd.detectChanges();
      this.showPreloader = false;
    })
    this.sub.add(getOnDevices);
    let getOnChangeInfoForDevice = this.devicesStateService.getOnChangeInfoForDevice().subscribe(data => {
      if (!this.masterAgent || data.masterAgentId != this.masterAgent.agentId) {
        this.selectAllDevices = false;
        this.networkScanSomeInfoForDevice = new NetworkScanSomeInfoForDevice(data);
        if (this.getPermissions('NETWORK_SCAN_CLIENTS')) {
          this.findMasterAgent();
          this.getLastScanDevices();
        }
      }
    })
    this.sub.add(getOnChangeInfoForDevice);
    let netScanArray = this.devicesRealTimeService.netScanArray.subscribe(newChange => {
      if (newChange.action === 'NETWORK_SCAN') {
        if (newChange.data.status === 'Scanning') this.isScaning = true;
        if (newChange.data.status === 'Finished') this.isScaning = false;
        newChange.data.deviceList.forEach(element => {
          let findIndex = this.networkScanDevices.devices.findIndex(item => item.id === element.id);
          if (findIndex > -1) {
            this.networkScanDevices.devices[findIndex].update(element);
          } else {
            this.networkScanDevices.devices.push(new NetworkScanDevice(element));
          }
        });
        this.networkScanFilter.sortByCurrentFilter(this.networkScanDevices.devices);
      }
      if (newChange.action === 'REMOTE_INSTALL' || newChange.action === 'REMOTE_INSTALL_INFO') {
        let findIndex = this.networkScanDevices.devices.findIndex(item => item.id === newChange.data.netScanId);
        if (findIndex > -1) {
          let statusName = newChange.data.status;
          let status = installationStatuses[statusName];
          if (statusName === 'MANAGED') {
            this.networkScanDevices.devices[findIndex].setAgentStatus('managed');
            this.networkScanDevices.devices[findIndex].setMessage(status.message);
          } else {
            this.networkScanDevices.devices[findIndex].setAgentStatus(status.status);
            this.networkScanDevices.devices[findIndex].setMessage(status.message);
          }
        }
      }
      if (newChange.action === 'AGENT_PASSWORDS_CHANGED') {
        newChange.data.forEach(element => {
          let findIndex = this.networkScanDevices.devices.findIndex(item => item.deviceId === element.deviceId);
          if (findIndex > -1) this.networkScanDevices.devices[findIndex].setAgentPassword(element);
        });
      }
      if (newChange.action === 'NETWORK_DEVICE_DESCRIPTON') {
        let findIndex = this.networkScanDevices.devices.findIndex(item => item.deviceId === newChange.data.deviceId);
        if (findIndex > -1) this.networkScanDevices.devices[findIndex].setDescription(newChange.data.description);
      }
      this.cd.detectChanges();
    })
    this.sub.add(netScanArray);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === NETWORK_REMOVE_DEVICE) {
          this.devicesService.sendUninstallAgentRequest(this.companyId, [this.networkScanStateService.getDeviceForRemove().deviceId]).subscribe(data => {
          })
        }
      }
    })
    this.sub.add(getConfirm);
  }
  checkCanInstallAgent() {
    return this.checkSelected() && this.networkScanInstallAgent.getCredential();
  }
  installAgent() {
    this.btnInstallAgent.setDisabled(true);
    this.devicesService.remoteInstall(this.networkScanInstallAgent.getDataForInstall(this.companyId, this.networkScanDevices.devices.filter(item => item.selected).map(item => item.id), this.masterAgent.agentId)).subscribe(data => {
      setTimeout(() => {
        this.btnInstallAgent.setDisabled(false);
        this.cd.detectChanges();
      }, 3000);
    })
  }
  onSelectCredential(data) {
    this.networkScanInstallAgent.setCredential(data);
    this.apiPasswordManagerService.setOpenRecord(data.id).subscribe((res: any) => {
      this.networkScanInstallAgent.getCredential().setPassword(res.password);
    })
  }
  onSelectDevice() {
    this.selectAllDevices = true;
    this.networkScanDevices.devices.forEach(item => {
      if (!item.selected) this.selectAllDevices = false;
    })
    this.cd.detectChanges();
  }
  checkSelected() {
    return (!this.networkScanDevices) ? false : this.networkScanDevices.devices.find(item => item.selected);
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
  private getLastScanDevices() {
    this.showMinPreloader = true;
    this.noExistDevices = false;
    this.devicesService.getLastScanDevices(this.companyId).subscribe((res: any) => {
      let networkScan = JSON.parse(res.networkScan);
      this.networkScanDevices = new NetworkScanDevices(networkScan);
      this.showMinPreloader = false;
      this.networkScanFilter.sortByCurrentFilter(this.networkScanDevices.devices);
      this.cd.detectChanges();
    }, err => {
      this.showMinPreloader = false;
      this.noExistDevices = true;
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
  findMasterAgent() {
    let find = this.devices.find(item => item.agentId === this.networkScanSomeInfoForDevice.masterAgentId);
    if (find) {
      this.masterAgent = find;
    } else {
      let agentsSortedByCreatedAtDate = this.devices.sort((a, b) => (new Date(a.createdAt) > new Date(b.createdAt)) ?
        1 : ((new Date(b.createdAt) > new Date(a.createdAt)) ? -1 : 0));
      this.masterAgent = agentsSortedByCreatedAtDate[0];
    }
    console.log("this.masterAgent", this.masterAgent);

  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.websocketService.unSubsribeNetScan();
  }
}
