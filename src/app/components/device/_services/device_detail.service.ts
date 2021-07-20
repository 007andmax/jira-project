import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetailService {
  items = {};
  deviceList = [];
  device: any = null;
  onGetDevice: EventEmitter<any> = new EventEmitter();

  public setDevice(data) {
    this.onGetDevice.emit(data);
  }
  addDevice(product) {
    this.items = product;
  }

  getDevice() {
    return this.items;
  }

  addDeviceList(product) {
    this.deviceList = product;
  }

  getDeviceList() {
    return this.deviceList;
  }

  // clearCart() {
  //   this.items = [];
  //   return this.items;
  // }

  getSoftware() {
    return this.items['reports'][0]['softList'];
  }



}