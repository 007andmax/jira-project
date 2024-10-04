import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ManufactureDevice } from 'src/app/components/company-devices/company-devices-custom-aside/class/manufacture-device';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { DeviceSettingFilter } from './class/device-setting-filter';
import { catchError, map } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { DELETE_DEVICE_MANUFACTURE } from 'src/app/const/confirm';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManufacturesCheckUseComponent } from '../manufactures-check-use/manufactures-check-use.component';
import { DeviceSettingModelsComponent } from '../device-setting-models/device-setting-models.component';

@Component({
  selector: 'app-device-setting-manufactures',
  templateUrl: './device-setting-manufactures.component.html',
  styleUrls: ['./device-setting-manufactures.component.scss']
})
export class DeviceSettingManufacturesComponent implements OnInit, OnDestroy {
  showPreloader: boolean = true;
  addManufacture: boolean = false;
  filter: DeviceSettingFilter = new DeviceSettingFilter();
  manufactures: Array<ManufactureDevice> = [];
  sub: Subscription = new Subscription();
  @ViewChild("models") models: DeviceSettingModelsComponent;
  constructor(private devicesStateService: DevicesStateService,
    public cd: ChangeDetectorRef,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private devicesService: DevicesService) { }

  ngOnInit() {
    if (this.devicesStateService.isGetManufactures) {
      this.manufactures = this.devicesStateService.getManufactures();
      this.showPreloader = false;
    }
    if (!this.devicesStateService.isGetManufactures) this.devicesStateService.initGetManufactures();
    let onGetManufactures = this.devicesStateService.onGetManufactures.subscribe(data => {
      this.manufactures = data;
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
  openModelManufacture() {
    this.addManufacture = true;
  }
  onClosedAddManufacture() {
    this.addManufacture = false;
  }
  select(data) {
    this.models.onSelectManufacture(data);
  }
  onEditManufactur(item, event) {
    if (item.isInitEdit) {
      if (item.name.length === 0 || item.isInitRequest) return;
      item.setIsInitRequest(true);
      this.devicesService.editManufactur(item.getDataForEdit()).pipe(map((res) => res),
        catchError(error => of(undefined))).subscribe(data => {
          item.setIsInitRequest(false);
          item.onInitEdit(false);
          if (event) event.target.blur();
        }, err => {
          item.setIsInitRequest(false);
        })
    }
  }
  removeConfirmManufacturer(manufacturer: any) {
    this.confirmStateService.setConfirmAction(DELETE_DEVICE_MANUFACTURE);
    const modalRef = this.modalService.open(ManufacturesCheckUseComponent, { windowClass: 'xs-modal user-modal', container: "device-setting", backdrop: 'static', keyboard: false });
    modalRef.componentInstance.manufacture = manufacturer;
    this.devicesStateService.setManufacturForRemove(manufacturer);
  }
  public getSelectedCount() {
    return this.manufactures.filter(item => item.selected).length;
  }
  onFilter(field) {
    this.filter.onFilter(field, this.manufactures)
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
