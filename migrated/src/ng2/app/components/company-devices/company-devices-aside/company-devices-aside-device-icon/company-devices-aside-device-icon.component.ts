import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeviceExtended } from '../../class/device-extended';

@Component({
  selector: 'app-company-devices-aside-device-icon',
  templateUrl: './company-devices-aside-device-icon.component.html',
  styleUrls: ['./company-devices-aside-device-icon.component.scss']
})
export class CompanyDevicesAsideDeviceIconComponent implements OnInit {
  @Input() device: DeviceExtended;
  @Input() currentDevice: DeviceExtended;
  @Output() onSelect = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  isLabel() {
    if (this.device.label && this.device.hostName) return this.device.label !== this.device.hostName;
  }
  select() {
    this.onSelect.emit(null);
  }
}
