import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CustomDevice } from './class/custom-device';
import { ValidateCustomAside } from './class/validate-custom-aside';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { ManufactureDevice } from './class/manufacture-device';
import { ModelDevice } from './class/model-device';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { DeviceTagsStateService } from 'src/app/states/device-tags/device-tags-state.service';
import { DeviceTag } from '../../setting/manage-tags/manage-tags-devices/class/device-tag';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { DatePickerComponent } from '../../shared/date-picker/date-picker.component';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';
import { CompanyDevicesCustomDropDownComponent } from './company-devices-custom-drop-down/company-devices-custom-drop-down.component';
import { ManufacturesDropDownComponent } from './manufactures-drop-down/manufactures-drop-down.component';
import { ModelsDropDownComponent } from './models-drop-down/models-drop-down.component';
import { Subscription } from 'rxjs';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { DeviceType } from '../class/device-type';
import { PreloaderTicketComponent } from '../../shared/preloader-ticket/preloader-ticket.component';
import { DisabledBtnDirective as DisabledBtnDirective_1 } from '../../../directives/disabled-btn/disabled-btn.directive';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { CompanyDevicesAssestTypeDropDownComponent } from './company-devices-assest-type-drop-down/company-devices-assest-type-drop-down.component';

@Component({
  selector: 'app-company-devices-custom-aside',
  templateUrl: './company-devices-custom-aside.component.html',
  styleUrls: ['./company-devices-custom-aside.component.scss'],
  standalone: true,
  imports: [CompanyDevicesAssestTypeDropDownComponent, NgClass, FormsModule, NgIf, ManufacturesDropDownComponent, ModelsDropDownComponent, DatePickerComponent, CompanyDevicesCustomDropDownComponent, DisabledBtnDirective_1, PreloaderTicketComponent]
})
export class CompanyDevicesCustomAsideComponent implements OnInit, OnDestroy {
  device: CustomDevice = new CustomDevice();
  assestType: Array<DeviceType> = [];
  startDate = new Date().getTime();
  formatDate: string = FORMAT_DATE_2;
  models: Array<ModelDevice> = [];
  tags: Array<DeviceTag> = [];
  manufactures: Array<ManufactureDevice> = [];
  validate: ValidateCustomAside = new ValidateCustomAside();
  opened: boolean = false;
  @ViewChild('tagsDd', { static: true }) tagsDd: CompanyDevicesCustomDropDownComponent;
  sub: Subscription = new Subscription();
  @ViewChild('addBtn', { static: true }) addBtn: DisabledBtnDirective;
  @ViewChild('typeDd', { static: true }) typeDd: DropDownComponent;
  @ViewChild('manufacturesDd', { static: true }) manufacturesDd: ManufacturesDropDownComponent;
  @ViewChild('modelsDd', { static: true }) modelsDd: ModelsDropDownComponent;
  @ViewChild('installDateDP', { static: true }) installDateDP: DatePickerComponent;
  @ViewChild('warrantyDateDP', { static: true }) warrantyDateDP: DatePickerComponent;
  constructor(public devicesStateService: DevicesStateService,
    private deviceTagsStateService: DeviceTagsStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private companiesState: CompaniesStateService,
    private devicesService: DevicesService) { }


  ngOnInit() {
    if (this.devicesStateService.getManufactures().length > 0) this.manufactures = this.devicesStateService.getManufactures();
    if (!this.devicesStateService.isGetManufactures && !this.customerPortalStateService.isCustomerPortal) this.devicesStateService.initGetManufactures();
    let onGetManufactures = this.devicesStateService.onGetManufactures.subscribe(data => {
      this.manufactures = data;
    })
    this.sub.add(onGetManufactures)
    if (this.devicesStateService.isGetDeviceType) this.assestType = this.devicesStateService.getDeviceTypes();
    let onGetDeviceType = this.devicesStateService.onGetDeviceType.subscribe(data => {
      this.assestType = data;
    })
    this.sub.add(onGetDeviceType);
    if (this.deviceTagsStateService.getTags().length > 0) this.tags = this.deviceTagsStateService.getTags();
    let onGetTags = this.deviceTagsStateService.onGetTags.subscribe(data => {
      this.tags = data;
    })
    this.sub.add(onGetTags);
    let onOpenCustomAside = this.devicesStateService.onOpenCustomAside.subscribe(data => {
      this.opened = true;
      this.device.setCompanyId(this.companiesState.getCompanyRoutingId());
      this.installDateDP.setEditDate(new Date().getTime());
      this.warrantyDateDP.setEditDate(new Date().getTime());
    })
    this.sub.add(onOpenCustomAside);
  }
  onSelectTags(data) {
    this.device.setTags(data);
  }
  onSelectAssestType(data) {
    this.device.setType(data);
    this.validate.resetType();
  }
  onSelectManufacture(data) {
    this.device.setManufacturerId(data ? data.id : null);
    this.models = [];
    this.modelsDd.clearWithOutChanges();
    this.device.setModelId(null);
    if (data) {
      this.device.setPreloaderModels(true);
      this.devicesService.getModels(data.id).subscribe((res: any) => {
        this.models = res.models.map(item => new ModelDevice(item))
        this.device.setPreloaderModels(false);
      })
    }
  }
  onSelectModel(data) {
    this.device.setModelId(data ? data.id : null);
  }
  onChangeInstallDate(data) {
    if (!data) this.device.resetInstallDate();
    if (data) this.device.setInstallDate(new Date(data.year, data.month - 1, data.day), this.companiesState.getCurrentCompany());
  }
  onChangeWarrentyDate(data) {
    if (!data) this.device.resetWarrentyDate();
    if (data) this.device.setWarrentyDate(new Date(data.year, data.month - 1, data.day), this.companiesState.getCurrentCompany());
  }
  closed() {
    this.opened = false;
    this.device = new CustomDevice();
    this.validate = new ValidateCustomAside();
    this.manufacturesDd.clearWithOutChanges();
    this.modelsDd.clearWithOutChanges();
    this.typeDd.clearWithOutChanges();
    this.tagsDd.clearWithOutChanges();
  }
  onAdd() {
    if (!this.validate.isValidate(this.device)) return;
    this.addBtn.setDisabled(true);
    this.devicesService.addCustomDevice(this.device.getDataForRequest()).subscribe(data => {
      this.devicesStateService.fastAddCustomDevice(data);
      this.addBtn.setDisabled(false);
      this.closed();
    }, err => {
      this.addBtn.setDisabled(false);
    })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
