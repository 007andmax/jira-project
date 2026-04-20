import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeviceExtended } from '../../class/device-extended';
import { DeviceCompany } from '../../class/device-company';

@Component({
    selector: 'app-company-devices-aside-device-icon',
    templateUrl: './company-devices-aside-device-icon.component.html',
    styleUrls: ['./company-devices-aside-device-icon.component.scss'],
    standalone: true
})
export class CompanyDevicesAsideDeviceIconComponent implements OnInit {
  @Input() device: DeviceExtended;
  @Input() customDevice: DeviceCompany;
  @Input() currentDevice: DeviceExtended;
  @Output() onSelect = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  isLabel() {
    if (this.device.label && this.device.hostName) return this.device.label !== this.device.hostName;
  }
  public getTextForTooltip() {
    if (this.device) return !this.isLabel() ? this.device.hostName || this.device.ip : this.device.label || this.device.hostName || this.device.ip;
    if (this.customDevice) return this.customDevice.name;
  }
  public getFieldForCheckIcon() {
    if (this.device) return this.device.iconName;
    if (this.customDevice) return this.customDevice.type;
  }
  select() {
    this.onSelect.emit(null);
  }
}
