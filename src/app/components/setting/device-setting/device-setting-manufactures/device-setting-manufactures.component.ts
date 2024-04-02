import { Component, OnInit } from '@angular/core';
import { ManufactureDevice } from 'src/app/components/company-devices/company-devices-custom-aside/class/manufacture-device';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { DeviceSettingFilter } from './class/device-setting-filter';

@Component({
  selector: 'app-device-setting-manufactures',
  templateUrl: './device-setting-manufactures.component.html',
  styleUrls: ['./device-setting-manufactures.component.scss']
})
export class DeviceSettingManufacturesComponent implements OnInit {
  showPreloader: boolean = true;
  filter: DeviceSettingFilter = new DeviceSettingFilter();
  manufactures: Array<ManufactureDevice> = [];
  constructor(private devicesStateService: DevicesStateService,
    private devicesService: DevicesService) { }

  ngOnInit() {
    if (this.devicesStateService.getManufactures().length > 0) {
      this.manufactures = this.devicesStateService.getManufactures();
      this.showPreloader = false;
    }
    if (this.devicesStateService.getManufactures().length == 0) this.devicesStateService.initGetManufactures();
    this.devicesStateService.onGetManufactures.subscribe(data => {
      this.manufactures = data;
      this.showPreloader = false;
    })
  }
  public getSelectedCount() {
    return this.manufactures.filter(item => item.selected).length;
  }
  onFilter(field) {
    this.filter.onFilter(field, this.manufactures)
  }
}
