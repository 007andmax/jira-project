import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { DeviceCompany } from '../class/device-company';
import { DeviceCompanyAsideParams } from '../class/device-company-aside-params';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';

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
  constructor(private devicesStateService: DevicesStateService,
    public customerPortalStateService: CustomerPortalStateService,) { }

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
    this.devicesStateService.setOnOpenAside(new DeviceCompanyAsideParams('SYSTEM', this.devices.filter(item => item.selected && (!item.isCustom && item.agentId || item.isCustom))));
  }
  addDevice() {
    this.devicesStateService.openAsideAddCustom();
  }
}
