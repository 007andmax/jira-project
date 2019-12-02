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
 // onChangeDevices: EventEmitter<DeviceUpdate> = new EventEmitter();
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
      if (newChange.action === 'DEVICE_UNINSTALLED')
      {
        let deviceIndex = this.allDevices[newChange.data.clientCompanyId].findIndex(item => item.id ===  newChange.data.value);
        if (newChange.data.uninstalledAt !== "") {
        if (deviceIndex > -1)  this.allDevices[newChange.data.clientCompanyId][deviceIndex].uninstalledAt = newChange.data.uninstalledAt;
         
        } else {
          if (deviceIndex > -1)  this.allDevices[newChange.data.clientCompanyId].splice(deviceIndex,1);
        }
        console.log('this.allDevices[newChange.data.clientCompanyId]',this.allDevices[newChange.data.clientCompanyId]);
      }
      if (newChange.action === 'DEVICE_INSTALLED') {
        let parsedData = JSON.parse(newChange.data.value);
        parsedData.device.userName = newChange.data.userName;
        if (!this.allDevices[newChange.data.clientCompanyId]) {
          let companyId = newChange.data.clientCompanyId;
          this.allDevices[companyId] = [];
          this.allDevices[companyId].push(parsedData.device);
        } else {
          let deviceIndex = this.allDevices[newChange.data.clientCompanyId].findIndex(item => item.id ===  parsedData.device.id);
          parsedData.device.uninstalledAt = '';
          if (deviceIndex > -1) {
            this.allDevices[newChange.data.clientCompanyId][deviceIndex] = parsedData.device;
          } else {
            this.allDevices[newChange.data.clientCompanyId].push(parsedData.device);
          }
        //  Utils.defineReadOnlyProperty(parsedData.device, 'uninstalledAt', '');
      //    Utils.customizeObj(parsedData.device, deviceById);
        }
        console.log('this.allDevices[newChange.data.clientCompanyId]',this.allDevices[newChange.data.clientCompanyId]);
      }
      this.onInitGetDevices(this.allDevices);
    //  this.onChangeDevices.emit(new DeviceUpdate(newChange.action, newChange.data, this.allDevices));
    })
  }
 /* public getChangeDevices() {
    return this.onChangeDevices;
  }*/
  public setAllDevices(data) {
    this.allDevices = data;
  }
  public onInitGetDevices(data) {
    console.log('eeeee');
    this.onGetDevices.emit(data);
  }
  public getOnDevices() {
    return this.onGetDevices;
  }
  public getAllDevices() {
    return this.allDevices;
  }
}
