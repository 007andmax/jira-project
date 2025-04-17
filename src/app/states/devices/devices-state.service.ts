import { Injectable, EventEmitter } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { UsersStateService } from '../users/users-state.service';
import { DevicesService } from '../../services/devices/devices.service';
import { DevicesRealTimeService } from './devices-real-time.service';
import { DeviceUpdate } from './class/device-update';
import * as moment from "moment";
import { Device } from '../../components/company-devices/class/device';
import { DeviceCompany } from '../../components/company-devices/class/device-company';
import { WebsocketService } from '../../services/websocket/websocket.service';
import { DeviceStatus } from './class/device-status';
import { ManufactureDevice } from 'src/app/components/company-devices/company-devices-custom-aside/class/manufacture-device';
import { ModelDevice } from 'src/app/components/company-devices/company-devices-custom-aside/class/model-device';
import { DeviceType } from 'src/app/components/company-devices/class/device-type';

@Injectable({
  providedIn: 'root'
})
export class DevicesStateService {
  isGetDevices: boolean = false;
  devicesForReboot: Array<DeviceCompany> = [];
  devicesForRemove: Array<DeviceCompany> = [];
  devicesForShutDown: Array<DeviceCompany> = [];
  onUpdateAgentActivityStatus: EventEmitter<any> = new EventEmitter();
  onResetDeviceTiming: EventEmitter<any> = new EventEmitter();
  onOpenAside: EventEmitter<any> = new EventEmitter();
  onOpenCustomAside: EventEmitter<any> = new EventEmitter();
  onCloseAside: EventEmitter<any> = new EventEmitter();
  onRemoveConnecion: EventEmitter<any> = new EventEmitter();
  onChangeInfoForDevice: EventEmitter<any> = new EventEmitter();
  onChangeDevice: EventEmitter<any> = new EventEmitter();
  onChangeDeviceCount: EventEmitter<any> = new EventEmitter();
  onClosedRemoveConnecion: EventEmitter<any> = new EventEmitter();
  onSendDeviceStatus: EventEmitter<any> = new EventEmitter();
  onLaunchRemoteApp: EventEmitter<any> = new EventEmitter();
  onInitWebSocket: EventEmitter<any> = new EventEmitter();
  onGetManufactures: EventEmitter<any> = new EventEmitter();
  onGetDeviceType: EventEmitter<any> = new EventEmitter();
  onAddModel: EventEmitter<any> = new EventEmitter();
  onFastAddCustomDevice: EventEmitter<any> = new EventEmitter();
  isInitWebSocket: boolean = false;
  preloaderDevices: boolean = true;
  isGetManufactures: boolean = false;
  isGetDeviceType: boolean = false;
  deviceTypes: Array<DeviceType> = [];
  manufactures: Array<ManufactureDevice> = [];
  manufacturForRemove: ManufactureDevice = null;
  modelForRemove: ModelDevice = null;
  onFilter: EventEmitter<any> = new EventEmitter();
  // onChangeDevices: EventEmitter<DeviceUpdate> = new EventEmitter();
  constructor(private userStateService: UsersStateService,
    private devicesService: DevicesService,
    private devicesRealTimeService: DevicesRealTimeService) { }

