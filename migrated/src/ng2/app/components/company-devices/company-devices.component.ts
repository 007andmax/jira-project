import { Component, OnInit } from '@angular/core';
import { DevicesService } from '../../services/devices/devices.service';
import { DevicesRealTimeService } from '../../states/devices/devices-real-time.service';
import { DevicesStateService } from '../../states/devices/devices-state.service';
import { Device } from './class/device';
import { DeviceCompany } from './class/device-company';

@Component({
  selector: 'app-company-devices',
  templateUrl: './company-devices.component.html',
  styleUrls: ['./company-devices.component.scss']
})
export class CompanyDevicesComponent implements OnInit {
  devices: Array<DeviceCompany> = [];
  selectAllDevices: boolean = false;
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
    let ONE_TIME_ONLINE = [];
    let ONE_TIME_OFFLINE = [];
    this.devicesRealTimeService.oneTimeConnectionArray.subscribe(newChange => {
      if (newChange.action === 'ONE_TIME_ONLINE') {
        let find = ONE_TIME_ONLINE.find(item => item === newChange.data.id);
        if (!find) ONE_TIME_ONLINE.push(newChange.data.id);
        console.log("ONE_TIME_ONLINE", ONE_TIME_ONLINE);
      }
      if (newChange.action === 'ONE_TIME_OFFLINE') {
        let find = ONE_TIME_OFFLINE.find(item => item === newChange.data.id);
        if (!find) ONE_TIME_OFFLINE.push(newChange.data.id);
        console.log("ONE_TIME_OFFLINE", ONE_TIME_OFFLINE);
      }
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
  onChangeSelect() {
    let find = this.devices.find(item => !item.selected);
    this.selectAllDevices = (find) ? false : true;
  }
  toogleDevices() {
    console.log("selectAllDevices", this.selectAllDevices);
    this.devices.forEach(item => {
      item.selected = (this.selectAllDevices) ? true : false;
    })
  }
  public trackById(index, item) {
    return item.id;
  }

}
