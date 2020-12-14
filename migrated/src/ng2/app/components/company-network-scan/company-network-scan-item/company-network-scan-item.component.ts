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
  @Input() masterAgent: Device = null;
  constructor() { }

  ngOnInit() {
  }
  checkUnknown(value) {
    return (value === "unknown") ? null : value;
  }
  getLabel() {
    return `${(this.checkUnknown(this.device.description) || this.checkUnknown(this.device.hostName) || this.checkUnknown(this.device))} ${(this.device.deviceId === this.masterAgent.id ? '(MASTER AGENT)' : '')}`;
  }
}
