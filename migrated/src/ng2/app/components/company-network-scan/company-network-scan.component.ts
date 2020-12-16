import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DevicesService } from '../../services/devices/devices.service';
import { PermissionsService } from '../../services/permissions/permissions.service';
import { DevicesRealTimeService } from '../../states/devices/devices-real-time.service';
import { DevicesStateService } from '../../states/devices/devices-state.service';
import { NetworkScanStateService } from '../../states/network-scan/network-scan-state.service';

import { Device } from '../company-devices/class/device';
import { NetworkScanDevice } from './class/network-scan-device';
import { NetworkScanDevices } from './class/network-scan-devices';
import { NetworkScanSomeInfoForDevice } from './class/network-scan-some-info-for-devices';
import { installationStatuses } from './const/const';

@Component({
  selector: 'app-company-network-scan',
  templateUrl: './company-network-scan.component.html',
  styleUrls: ['./company-network-scan.component.scss']
})
export class CompanyNetworkScanComponent implements OnInit, OnDestroy {
  devices: Array<Device> = [];
  networkScanDevices: NetworkScanDevices;
  networkScanSomeInfoForDevice: NetworkScanSomeInfoForDevice;
  masterAgent: Device = null;
  showPreloader: boolean = true;
  isGetDevices: boolean = false;
  companyId: string;
  isScaning: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private devicesStateService: DevicesStateService,
    private devicesService: DevicesService,
    private permissionsService: PermissionsService,
    private networkScanStateService: NetworkScanStateService,
    private devicesRealTimeService: DevicesRealTimeService,
    public cd: ChangeDetectorRef,) { }


  ngOnInit() {
    this.companyId = localStorage.getItem("company_id");
    this.devicesStateService.subsribeToNetScan(this.companyId);
    if (this.devicesStateService.getAllDevices()) {
      this.devices = (this.devicesStateService.getAllDevices()[this.companyId]) ? JSON.parse(JSON.stringify(this.devicesStateService.getAllDevices()[this.companyId])).map(item => new Device(item)) : [];
      this.getSomeInfoForDevices();
      this.showPreloader = false;
      this.cd.detectChanges();
    }
    let getOnDevices = this.devicesStateService.getOnDevices().subscribe(data => {

      this.devices = (data[this.companyId]) ? JSON.parse(JSON.stringify(data[this.companyId])).map(item => new Device(item)) : [];
      if (!this.isGetDevices) this.getSomeInfoForDevices();
      this.cd.detectChanges();
      this.showPreloader = false;
    })
    this.sub.add(getOnDevices);
    this.devicesStateService.getOnChangeInfoForDevice().subscribe(data => {
      console.log("data", data);
      if (data.masterAgentId == this.masterAgent.agentId) {
        console.log("data", data);
        this.networkScanSomeInfoForDevice = new NetworkScanSomeInfoForDevice(data);
        if (this.getPermissions('NETWORK_SCAN_CLIENTS')) this.getLastScanDevices();
      }


    })
    this.devicesRealTimeService.netScanArray.subscribe(newChange => {
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
      }
      if (newChange.action === 'REMOTE_INSTALL' || newChange.action === 'REMOTE_INSTALL_INFO') {
        let findIndex = this.networkScanDevices.devices.findIndex(item => item.deviceId === newChange.data.deviceId || item.deviceId === newChange.data.netScanId);
        console.log("findIndex", findIndex);
        if (findIndex > -1) {
          let statusName = newChange.data.status;
          let status = installationStatuses[statusName];
          if (statusName === 'MANAGED') {
            this.networkScanDevices.devices[findIndex].setAgentStatus('managed');
          } else {
            this.networkScanDevices.devices[findIndex].setMessage(status.message);
          }
          console.log("statusName", statusName);
          console.log("status", status);
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
  }
  private getLastScanDevices() {
    this.devicesService.getLastScanDevices(this.companyId).subscribe((res: any) => {
      let networkScan = JSON.parse(res.networkScan);
      console.log("networkScan", networkScan);
      this.networkScanDevices = new NetworkScanDevices(networkScan);
      this.cd.detectChanges();
    })
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  openAside() {
    this.networkScanStateService.openAside();
  }
  getSomeInfoForDevices() {
    this.isGetDevices = true;
    this.devicesService.getSomeInfoForDevices(this.companyId).subscribe(data => {
      console.log("data", data);
      this.networkScanSomeInfoForDevice = new NetworkScanSomeInfoForDevice(data);
      console.log("this.networkScanSomeInfoForDevice", this.networkScanSomeInfoForDevice);
      this.findMasterAgent();
    })
  }
  selectMasterAgent(device) {
    console.log("device", device);
    this.masterAgent = device;
    this.devicesService.markDeviceAsMaster(this.companyId, device.agentId).subscribe(data => {

    })
  }
  findMasterAgent() {
    let find = this.devices.find(item => item.agentId === this.networkScanSomeInfoForDevice.masterAgentId);
    console.log("find", find);
    if (find) {
      this.masterAgent = find;
    } else {
      let agentsSortedByCreatedAtDate = this.devices.sort((a, b) => (new Date(a.createdAt) > new Date(b.createdAt)) ?
        1 : ((new Date(b.createdAt) > new Date(a.createdAt)) ? -1 : 0));
      this.masterAgent = agentsSortedByCreatedAtDate[0];
    }
    console.log("this.masterAgent", this.masterAgent);
    console.log("this.devices", this.devices);
    if (this.getPermissions('NETWORK_SCAN_CLIENTS')) this.getLastScanDevices();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
