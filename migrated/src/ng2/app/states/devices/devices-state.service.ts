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
  onUpdateAgentActivityStatus: EventEmitter<any> = new EventEmitter();
  onGetDevices: EventEmitter<any> = new EventEmitter();
  onResetDeviceTiming: EventEmitter<any> = new EventEmitter();
  onOpenAside: EventEmitter<any> = new EventEmitter();
  onRemoveConnecion: EventEmitter<any> = new EventEmitter();
  onClosedRemoveConnecion: EventEmitter<any> = new EventEmitter();
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
        if (deviceIndex > -1) this.allDevices[newChange.data.clientCompanyId].splice(deviceIndex, 1);
        console.log("deviceIndex", deviceIndex);
        console.log("this.allDevices[newChange.data.clientCompanyId]", this.allDevices[newChange.data.clientCompanyId]);
      }
      if (newChange.action === 'DEVICE_ONLINE') {
        let deviceIndex = this.allDevices[newChange.data.clientCompanyId].findIndex(item => item.id === newChange.data.value);
        if (deviceIndex > -1) {
          this.allDevices[newChange.data.clientCompanyId][deviceIndex].online = true;
          this.allDevices[newChange.data.clientCompanyId][deviceIndex].userName = newChange.data.userName;
          this.onResetDeviceTiming.emit({ id: newChange.data.value, online: true });
        }
      }
      if (newChange.action === 'DEVICE_OFFLINE') {
        let deviceIndex = this.allDevices[newChange.data.clientCompanyId].findIndex(item => item.id === newChange.data.value);
        if (deviceIndex > -1) {
          this.allDevices[newChange.data.clientCompanyId][deviceIndex].online = false;
          this.allDevices[newChange.data.clientCompanyId][deviceIndex].offlineAt = new Date().toUTCString();
          this.allDevices[newChange.data.clientCompanyId][deviceIndex].userName = newChange.data.userName;
          this.onResetDeviceTiming.emit({ id: newChange.data.value, online: false });
        }
      }
      if (newChange.action === 'REMOTE_CONNECTION' && newChange.data.status === 'online') {
        this.onInitLaunchRemoteApp(newChange.data.sessionId);
      }
      if (newChange.action === 'REMOTE_CONNECTION' && newChange.data.status === 'offline') {
        this.closedRemoveConnecion(newChange.data.sessionId);
      }
      if (newChange.action === 'AGENT_ACTIVITY_STATUS') this.onInitUpdateAgentActivityStatus(newChange);
      if (newChange.action === 'DEVICE_INSTALLED') {
        let parsedData = JSON.parse(newChange.data.value);
        parsedData.device.userName = newChange.data.userName;
        if (!this.allDevices[newChange.data.clientCompanyId]) {
          let companyId = newChange.data.clientCompanyId;
          this.allDevices[companyId] = [];
          this.allDevices[companyId].push(new Device(parsedData.device));
          console.log("this.allDevices[companyId]", this.allDevices[companyId]);
        } else {
          this.allDevices[newChange.data.clientCompanyId].push(new Device(parsedData.device));
          /* let deviceIndex = this.allDevices[newChange.data.clientCompanyId].findIndex(item => item.id === parsedData.device.id);
           parsedData.device.uninstalledAt = '';
           if (deviceIndex > -1) {
             this.allDevices[newChange.data.clientCompanyId][deviceIndex] = new Device(parsedData.device);
           } else {
             this.allDevices[newChange.data.clientCompanyId].push(new Device(parsedData.device));
           }*/
          console.log("this.allDevices[newChange.data.clientCompanyId]", this.allDevices[newChange.data.clientCompanyId]);
        }
        this.devicesService.sendDeviceStatusRequest(newChange.data.clientCompanyId, [parsedData.device.agentId], ["idle", "norestart", "online"]).subscribe(res => {
          console.log("res", res);
        })
      }
      this.onInitGetDevices(this.allDevices);
    })
  }
  public onInitUpdateAgentActivityStatus(data) {
    this.onUpdateAgentActivityStatus.emit(data);
  }
  public getOnUpdateAgentActivityStatus() {
    return this.onUpdateAgentActivityStatus;
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
  public setOnOpenAside(data) {
    console.log("data", data);
    this.onOpenAside.emit(data);
  }
  public getOnOpenAside() {
    return this.onOpenAside;
  }
  public getOnResetDeviceTiming() {
    return this.onResetDeviceTiming;
  }
  public getDevicesForRemove() {
    return this.devicesForRemove;
  }
  public setDevicesForRemove(data) {
    this.devicesForRemove = data;
  }
  public closedRemoveConnecion(data) {
    this.onClosedRemoveConnecion.emit(data);
  }
  public getOnClosedRemoveConnecion() {
    return this.onClosedRemoveConnecion;
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
