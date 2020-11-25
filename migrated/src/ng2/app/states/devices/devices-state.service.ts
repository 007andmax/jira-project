import { Injectable, EventEmitter } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { UsersStateService } from '../users/users-state.service';
import { DevicesService } from '../../services/devices/devices.service';
import { DevicesRealTimeService } from './devices-real-time.service';
import { DeviceUpdate } from './class/device-update';
import * as moment from "moment";
import { Device } from '../../components/company-devices/class/device';
import { DeviceCompany } from '../../components/company-devices/class/device-company';

@Injectable({
  providedIn: 'root'
})
export class DevicesStateService {
  allDevices = null;
  devicesForReboot: Array<DeviceCompany> = [];
  devicesForRemove: Array<DeviceCompany> = [];
  devicesForShutDown: Array<DeviceCompany> = [];
  onGetDevices: EventEmitter<any> = new EventEmitter();
  onRemoveConnecion: EventEmitter<any> = new EventEmitter();
  onLaunchRemoteApp: EventEmitter<any> = new EventEmitter();
  // onChangeDevices: EventEmitter<DeviceUpdate> = new EventEmitter();
  constructor(private userStateService: UsersStateService, private devicesService: DevicesService,
    private devicesRealTimeService: DevicesRealTimeService) { }

  public onInit() {

    this.userStateService.getOnGetCurrentuser().subscribe(data => {
      this.devicesService.getCompanyDevices(data.company.id).subscribe((data) => {
        Object.keys(data).forEach(key => {
          if (data[key]) data[key] = data[key].map(item => new Device(item));
        })
        this.setAllDevices(data);
        this.onInitGetDevices(data);
      }, err => {
        this.setAllDevices(null);
        this.onInitGetDevices(null);
      })
    })
    this.devicesRealTimeService.changeDevicesArray.subscribe(newChange => {
      console.log("newChange", newChange);
      if (newChange.action === 'DEVICE_UNINSTALLED') {
        let deviceIndex = this.allDevices[newChange.data.clientCompanyId].findIndex(item => item.id === newChange.data.value);
        if (newChange.data.uninstalledAt !== "") {
          if (deviceIndex > -1) this.allDevices[newChange.data.clientCompanyId][deviceIndex].uninstalledAt = newChange.data.uninstalledAt;

        } else {
          if (deviceIndex > -1) this.allDevices[newChange.data.clientCompanyId].splice(deviceIndex, 1);
        }
      }
      if (newChange.action === 'DEVICE_ONLINE') {

        let deviceIndex = this.allDevices[newChange.data.clientCompanyId].findIndex(item => item.id === newChange.data.value);
        if (deviceIndex > -1) {
          this.allDevices[newChange.data.clientCompanyId][deviceIndex].online = true;
          this.allDevices[newChange.data.clientCompanyId][deviceIndex].userName = newChange.data.userName;

        }
      }
      if (newChange.action === 'DEVICE_OFFLINE') {

        let deviceIndex = this.allDevices[newChange.data.clientCompanyId].findIndex(item => item.id === newChange.data.value);
        if (deviceIndex > -1) {
          this.allDevices[newChange.data.clientCompanyId][deviceIndex].online = false;
          this.allDevices[newChange.data.clientCompanyId][deviceIndex].userName = newChange.data.userName;
          var newValue = moment(Date.now()).valueOf();
          this.allDevices[newChange.data.clientCompanyId][deviceIndex].timing.offline = (Date.now() - newValue);
          this.allDevices[newChange.data.clientCompanyId][deviceIndex].timing.uptimeForOrdering = (Date.now() - newValue);

        }
      }
      if (newChange.action === 'REMOTE_CONNECTION') {
        this.onInitLaunchRemoteApp(newChange.data.sessionId);
      }
      if (newChange.action === 'AGENT_ACTIVITY_STATUS') {
        var companyId = this.getCompanyIdByAgentId(newChange.data.agentId);
        if (newChange.data && newChange.data.statuses && newChange.data.statuses.hasOwnProperty('Idle')) {
          if (companyId) {
            for (var i = 0; i < this.allDevices[companyId].length; i++) {
              if (this.allDevices[companyId][i].agentId === newChange.data.agentId) {
                if (newChange.data.statuses.Idle) {
                  this.allDevices[companyId][i].timing.idle = this.getMillisecondsFromTimeString(newChange.data.statuses.Idle);
                } else {
                  this.allDevices[companyId][i].timing.idle = null;
                }
                break;
              }
            }
          }

        } else if (newChange.data && newChange.data.statuses && newChange.data.statuses.hasOwnProperty('NoRestart') && newChange.data.statuses.hasOwnProperty('Online')) {

          for (var i = 0; i < this.allDevices[companyId].length; i++) {
            if (companyId) {
              if (this.allDevices[companyId][i].agentId === newChange.data.agentId) {
                this.allDevices[companyId][i].timing.noRestart = this.getMillisecondsFromTimeString(newChange.data.statuses.NoRestart);
                this.allDevices[companyId][i].timing.online = this.getMillisecondsFromTimeString(newChange.data.statuses.Online);
                this.allDevices[companyId][i].timing.uptimeForOrdering = this.getMillisecondsFromTimeString(newChange.data.statuses.Online);
                break;
              }
            }
          }
        }

      }
      if (newChange.action === 'DEVICE_INSTALLED') {
        let parsedData = JSON.parse(newChange.data.value);
        parsedData.device.userName = newChange.data.userName;
        if (!this.allDevices[newChange.data.clientCompanyId]) {
          let companyId = newChange.data.clientCompanyId;
          this.allDevices[companyId] = [];
          this.allDevices[companyId].push(parsedData.device);
        } else {
          let deviceIndex = this.allDevices[newChange.data.clientCompanyId].findIndex(item => item.id === parsedData.device.id);
          parsedData.device.uninstalledAt = '';
          if (deviceIndex > -1) {
            this.allDevices[newChange.data.clientCompanyId][deviceIndex] = parsedData.device;
          } else {
            this.allDevices[newChange.data.clientCompanyId].push(parsedData.device);
          }
        }
        this.devicesService.sendDeviceStatusRequest(newChange.data.clientCompanyId, [parsedData.device.agentId], ["idle", "norestart", "online"]).subscribe(res => {
          console.log("res", res);
        })
      }
      this.onInitGetDevices(this.allDevices);
    })
  }
  getCompanyIdByAgentId(value) {
    if (value) {
      return Object.keys(this.allDevices).find((key) => {
        if (key !== 'staticCopy' && this.allDevices[key]) {
          for (var i = 0; i < this.allDevices[key].length; i++) {
            if (this.allDevices[key][i].agentId === value) {
              return true;
            }
          }
        }

      });
    }
  }
  getMillisecondsFromTimeString(timeString) {
    var splittedArray = timeString.split(':');
    return splittedArray[2] * 1000 + splittedArray[1] * 60000 + splittedArray[0] * 3600000
  };
  public getDevicesForRemove() {
    return this.devicesForRemove;
  }
  public setDevicesForRemove(data) {
    this.devicesForRemove = data;
  }
  public setDevicesForShutDown(data) {
    this.devicesForShutDown = data;
  }
  public getDevicesForShutDown() {
    return this.devicesForShutDown;
  }
  public getDevicesForReboot() {
    return this.devicesForReboot;
  }
  public setDevicesForReboot(data) {
    this.devicesForReboot = data;
  }
  public updateLabelIcon(device: DeviceCompany) {
    let index = this.allDevices[device.companyId].findIndex(item => item.id === device.id);
    this.allDevices[device.companyId][index].label = device.label;
    this.allDevices[device.companyId][index].iconName = device.iconName;
  }
  public onInitLaunchRemoteApp(sessionId) {
    this.onLaunchRemoteApp.emit(sessionId);
  }
  public getOnLaunchRemoteApp() {
    return this.onLaunchRemoteApp;
  }
  public onInitRemoveConnection() {
    this.onRemoveConnecion.emit(null);
  }
  public getOnRemoveConnection() {
    return this.onRemoveConnecion;
  }
  public setAllDevices(data) {
    this.allDevices = data;
  }
  public onInitGetDevices(data) {
    this.onGetDevices.emit(data);
  }
  public getOnDevices() {
    return this.onGetDevices;
  }
  public getAllDevices() {
    return this.allDevices;
  }
}
