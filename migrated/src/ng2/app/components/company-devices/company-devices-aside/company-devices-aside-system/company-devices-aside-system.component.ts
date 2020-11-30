import { Component, Input, OnInit } from '@angular/core';
import { DeviceExtended } from '../../class/device-extended';
import * as moment from "moment";
@Component({
  selector: 'app-company-devices-aside-system',
  templateUrl: './company-devices-aside-system.component.html',
  styleUrls: ['./company-devices-aside-system.component.scss']
})
export class CompanyDevicesAsideSystemComponent implements OnInit {
  @Input() device: DeviceExtended;
  toggleWindowSpecifications: boolean = false;
  toggleDeviceSpecifications: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  public getDate(date) {
    return moment(date).format('YYYY-MM-DD');
  }
  getEdition() {
    return `${this.device.report.system.caption.replace('Microsoft ', '')}${(this.device.report.system.architecture !== '') ? ` ( ${this.device.report.system.architecture} )` : ''}${(this.device.report.system.release_id !== '') ? ` Version ${this.device.report.system.release_id}` : ''}`
  }
  getRamSize(ramSize) {
    return (ramSize > 0 && ramSize / 1073741824 > 0) ? (ramSize / 1073741824) + 'GB' : 0 + 'GB';
  };
}
