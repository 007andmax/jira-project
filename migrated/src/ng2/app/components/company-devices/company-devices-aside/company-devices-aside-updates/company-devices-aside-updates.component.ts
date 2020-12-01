import { Component, Input, OnInit } from '@angular/core';
import { DeviceExtended } from '../../class/device-extended';

@Component({
  selector: 'app-company-devices-aside-updates',
  templateUrl: './company-devices-aside-updates.component.html',
  styleUrls: ['./company-devices-aside-updates.component.scss']
})
export class CompanyDevicesAsideUpdatesComponent implements OnInit {
  @Input() device: DeviceExtended;
  constructor() { }

  ngOnInit() {
  }

}
