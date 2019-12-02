import { Injectable, EventEmitter } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { UsersStateService } from '../users/users-state.service';
import { DevicesService } from '../../services/devices/devices.service';
import { DevicesRealTimeService } from './devices-real-time.service';
import { DeviceUpdate } from './class/device-update';

@Injectable({
  providedIn: 'root'
})
export class DevicesSateService {
  allDevices = null;
  onGetDevices: EventEmitter<any> = new EventEmitter();
  onChangeDevices: EventEmitter<DeviceUpdate> = new EventEmitter();
  constructor(private userStateService: UsersStateService, private devicesService: DevicesService,
    private devicesRealTimeService: DevicesRealTimeService) { }

  public onInit() {

    this.userStateService.getOnGetCurrentuser().subscribe(data => {
      this.devicesService.getCompanyDevices(data.company.id).subscribe((data) => {
        console.log('data', data);
        this.setAllDevices(data);
        this.onInitGetDevices(data);
      })
    })
    this.devicesRealTimeService.changeDevicesArray.subscribe(newChange => {
      console.log('newChange', newChange);
      if (newChange.action === 'DEVICE_UNINSTALLED' || newChange.action === 'DEVICE_INSTALLED') {
        const Index = this.allDevices.findIndex((item) => item.id === newChange.data.id);
        if (Index > -1) this.allDevices[Index] = newChange.data;
      }
      this.onInitGetDevices(this.allDevices);
    //  this.onChangeDevices.emit(new DeviceUpdate(newChange.action, newChange.data, this.allDevices));
    })
  }
  public getChangeDevices() {
    return this.onChangeDevices;
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
