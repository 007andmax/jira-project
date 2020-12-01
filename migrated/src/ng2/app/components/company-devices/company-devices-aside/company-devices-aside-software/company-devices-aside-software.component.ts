import { Component, Input, OnInit } from '@angular/core';
import { DeviceExtended } from '../../class/device-extended';
import * as moment from "moment";

@Component({
  selector: 'app-company-devices-aside-software',
  templateUrl: './company-devices-aside-software.component.html',
  styleUrls: ['./company-devices-aside-software.component.scss']
})
export class CompanyDevicesAsideSoftwareComponent implements OnInit {
  @Input() device: DeviceExtended;
  constructor() { }

  ngOnInit() {
  }
  public getDate(date) {
    return (date !== "") ? moment(date).format('YYYY-MM-DD') : "No installed date";
  }
  public getVersion(softVersion) {
    return (softVersion !== "") ? `, version - ${softVersion}` : '';
  }
  public softSize(softSize) {
    return Math.floor(Number(softSize) / 1024);
  }
}
