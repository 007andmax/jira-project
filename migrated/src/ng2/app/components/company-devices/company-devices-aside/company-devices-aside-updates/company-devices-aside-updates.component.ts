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
  getAntivirusFiled(field) {
    return (this.device.report.antivirus.length > 0) ? this.device.report.antivirus[0][field] : null;
  }
}
