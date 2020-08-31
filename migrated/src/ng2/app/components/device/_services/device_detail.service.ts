import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetailService {
    items = {};
    deviceList = [];
  
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