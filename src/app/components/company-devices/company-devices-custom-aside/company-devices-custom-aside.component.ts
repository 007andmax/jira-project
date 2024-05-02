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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-devices-custom-aside',
  templateUrl: './company-devices-custom-aside.component.html',
  styleUrls: ['./company-devices-custom-aside.component.scss']
})
export class CompanyDevicesCustomAsideComponent implements OnInit, OnDestroy {
  device: CustomDevice = new CustomDevice();
  assestType: Array<string> = ["Workstation",
    "Router",
    "Printer",
    "Switch",
    "Server",
    "Tablet",
    "Network Device",
    "Phone",
    "Generic device"];
  startDate = new Date().getTime();
  formatDate: string = FORMAT_DATE_2;
  models: Array<ModelDevice> = [];
  tags: Array<DeviceTag> = [];
  manufactures: Array<ManufactureDevice> = [];
  validate: ValidateCustomAside = new ValidateCustomAside();
  opened: boolean = false;
  sub: Subscription = new Subscription();
  @ViewChild('addBtn') addBtn: DisabledBtnDirective;
  @ViewChild('typeDd') typeDd: DropDownComponent;
  @ViewChild('installDateDP') installDateDP: DatePickerComponent;
  @ViewChild('warrantyDateDP') warrantyDateDP: DatePickerComponent;
  constructor(private devicesStateService: DevicesStateService,
    private deviceTagsStateService: DeviceTagsStateService,
    private companiesState: CompaniesStateService,
    private devicesService: DevicesService) { }


  ngOnInit() {
    if (this.devicesStateService.getManufactures().length > 0) this.manufactures = this.devicesStateService.getManufactures();
    if (this.devicesStateService.getManufactures().length == 0) this.devicesStateService.initGetManufactures();
    let onGetManufactures = this.devicesStateService.onGetManufactures.subscribe(data => {
      this.manufactures = data;
    })
    this.sub.add(onGetManufactures)
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
    this.device.setTags(data.map(item => item.id));
  }
  onSelectAssestType(data) {
    this.device.setType(data);
    this.validate.resetType();
  }
  onSelectManufacture(data) {
    this.device.setManufacturerId(data ? data.id : null);
    if (data) {
      this.devicesService.getModels(data.id).subscribe((res: any) => {
        this.models = res.models.map(item => new ModelDevice(item))
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
    this.typeDd.clearWithOutChanges();
  }
  onAdd() {
    if (!this.validate.isValidate(this.device)) return;
    this.addBtn.setDisabled(true);
    this.devicesService.addCustomDevice(this.device.getDataForRequest()).subscribe(data => {
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