  public onInit() {
    this.devicesRealTimeService.changeDevicesArray.subscribe(newChange => {
      if (newChange.action === 'AGENT_ACTIVITY_STATUS') this.onInitUpdateAgentActivityStatus(newChange);
      if (newChange.action === 'SOME_INFO_FOR_DEVICES') this.onChangeDevice.emit(newChange);
      if (newChange.action === 'DEVICE_UNINSTALLED') this.onChangeDevice.emit(newChange);
      if (newChange.action === 'DEVICE_ONLINE') this.onChangeDevice.emit(newChange);
      if (newChange.action === 'DEVICE_OFFLINE') this.onChangeDevice.emit(newChange);
      if (newChange.action === 'REMOTE_CONNECTION' && newChange.data.status === 'online') this.onInitLaunchRemoteApp(newChange.data.id);
      if (newChange.action === 'REMOTE_CONNECTION' && newChange.data.status === 'offline') this.closedRemoveConnecion(newChange.data.id);
      if (newChange.action === 'DEVICE_INSTALLED') this.onChangeDevice.emit(newChange);
      if (newChange.action === 'DEVICE_COUNT') this.onChangeDeviceCount.emit(newChange);
      if (newChange.action === 'MANUFACTURE_SAVED') {
        this.manufactures.push(new ManufactureDevice(newChange.data));
        this.manufactures.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 0);
        this.onGetManufactures.emit(this.manufactures);
      }
      if (newChange.action === 'MANUFACTURE_EDITED') {
        let index = this.manufactures.findIndex(item => item.id == newChange.data.id);
        if (index > -1) this.manufactures[index] = new ManufactureDevice(newChange.data);
        this.onGetManufactures.emit(this.manufactures);
      }
      if (newChange.action === 'MANUFACTURE_DELETED') {
        let index = this.manufactures.findIndex(item => item.id == newChange.data);
        if (index > -1) this.manufactures.splice(index, 1);
        this.onGetManufactures.emit(this.manufactures);
      }
      if (newChange.action === 'MANUFACTURE_MODULE_SAVED') this.onAddModel.emit(newChange.data);
      if (newChange.action === 'DEVICE_TYPE_SAVED') {
        let index = this.deviceTypes.findIndex(item => item.id == newChange.data.id);
        if (index == -1) {
          this.deviceTypes.push(new DeviceType(newChange.data.id, newChange.data.name));
          this.deviceTypes.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 0);
          this.onGetDeviceType.emit(this.deviceTypes);
        }
      }
      if (newChange.action === 'DEVICE_TYPE_EDITED') {
        let index = this.deviceTypes.findIndex(item => item.id == newChange.data.id);
        if (index > -1) this.deviceTypes[index] = new DeviceType(newChange.data.id, newChange.data.name);
        this.onGetDeviceType.emit(this.deviceTypes);
      }
    })
  }
  public fastAddCustomDevice(data) {
    this.onFastAddCustomDevice.emit(data);
  }
  public onInitFilter(data) {
    this.onFilter.emit(data);
  }
  public setModelForRemove(data) {
    this.modelForRemove = data;
  }
  public getModelForRemove() {
    return this.modelForRemove;
  }
  public setManufacturForRemove(data) {
    this.manufacturForRemove = data;
  }
  public getManufacturForRemove() {
    return this.manufacturForRemove;
  }
  public initGetManufactures() {
    this.devicesService.getManufactures().subscribe((data: any) => {
      this.manufactures = data.manufacturers.map(item => new ManufactureDevice(item));
      this.manufactures.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 0);
      this.onGetManufactures.emit(this.manufactures);
      this.isGetManufactures = true;
    })
  }
  public initGetDeviceType() {
    this.devicesService.getDeviceTypes().subscribe((data: any) => {
      this.deviceTypes = data.deviceTypes.map(item => new DeviceType(item.id, item.name));
      this.deviceTypes.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 0);
      this.onGetDeviceType.emit(this.deviceTypes);
      this.isGetDeviceType = true;
    })
  }
  public setManufactures(data) {
    this.manufactures = data;
  }
  public getManufactures() {
    return this.manufactures;
  }
  public getDeviceTypes() {
    return this.deviceTypes;
  }
  public changeDevice(allDevices, newChange) {
    if (newChange.action === 'DEVICE_UNINSTALLED') {
      let deviceIndex = allDevices.findIndex(item => item.id === newChange.data.value);
      if (deviceIndex > -1) allDevices.splice(deviceIndex, 1);
    }
    if (newChange.action === 'SOME_INFO_FOR_DEVICES') {
      if (allDevices) allDevices.forEach(item => {
        if (item.agentId === newChange.data.masterAgentId) item.master = true;
        if (item.agentId !== newChange.data.masterAgentId) item.master = false;
      });
      this.onChangeInfoForDevice.emit(newChange.data);
    }
    if (newChange.action === 'DEVICE_ONLINE') {
      let deviceIndex = allDevices.findIndex(item => item.id === newChange.data.value);
      if (deviceIndex > -1) {
        allDevices[deviceIndex].online = true;
        allDevices[deviceIndex].userName = newChange.data.userName;
        this.onResetDeviceTiming.emit({ id: newChange.data.value, online: true });
      }
    }
    if (newChange.action === 'DEVICE_OFFLINE') {
      let deviceIndex = allDevices.findIndex(item => item.id === newChange.data.value);
      if (deviceIndex > -1) {
        allDevices[deviceIndex].online = false;
        var now = new Date();
        var utc_now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
        allDevices[deviceIndex].offlineAt = utc_now.toString();
        allDevices[deviceIndex].userName = newChange.data.userName;
        this.onResetDeviceTiming.emit({ id: newChange.data.value, online: false });
      }
    }
    if (newChange.action === 'DEVICE_INSTALLED') {
      let parsedData = JSON.parse(newChange.data.value);
      parsedData.device.userName = newChange.data.userName;
      if (!allDevices) {
        let companyId = newChange.data.clientCompanyId;
        allDevices[companyId] = [];
        allDevices[companyId].push(new Device(parsedData.device));
      } else {
        allDevices.push(new Device(parsedData.device));
      }
      this.onSendDeviceStatus.emit(new DeviceStatus(newChange.data.clientCompanyId, [parsedData.device.agentId], ["idle", "norestart", "online"]));
    }
  }
  public initWebSocket() {
    this.isInitWebSocket = true;
    this.onInitWebSocket.emit(null);
  }

  public getIsInitWebSocket() {
    return this.isInitWebSocket;
  }
  public getPreloaderDevices() {
    return this.preloaderDevices;
  }
  public getOnSendDeviceStatus() {
    return this.onSendDeviceStatus;
  }
  public getOnChangeInfoForDevice() {
    return this.onChangeInfoForDevice;
  }
  public onInitUpdateAgentActivityStatus(data) {
    this.onUpdateAgentActivityStatus.emit(data);
  }
  public getOnUpdateAgentActivityStatus() {
    return this.onUpdateAgentActivityStatus;
  }
  getMillisecondsFromTimeString(timeString) {
    var splittedArray = timeString.split(':');
    return splittedArray[2] * 1000 + splittedArray[1] * 60000 + splittedArray[0] * 3600000
  };
  public setOnOpenAside(data) {
    this.onOpenAside.emit(data);
  }
  public getOnOpenAside() {
    return this.onOpenAside;
  }
  public openAsideAddCustom() {
    this.onOpenCustomAside.emit(null);
  }
  public setCloseAside() {
    this.onCloseAside.emit();
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
}
