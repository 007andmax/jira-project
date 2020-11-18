import { Component, Input, OnInit } from '@angular/core';
import { Device } from '../class/device';
import { DeviceCompany } from '../class/device-company';

@Component({
  selector: 'app-company-devices-header',
  templateUrl: './company-devices-header.component.html',
  styleUrls: ['./company-devices-header.component.scss']
})
export class CompanyDevicesHeaderComponent implements OnInit {
  @Input() devices: Array<DeviceCompany> = [];
  constructor() { }

  ngOnInit() {
  }
  getCountSelected() {
    return this.devices.filter(item => item.selected).length;
  }

}
