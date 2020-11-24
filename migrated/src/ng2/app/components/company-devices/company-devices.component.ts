import { Component, OnInit } from '@angular/core';
import { DevicesService } from '../../services/devices/devices.service';
import { DevicesRealTimeService } from '../../states/devices/devices-real-time.service';
import { DevicesStateService } from '../../states/devices/devices-sate.service';
import { Device } from './class/device';
import { DeviceCompany } from './class/device-company';

@Component({
  selector: 'app-company-devices',
  templateUrl: './company-devices.component.html',
  styleUrls: ['./company-devices.component.scss']
})
export class CompanyDevicesComponent implements OnInit {
  devices: Array<DeviceCompany> = [];
  constructor(private devicesStateService: DevicesStateService,
    private devicesService: DevicesService,
    private devicesRealTimeService: DevicesRealTimeService) { }

  ngOnInit() {
    let companyId = localStorage.getItem("company_id");
    this.devices = (this.devicesStateService.getAllDevices()[companyId]) ? this.devicesStateService.getAllDevices()[companyId].map(item => new DeviceCompany(item, companyId)) : [];
    console.log("this.devices", this.devices);
    if (this.devices.length > 0) {
      this.devicesService.sendDeviceStatusRequest(companyId, this.devices.filter(item => item.agentId).map(item => item.agentId), ["idle", "norestart", "online"]).subscribe(data => {
        console.log("data", data);
      })
    }
    this.devicesStateService.getOnDevices().subscribe(data => {
      let devices = data[companyId].map(item => new DeviceCompany(item, companyId));
      devices.forEach(item => {
        let find = this.devices.find(device => device.agentId === item.agentId);
        if (!find && find.agentId) {
          this.devicesService.sendDeviceStatusRequest(companyId, [find.agentId], ["idle", "norestart", "online"]).subscribe(res => {
            console.log("res", res);
          })
        }
      });
      this.devices = devices;
      console.log("this.devices", this.devices);
    })
    this.devicesRealTimeService.oneTimeConnectionArray.subscribe(newChange => {
      if (newChange.action === 'ONE_TIME_CONNECTION_OPEN') {
        for (var i = 0; i < this.devices.length; i++) {
          if (this.devices[i].id === newChange.data.deviceId) {
            this.devices[i].remoteSessions.push(newChange.data)
          }
        }
      } else if (newChange.action === 'ONE_TIME_DELETED') {
        for (var i = 0; i < this.devices.length; i++) {
          for (var r = 0; r < this.devices[i].remoteSessions.length; r++) {
            if (this.devices[i].remoteSessions[r].id === newChange.data) {
              this.devices[i].remoteSessions.splice(r, 1);
            }
          }
        }
      }
    })
  }
  public trackById(index, item) {
    return item.id;
  }

}
