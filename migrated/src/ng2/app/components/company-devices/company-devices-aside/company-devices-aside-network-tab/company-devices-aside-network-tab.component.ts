import { Component, Input, OnInit } from '@angular/core';
import { DeviceExtended } from '../../class/device-extended';

@Component({
  selector: 'app-company-devices-aside-network-tab',
  templateUrl: './company-devices-aside-network-tab.component.html',
  styleUrls: ['./company-devices-aside-network-tab.component.scss']
})
export class CompanyDevicesAsideNetworkTabComponent implements OnInit {
  @Input() device: DeviceExtended;
  toggleIpSettings: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  public chackDefaultValue(value) {
    return (!value || value === "") ? "N\A" : value;
  }
  getNetworkAdapterField(field) {
    let find = this.device.report.networkAdapters.find(item => item.is_default);
    return (find) ? find[field] : null;
  }
  getLinkSpeed() {
    return (this.getNetworkAdapterField("speed")) ? (Number(this.getNetworkAdapterField("speed")) / 1000000) : 0;
  }
  formatMacAddress(mac: any) {
    if (mac) {
      return mac.match(/.{1,2}/g).join(' ');
    } else {
      return 'N/A';
    }

  };
}
