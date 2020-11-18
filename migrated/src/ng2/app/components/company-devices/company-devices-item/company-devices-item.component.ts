import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Device } from '../class/device';
import { DeviceCompany } from '../class/device-company';

@Component({
  selector: 'app-company-devices-item',
  templateUrl: './company-devices-item.component.html',
  styleUrls: ['./company-devices-item.component.scss']
})
export class CompanyDevicesItemComponent implements OnInit {
  @Input() device: DeviceCompany;

  constructor() { }

  ngOnInit() {
  }

}
