import { Injectable, EventEmitter } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { UsersStateService } from '../users/users-state.service';
import { DevicesService } from '../../services/devices/devices.service';

@Injectable({
  providedIn: 'root'
})
export class DevicesSateService {
  allDevices = null;
  onGetDevices: EventEmitter<any> = new EventEmitter();
  constructor(private userStateService: UsersStateService, private devicesService: DevicesService) { }

  public onInit() {

    this.userStateService.getOnGetCurrentuser().subscribe(data => {
      this.devicesService.getCompanyDevices(data.company.id).subscribe((data) => {
        console.log('data',data);
        this.setAllDevices(data);
        this.onInitGetDevices(data);
      })
    })
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
