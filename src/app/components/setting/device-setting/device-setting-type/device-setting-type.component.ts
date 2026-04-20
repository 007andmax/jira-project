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
import { DeviceFilterType } from './class/device-filter-type';
import { DeviceSettingTypeCheckUseComponent } from './device-setting-type-check-use/device-setting-type-check-use.component';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { DynamicTooltipComponent } from '../../../shared/dynamic-tooltip/dynamic-tooltip.component';
import { MatErrorComponent } from '../../../shared/mat-error/mat-error.component';
import { KeyUpEnterDirective } from '../../../../directives/key-up-enter/key-up-enter.directive';
import { FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../../../directives/click-otside/click-otside.directive';
import { NgClass, NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-device-setting-type',
    templateUrl: './device-setting-type.component.html',
    styleUrls: ['./device-setting-type.component.scss'],
    standalone: true,
    imports: [NgClass, NgIf, NgFor, ClickOutsideDirective, FormsModule, KeyUpEnterDirective, MatErrorComponent, DynamicTooltipComponent, DeviceSettingTypeCheckUseComponent]
})
export class DeviceSettingTypeComponent implements OnInit {
  showPreloader: boolean = true;
  addDeviceType: boolean = false;

  filter: DeviceFilterType = new DeviceFilterType();
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
        if (this.confirmStateService.getConfirmAction() === DELETE_DEVICE_TYPE) this.removeDeviceType(this.devicesStateService.getDeviceTypeForRemove().id);
      }
    })
    this.sub.add(getConfirm);
  }
  removeDeviceType(id) {
    this.devicesService.deleteDeviceType(id).subscribe((data: any) => {
      this.confirmStateService.initRequest(false);
    }, err => {
      this.confirmStateService.initRequest(false);
    });
  }
  onRemoveDeviceType(deviceType) {
    this.devicesService.getAssignDevicesTypes(deviceType.id).subscribe((data: any) => {
      if (data.companies.length > 0) {
        this.devicesStateService.checkDeviceTypeForRemove({ deviceType, list: data });
      } else {
        this.confirmStateService.setConfirmAction(DELETE_DEVICE_TYPE);
        const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
        modalRef.componentInstance.header = `Delete Device Type`;
        modalRef.componentInstance.message = `Are you sure you want to delete this device type?`;
        this.devicesStateService.setDeviceTypeForRemove(deviceType);
      }
    })
  }
  onEditDeviceType(item, event) {
    if (item.isInitEdit) {
      if (item.name.length === 0 || item.disableUpdate || item.isInitRequest) return;
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
    if (index == -1) {
      this.deviceTypes.push(data);
      this.deviceTypes.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 0);

    }
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
