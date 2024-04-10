import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ManufactureDevice } from 'src/app/components/company-devices/company-devices-custom-aside/class/manufacture-device';
import { ModelDevice } from 'src/app/components/company-devices/company-devices-custom-aside/class/model-device';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { DeviceSettingFilter } from '../device-setting-manufactures/class/device-setting-filter';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { DevicesRealTimeService } from 'src/app/states/devices/devices-real-time.service';

@Component({
  selector: 'app-device-setting-models',
  templateUrl: './device-setting-models.component.html',
  styleUrls: ['./device-setting-models.component.scss']
})
export class DeviceSettingModelsComponent implements OnInit {
  selectedManufacture: ManufactureDevice;
  manufactures: Array<ManufactureDevice> = [];
  models: Array<ModelDevice> = [];
  showPreloader: boolean = false;
  filter: DeviceSettingFilter = new DeviceSettingFilter();
  constructor(private devicesStateService: DevicesStateService,
    private devicesRealTimeService: DevicesRealTimeService,
    public cd: ChangeDetectorRef,
    private devicesService: DevicesService,) { }

  ngOnInit() {
    if (this.devicesStateService.getManufactures().length > 0) {
      this.manufactures = this.devicesStateService.getManufactures();

    }
    if (this.devicesStateService.getManufactures().length == 0) this.devicesStateService.initGetManufactures();
    this.devicesStateService.onGetManufactures.subscribe(data => {
      this.manufactures = data;

    })
    this.devicesStateService.onAddModel.subscribe(data => {
      if (data.manufacturerId == this.selectedManufacture.id) this.models.push(new ModelDevice(data));
    })
    this.devicesRealTimeService.changeDevicesArray.subscribe(newChange => {
      if (newChange.action === 'MANUFACTURE_MODEL_EDITED') {
        if (newChange.data.manufacturerId == this.selectedManufacture.id) {
          let index = this.models.findIndex(item => item.id == newChange.data.id);
          console.log("index", index);
          if (index > -1) this.models[index] = new ModelDevice(newChange.data);
          this.cd.detectChanges();
        }
      }
    });
  }
  onEditModel(item) {
    if (item.isInitEdit) {
      if (item.name.length === 0) return;
      this.devicesService.editModel(item.getDataModelForEdit(this.selectedManufacture.id)).pipe(map((res) => res),
        catchError(error => of(undefined))).subscribe(data => {
          item.onInitEdit(false);
        })
    }
  }
  onSelectManufacture(data) {
    this.selectedManufacture = data;
    if (data) {
      this.showPreloader = true;
      this.devicesService.getModels(data.id).subscribe((res: any) => {
        this.models = res.models.map(item => new ModelDevice(item))
        this.models.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 0);
        this.showPreloader = false;
      })
    }
  }
  onFilter(field) {
    this.filter.onFilter(field, this.models)
  }
  public getSelectedCount() {
    return this.models.filter(item => item.selected).length;
  }

}
