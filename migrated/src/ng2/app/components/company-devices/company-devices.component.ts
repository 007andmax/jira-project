import { Component, OnInit } from '@angular/core';
import { DevicesSateService } from '../../states/devices/devices-sate.service';
import { Device } from './class/device';
import { DeviceCompany } from './class/device-company';

@Component({
  selector: 'app-company-devices',
  templateUrl: './company-devices.component.html',
  styleUrls: ['./company-devices.component.scss']
})
export class CompanyDevicesComponent implements OnInit {
  devices: Array<DeviceCompany> = [];
  constructor(private devicesSateService: DevicesSateService) { }

  ngOnInit() {
    let companyId = localStorage.getItem("company_id");
    this.devices = (this.devicesSateService.getAllDevices()[companyId]) ? this.devicesSateService.getAllDevices()[companyId] : [];
    console.log("this.devices", this.devices);
  }

}
