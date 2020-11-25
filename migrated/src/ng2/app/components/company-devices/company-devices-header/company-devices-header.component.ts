import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Device } from '../class/device';
import { DeviceCompany } from '../class/device-company';

@Component({
  selector: 'app-company-devices-header',
  templateUrl: './company-devices-header.component.html',
  styleUrls: ['./company-devices-header.component.scss']
})
export class CompanyDevicesHeaderComponent implements OnInit {
  @Input() devices: Array<DeviceCompany> = [];
  @Input() isOfflineDeviceSelected: boolean = false;
  @Output() onTurnOff = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  getCountSelected() {
    return this.devices.filter(item => item.selected).length;
  }
  turnOff(action) {
    this.onTurnOff.emit(action);
  }
}
