import { Component, Input, OnInit } from '@angular/core';
import { Device } from '../../company-devices/class/device';
import { NetworkScanDevice } from '../class/network-scan-device';
import { NetworkScanSomeInfoForDevice } from '../class/network-scan-some-info-for-devices';

@Component({
  selector: 'app-company-network-scan-item',
  templateUrl: './company-network-scan-item.component.html',
  styleUrls: ['./company-network-scan-item.component.scss']
})
export class CompanyNetworkScanItemComponent implements OnInit {
  @Input() networkScanSomeInfoForDevice: NetworkScanSomeInfoForDevice;
  @Input() device: NetworkScanDevice;
  constructor() { }

  ngOnInit() {
  }
  getLabel() {
    return (this.device.description || this.device.hostName || this.device) + (this.device.deviceId === this.networkScanSomeInfoForDevice.masterAgentId ? ' (MASTER AGENT)' : '');
  }
}
