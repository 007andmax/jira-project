import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ManufactureDevice } from 'src/app/components/company-devices/company-devices-custom-aside/class/manufacture-device';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { DeviceSettingFilter } from './class/device-setting-filter';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

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
    public cd: ChangeDetectorRef,
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
      this.cd.detectChanges();
    })
  }
  onEditManufactur(item) {
    if (item.isInitEdit) {
      if (item.name.length === 0) return;
      this.devicesService.editManufactur(item.getDataForEdit()).pipe(map((res) => res),
        catchError(error => of(undefined))).subscribe(data => {
          item.onInitEdit(false);
        })
    }
  }
  public getSelectedCount() {
    return this.manufactures.filter(item => item.selected).length;
  }
  onFilter(field) {
    this.filter.onFilter(field, this.manufactures)
  }
}
