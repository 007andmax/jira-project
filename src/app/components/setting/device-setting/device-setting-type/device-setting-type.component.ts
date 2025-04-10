import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ManufactureDevice } from 'src/app/components/company-devices/company-devices-custom-aside/class/manufacture-device';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_DEVICE_MANUFACTURE, DELETE_DEVICE_TYPE } from 'src/app/const/confirm';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { DeviceSettingFilter } from '../Class/devicesetting-filter';
import { DeviceSettingModelsComponent } from '../device-setting-models/device-setting-models.component';
import { ManufacturesCheckUseComponent } from '../manufactures-check-use/manufactures-check-use.component';
import { DeviceType } from 'src/app/components/company-devices/class/device-type';

@Component({
  selector: 'app-device-setting-type',
  templateUrl: './device-setting-type.component.html',
  styleUrls: ['./device-setting-type.component.scss']
})
export class DeviceSettingTypeComponent implements OnInit {
  showPreloader: boolean = true;
  addDeviceType: boolean = false;
  filter: DeviceSettingFilter = new DeviceSettingFilter();
  deviceTypes: Array<DeviceType> = [];
  sub: Subscription = new Subscription();
  @ViewChild("models", { static: true }) models: DeviceSettingModelsComponent;
  constructor(private devicesStateService: DevicesStateService,
    public cd: ChangeDetectorRef,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private devicesService: DevicesService) { }

  ngOnInit() {
    if (this.devicesStateService.isGetDeviceType) {
      this.deviceTypes = this.devicesStateService.getDeviceTypes();
      this.showPreloader = false;
    }
    if (!this.devicesStateService.isGetDeviceType) this.devicesStateService.initGetDeviceType();
    let onGetManufactures = this.devicesStateService.onGetDeviceType.subscribe(data => {
      this.deviceTypes = data;
      this.showPreloader = false;
      this.cd.detectChanges();
    })
    this.sub.add(onGetManufactures);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_DEVICE_MANUFACTURE) this.removeManufacturer(this.devicesStateService.getManufacturForRemove().id);
      }
    })
    this.sub.add(getConfirm);
  }
  removeManufacturer(id) {
    this.devicesService.deleteManufactur(id).subscribe(data => {

    })
  }
  openDeviceType() {
    this.addDeviceType = true;
  }
  onClosedAddDeviceType() {
    this.addDeviceType = false;
  }
  select(data) {
    this.models.onSelectManufacture(data);
  }
  onEditDeviceType(item, event) {
    if (item.isInitEdit) {
      if (item.name.length === 0 || item.isInitRequest) return;
      item.setIsInitRequest(true);
      this.devicesService.editDeviceType(item.getDataForEdit()).pipe(map((res) => res),
        catchError(error => of(undefined))).subscribe(data => {
          item.setIsInitRequest(false);
          item.onInitEdit(false);
          if (event) event.target.blur();
        }, err => {
          item.setIsInitRequest(false);
        })
    }
  }
  addFastDeviceType(data) {
    let index = this.deviceTypes.findIndex(item => item.id === data.id);
    if (index == -1) this.deviceTypes.push(data);
  }
  removeConfirmDeviceType(manufacturer: any) {
    this.confirmStateService.setConfirmAction(DELETE_DEVICE_TYPE);
    const modalRef = this.modalService.open(ManufacturesCheckUseComponent, { windowClass: 'xs-modal user-modal', container: "device-setting", backdrop: 'static', keyboard: false });
    modalRef.componentInstance.manufacture = manufacturer;
    this.devicesStateService.setManufacturForRemove(manufacturer);
  }
  public getSelectedCount() {
    return this.deviceTypes.filter(item => item.selected).length;
  }
  onFilter(field) {
    this.filter.onFilter(field, this.deviceTypes)
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
