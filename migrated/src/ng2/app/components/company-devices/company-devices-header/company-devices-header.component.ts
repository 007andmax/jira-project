import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DevicesStateService } from 'src/ng2/app/states/devices/devices-state.service';
import { Device } from '../class/device';
import { DeviceCompany } from '../class/device-company';
import { DeviceCompanyAsideParams } from '../class/device-company-aside-params';

@Component({
  selector: 'app-company-devices-header',
  templateUrl: './company-devices-header.component.html',
  styleUrls: ['./company-devices-header.component.scss']
})
export class CompanyDevicesHeaderComponent implements OnInit {
  @Input() devices: Array<DeviceCompany> = [];
  @Input() isOfflineDeviceSelected: boolean = false;
  @Output() onTurnOff = new EventEmitter();
  @Output() onRemoveAgents = new EventEmitter();
  constructor(private devicesStateService: DevicesStateService,) { }

  ngOnInit() {
  }
  getCountSelected() {
    return this.devices.filter(item => item.selected).length;
  }
  turnOff(action) {
    this.onTurnOff.emit(action);
  }
  removeAgents() {
    this.onRemoveAgents.emit(null);
  }
  openSidebar() {
    this.devicesStateService.setOnOpenAside(new DeviceCompanyAsideParams('SYSTEM', this.devices.filter(item => item.selected && item.agentId).map(item => item.agentId)));
  }
}
