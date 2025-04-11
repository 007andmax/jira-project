import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DeviceExtended } from '../../class/device-extended';
import * as moment from "moment";
import { DevicesService } from 'src/app/services/devices/devices.service';
import { HardwareService } from '../../../device/_services/hardware.service';
import { DatePickerComponent } from '../../../shared/date-picker/date-picker.component';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { CompanyDevicesEditLabelComponent } from '../../company-devices-edit-label/company-devices-edit-label.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { DeviceCompany } from '../../class/device-company';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ModelDevice } from '../../company-devices-custom-aside/class/model-device';
import { ManufactureDevice } from '../../company-devices-custom-aside/class/manufacture-device';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { Subscription } from 'rxjs';
import { DeviceType } from '../../class/device-type';

@Component({
  selector: 'app-company-devices-aside-system',
  templateUrl: './company-devices-aside-system.component.html',
  styleUrls: ['./company-devices-aside-system.component.scss']
})
export class CompanyDevicesAsideSystemComponent implements OnInit, OnDestroy {
  @ViewChild('datePickerInstalledOn', { static: false }) datePickerInstalledOn: DatePickerComponent;
  @ViewChild('datePickerWarranty', { static: false }) datePickerWarranty: DatePickerComponent;
  @ViewChild('nameLabel', { static: false }) nameLabel: CompanyDevicesEditLabelComponent;
  @ViewChild('assetTagLabel', { static: false }) assetTagLabel: CompanyDevicesEditLabelComponent;
  @ViewChild('ipAddressLabel', { static: false }) ipAddressLabel: CompanyDevicesEditLabelComponent;
  @ViewChild('locationLabel', { static: false }) locationLabel: CompanyDevicesEditLabelComponent;
  @ViewChild('manufacturerDd', { static: false }) manufacturerDd: DropDownComponent;
  @ViewChild('assestTypeDd', { static: false }) assestTypeDd: DropDownComponent;
  @ViewChild('modelDd', { static: false }) modelDd: DropDownComponent;
  @Input() device: DeviceExtended;
  @Input() customDevice: DeviceCompany;
  assestType: Array<DeviceType> = [];
  models: Array<ModelDevice> = [];
  manufactures: Array<ManufactureDevice> = [];
  formatDate: string = FORMAT_DATE_2;
  toggleWindowSpecifications: boolean = false;
  toggleDeviceSpecifications: boolean = false;
  isInitEditNote = false;
  sub: Subscription = new Subscription();
  constructor(private devicesService: DevicesService,
    private devicesStateService: DevicesStateService,
    private hardwareService: HardwareService,
    public customerPortalStateService: CustomerPortalStateService,
    private companiesState: CompaniesStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.devicesStateService.getManufactures().length > 0) this.manufactures = this.devicesStateService.getManufactures();
    if (!this.devicesStateService.isGetManufactures && !this.customerPortalStateService.isCustomerPortal) this.devicesStateService.initGetManufactures();
    let onGetManufactures = this.devicesStateService.onGetManufactures.subscribe(data => {
      this.manufactures = data;
    })
    this.sub.add(onGetManufactures);
    if (this.device && !this.device.report.system) {
      this.device.report.system.warranty = this.getToDayDate();
      this.device.report.system.installDate = this.getToDayDate();
    }
    if (this.customDevice && this.customDevice.manufacturer && !this.customerPortalStateService.isCustomerPortal) this.getModels(this.customDevice.manufacturer.id);
    if (this.devicesStateService.isGetDeviceType) this.assestType = this.devicesStateService.getDeviceTypes();
    if (!this.devicesStateService.isGetDeviceType) this.devicesStateService.initGetDeviceType();
    let onGetDeviceType = this.devicesStateService.onGetDeviceType.subscribe(data => {
      this.assestType = data;
    })
    this.sub.add(onGetDeviceType);
  }
  onSelectManufacture(data) {
    this.modelDd.clearWithOutChanges();
    this.customDevice.setModel(null);
    this.customDevice.setManufacturer(data);
    this.devicesService.editDevice(this.customDevice.getRequestForEdit()).subscribe(data => {

    })
    if (data) {
      this.getModels(data.id);
    }
  }
  onSelectAssestType(data) {
    this.customDevice.setType(data);
    this.devicesService.editDevice(this.customDevice.getRequestForEdit()).subscribe(data => {

    })
  }
  public setIsInitEditNote(data) {
    this.isInitEditNote = data;
  }
  public refresh(data) {
    this.customDevice = data;
    this.device = null;
    if (this.nameLabel) this.nameLabel.setValue(this.customDevice.name);
    if (this.assetTagLabel) this.assetTagLabel.setValue(this.customDevice.assetTag);
    if (this.manufacturerDd) this.manufacturerDd.selectItemWithOutChanges(this.customDevice.manufacturer);
    if (this.assestTypeDd) this.assestTypeDd.selectItemWithOutChanges(this.customDevice.type);
    if (this.ipAddressLabel) this.ipAddressLabel.setValue(this.customDevice.ip);
    if (this.modelDd) this.modelDd.selectItemWithOutChanges(this.customDevice.model);
    if (this.datePickerWarranty) this.datePickerWarranty.setEditDate(this.customDevice.warrantyDateInt);
    if (this.datePickerInstalledOn) this.datePickerInstalledOn.setEditDate(this.customDevice.installDateInt);
    if (this.locationLabel) this.locationLabel.setValue(this.customDevice.location);
    this.cd.detectChanges();
  }
  getModels(id) {
    this.devicesService.getModels(id).subscribe((res: any) => {
      this.models = res.models.map(item => new ModelDevice(item))
    })
  }
  onSelectModel(data) {
    this.customDevice.setModel(data);
    this.devicesService.editDevice(this.customDevice.getRequestForEdit()).subscribe(data => {

    })
  }
  onChangeName(value) {
    if (this.customDevice) {
      this.customDevice.setName(value);
      if (value.length > 0) this.devicesService.editDevice(this.customDevice.getRequestForEdit()).subscribe(data => {

      })
      return;
    }
    this.devicesService.editAgentInfo(this.device.getDataForEditName((value.length > 0) ? value : this.device.hostName || this.device.ip)).subscribe(data => {
      this.device.setLabel((value.length > 0) ? value : null);
      this.nameLabel.setValue((value.length > 0) ? value : this.device.hostName || this.device.ip);
      this.cd.detectChanges();
    })
  }
  getLabelForEdit() {
    if (this.device.label) return this.device.label;
    return this.device.hostName || this.device.ip;
  }
  getNetworkAdapterField(field) {
    let find = this.device.report.networkAdapters.find(item => item.isDefault);
    return (find) ? find[field] : null;
  }
  public chackDefaultValue(value) {
    return (!value || value === "") ? "N\A" : value;
  }
  public getDate(date) {
    return (date !== null) ? moment(date).format('YYYY-MM-DD') : "";
  }
  public getSystemField(field) {
    return (this.device.report.system) ? this.device.report.system[field] : null;
  }
  parseDateFromDatePicker(value) {
    return moment(new Date(value.year, value.month - 1, value.day)).format('YYYY/MM/DD');
  }
  onChangeAssetTag(data) {
    this.customDevice.setAssetTag(data);
    this.editCustomDevice();
  }
  editCustomDevice() {
    this.devicesService.editDevice(this.customDevice.getRequestForEdit()).subscribe(data => {

    })
  }
  onChangeHardware(data, field, value) {
    this.hardwareService.overrideHardware(this.device.getDataForUpdateHardware(data))
      .subscribe(
        resp => {
          if (resp.errors === 'success') this.device.report.system[field] = value;
        }
      );
  }
  getToDayDate() {
    return Date.now();
  }

  onOpenDatePicketWarranty() {
    this.datePickerWarranty.getDropDown().open();
  }
  onChangeWarrentyDate(data) {
    if (!data) this.customDevice.resetWarrentyDate();
    if (data) this.customDevice.setWarrentyDate(new Date(data.year, data.month - 1, data.day), this.companiesState.getCurrentCompany());
    this.editCustomDevice();
  }
  onChangeIp(data) {
    this.customDevice.setIp(data);
    this.editCustomDevice();
  }
  onChangeNote() {
    this.setIsInitEditNote(false);
    this.editCustomDevice();
  }
  onChangeLocation(data) {
    this.customDevice.setLocation(data);
    this.editCustomDevice();
  }
  onChangeInstallDate(data) {
    if (!data) this.customDevice.resetInstallDate();
    if (data) this.customDevice.setInstallDate(new Date(data.year, data.month - 1, data.day), this.companiesState.getCurrentCompany());
    this.editCustomDevice();
  }
  getWindowsInfo() {
    return (this.device && this.device.report.system) ? `${this.device.report.system.caption.replace('Microsoft ', '')}${(this.device.report.system.architecture !== '') ? ` ( ${this.device.report.system.architecture} )` : ''}${(this.device.report.system.releaseId !== '') ? ` Version ${this.device.report.system.releaseId}` : ''}` : '';
  }
  getRamSize(ramSize) {
    return (ramSize > 0 && ramSize / 1073741824 > 0) ? (ramSize / 1073741824) + 'GB' : 0 + 'GB';
  };
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
