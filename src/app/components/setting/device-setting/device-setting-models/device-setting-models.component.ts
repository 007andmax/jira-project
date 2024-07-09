import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ManufactureDevice } from 'src/app/components/company-devices/company-devices-custom-aside/class/manufacture-device';
import { ModelDevice } from 'src/app/components/company-devices/company-devices-custom-aside/class/model-device';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { DeviceSettingFilter } from '../device-setting-manufactures/class/device-setting-filter';
import { catchError, map } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { DevicesRealTimeService } from 'src/app/states/devices/devices-real-time.service';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DELETE_DEVICE_MODEL } from 'src/app/const/confirm';
import { ManufacturesCheckUseComponent } from '../manufactures-check-use/manufactures-check-use.component';

@Component({
  selector: 'app-device-setting-models',
  templateUrl: './device-setting-models.component.html',
  styleUrls: ['./device-setting-models.component.scss']
})
export class DeviceSettingModelsComponent implements OnInit, OnDestroy {
  selectedManufacture: ManufactureDevice;
  manufactures: Array<ManufactureDevice> = [];
  models: Array<ModelDevice> = [];
  showPreloader: boolean = false;
  @Input() isManufacturePreloader: boolean = false;
  addModel: boolean = false;
  filter: DeviceSettingFilter = new DeviceSettingFilter();
  sub: Subscription = new Subscription();
  constructor(private devicesStateService: DevicesStateService,
    private devicesRealTimeService: DevicesRealTimeService,
    public cd: ChangeDetectorRef,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private devicesService: DevicesService,) { }

  ngOnInit() {
    if (this.devicesStateService.getManufactures().length > 0) {
      this.manufactures = this.devicesStateService.getManufactures();

    }
    let onGetManufactures = this.devicesStateService.onGetManufactures.subscribe(data => {
      this.manufactures = data;
    })
    this.sub.add(onGetManufactures);
    let onAddModel = this.devicesStateService.onAddModel.subscribe(data => {
      if (data.manufacturerId == this.selectedManufacture.id) this.models.push(new ModelDevice(data));
    })
    this.sub.add(onAddModel);
    let changeDevicesArray = this.devicesRealTimeService.changeDevicesArray.subscribe(newChange => {
      if (newChange.action === 'MANUFACTURE_MODEL_EDITED') {
        if (this.selectedManufacture && newChange.data.manufacturerId == this.selectedManufacture.id) {
          let index = this.models.findIndex(item => item.id == newChange.data.id);
          if (index > -1) this.models[index] = new ModelDevice(newChange.data);
          this.cd.detectChanges();
        }
      }
      if (newChange.action === 'MANUFACTURE_MODEL_SAVED') {
        if (this.selectedManufacture && newChange.data.manufacturerId == this.selectedManufacture.id) {
          this.models.push(new ModelDevice(newChange.data));
          this.cd.detectChanges();
        }
      }
      if (newChange.action === 'MANUFACTURE_MODEL_DELETED') {
        let index = this.models.findIndex(item => item.id == newChange.data);
        if (index > -1) this.models.splice(index, 1);
        this.cd.detectChanges();
      }
    });
    this.sub.add(changeDevicesArray);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_DEVICE_MODEL) this.removeModel(this.devicesStateService.getModelForRemove().id);
      }
    })
    this.sub.add(getConfirm);
  }
  openModelPopup() {
    if (!this.selectedManufacture) return;
    this.addModel = true;
  }
  onClosedAddModel() {
    this.addModel = false;
  }
  removeModel(id) {
    this.devicesService.deleteModel(id).subscribe(data => {

    })
  }
  onEditModel(item, event) {
    if (item.isInitEdit) {
      if (item.name.length === 0 || item.isInitRequest) return;
      item.setIsInitRequest(true);
      this.devicesService.editModel(item.getDataModelForEdit(this.selectedManufacture.id)).pipe(map((res) => res),
        catchError(error => of(undefined))).subscribe(data => {
          item.setIsInitRequest(false);
          item.onInitEdit(false);
          if (event) event.target.blur();
        }, err => {
          item.setIsInitRequest(false);
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
        this.cd.detectChanges();
      })
    }
  }
  removeConfirmModel(model: any) {
    this.confirmStateService.setConfirmAction(DELETE_DEVICE_MODEL);
    const modalRef = this.modalService.open(ManufacturesCheckUseComponent, { windowClass: 'xs-modal user-modal', container: "device-setting", backdrop: 'static', keyboard: false });
    modalRef.componentInstance.manufacture = this.selectedManufacture;
    modalRef.componentInstance.model = model;
    this.devicesStateService.setManufacturForRemove(this.selectedManufacture);
    this.devicesStateService.setModelForRemove(model);
  }
  onFilter(field) {
    this.filter.onFilter(field, this.models)
  }
  public getSelectedCount() {
    return this.models.filter(item => item.selected).length;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
