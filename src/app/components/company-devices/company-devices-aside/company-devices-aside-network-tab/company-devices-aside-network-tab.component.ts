import { Component, Input, OnInit } from '@angular/core';
import { DeviceExtended } from '../../class/device-extended';
import { DeviceCompany } from '../../class/device-company';
import { DevicesService } from 'src/app/services/devices/devices.service';

@Component({
  selector: 'app-company-devices-aside-network-tab',
  templateUrl: './company-devices-aside-network-tab.component.html',
  styleUrls: ['./company-devices-aside-network-tab.component.scss']
})
export class CompanyDevicesAsideNetworkTabComponent implements OnInit {
  @Input() device: DeviceExtended;
  @Input() customDevice: DeviceCompany;
  toggleIpSettings: boolean = false;
  constructor(private devicesService: DevicesService,) { }

  ngOnInit() {
  }
  onChangeIp(data) {
    this.customDevice.setIp(data);
    this.devicesService.editFieldDevice(this.customDevice.getDataForRequestField("ip", this.customDevice.ip)).subscribe(data => {

    })
  }
  onChangePort(data) {
    this.customDevice.setPort(data);
    this.devicesService.editFieldDevice(this.customDevice.getDataForRequestField("port", this.customDevice.port)).subscribe(data => {

    })
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
