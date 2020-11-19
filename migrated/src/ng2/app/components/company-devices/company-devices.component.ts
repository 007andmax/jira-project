import { Component, OnInit } from '@angular/core';
import { DevicesService } from '../../services/devices/devices.service';
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
  constructor(private devicesSateService: DevicesSateService, private devicesService: DevicesService) { }

  ngOnInit() {
    let companyId = localStorage.getItem("company_id");
    this.devices = (this.devicesSateService.getAllDevices()[companyId]) ? this.devicesSateService.getAllDevices()[companyId] : [];
    console.log("this.devices", this.devices);
    if (this.devices.length > 0) {
      this.devicesService.sendDeviceStatusRequest(companyId, this.devices.filter(item => item.agentId).map(item => item.agentId), ["idle", "norestart", "online"]).subscribe(data => {
        console.log("data", data);
      })
    }
    this.devicesSateService.getOnDevices().subscribe(data => {
      let devices = data[companyId];
      devices.forEach(item => {
        let find = this.devices.find(device => device.agentId === item.agentId);
        if (!find && find.agentId) {
          this.devicesService.sendDeviceStatusRequest(companyId, [find.agentId], ["idle", "norestart", "online"]).subscribe(res => {
            console.log("res", res);
          })
        }
      });
      this.devices = devices;
    })
  }


}
