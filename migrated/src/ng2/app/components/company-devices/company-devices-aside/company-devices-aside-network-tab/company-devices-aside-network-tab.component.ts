import { Component, Input, OnInit } from '@angular/core';
import { DeviceExtended } from '../../class/device-extended';

@Component({
  selector: 'app-company-devices-aside-network-tab',
  templateUrl: './company-devices-aside-network-tab.component.html',
  styleUrls: ['./company-devices-aside-network-tab.component.scss']
})
export class CompanyDevicesAsideNetworkTabComponent implements OnInit {
  @Input() device: DeviceExtended;
  constructor() { }

  ngOnInit() {
  }
  getNetworkAdapter() {
    return this.device.report.networkAdapters.find(item => item.is_default);
  }
  getLinkSpeed() {
    return (Number(this.getNetworkAdapter().speed) / 1000000);
  }
  formatMacAddress(mac: any) {
    if (mac) {
      return mac.match(/.{1,2}/g).join(' ');
    } else {
      return 'N/A';
    }

  };
}
