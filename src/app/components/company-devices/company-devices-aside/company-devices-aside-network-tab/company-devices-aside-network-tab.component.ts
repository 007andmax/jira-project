import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DeviceExtended } from '../../class/device-extended';
import { DeviceCompany } from '../../class/device-company';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { CompanyDevicesEditIpComponent } from '../../company-devices-edit-ip/company-devices-edit-ip.component';
import { CompanyDevicesEditLabelComponent } from '../../company-devices-edit-label/company-devices-edit-label.component';
import { CompanyDevicesEditMacComponent } from '../../company-devices-edit-mac/company-devices-edit-mac.component';

@Component({
  selector: 'app-company-devices-aside-network-tab',
  templateUrl: './company-devices-aside-network-tab.component.html',
  styleUrls: ['./company-devices-aside-network-tab.component.scss']
})
export class CompanyDevicesAsideNetworkTabComponent implements OnInit {
  @ViewChild('ipLabel') ipLabel: CompanyDevicesEditIpComponent;
  @ViewChild('portLabel') portLabel: CompanyDevicesEditLabelComponent;
  @ViewChild('macLabel') macLabel: CompanyDevicesEditMacComponent;
  @Input() device: DeviceExtended;
  @Input() customDevice: DeviceCompany;
  toggleIpSettings: boolean = false;
  constructor(private devicesService: DevicesService,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }
  public refresh(data) {
    this.customDevice = data;
    this.device = null;
    if (this.ipLabel) this.ipLabel.setValue(this.customDevice.ip);
    if (this.portLabel) this.portLabel.setValue(this.customDevice.port);
    if (this.macLabel) this.macLabel.setValue(this.customDevice.macAddress);
    this.cd.detectChanges();
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
    let find = this.device.report.networkAdapters.find(item => item.isDefault);
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
