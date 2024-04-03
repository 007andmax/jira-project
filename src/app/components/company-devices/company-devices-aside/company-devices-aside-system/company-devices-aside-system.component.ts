import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-company-devices-aside-system',
  templateUrl: './company-devices-aside-system.component.html',
  styleUrls: ['./company-devices-aside-system.component.scss']
})
export class CompanyDevicesAsideSystemComponent implements OnInit {
  @ViewChild('datePickerInstalledOn') datePickerInstalledOn: DatePickerComponent;
  @ViewChild('datePickerWarranty') datePickerWarranty: DatePickerComponent;
  @ViewChild('editLabel') editLabel: CompanyDevicesEditLabelComponent;
  @Input() device: DeviceExtended;
  @Input() customDevice: DeviceCompany;
  formatDate: string = FORMAT_DATE_2;
  toggleWindowSpecifications: boolean = false;
  toggleDeviceSpecifications: boolean = false;
  constructor(private devicesService: DevicesService,
    private devicesStateService: DevicesStateService,
    private hardwareService: HardwareService,
    public customerPortalStateService: CustomerPortalStateService,
    private companiesState: CompaniesStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.device && !this.device.report.system) {
      this.device.report.system.warranty = this.getToDayDate();
      this.device.report.system.installDate = this.getToDayDate();
    }
  }
  onChangeName(value) {
    if (this.customDevice) {
      if (value.length > 0) this.devicesService.editFieldDevice(this.customDevice.getDataForRequestField("name", value)).subscribe(data => {

      })
      return;
    }
    this.devicesService.editAgentInfo(this.device.getDataForEditName((value.length > 0) ? value : this.device.hostName || this.device.ip)).subscribe(data => {
      this.device.setLabel((value.length > 0) ? value : null);
      this.editLabel.setValue((value.length > 0) ? value : this.device.hostName || this.device.ip);
      this.cd.detectChanges();
    })
  }
  getLabelForEdit() {
    if (this.customDevice) return this.customDevice.name;
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
  onOpenDatePicketInstalledOn() {
    this.datePickerInstalledOn.getDropDown().open();
  }
  onOpenDatePicketWarranty() {
    this.datePickerWarranty.getDropDown().open();
  }
  onChangeWarrentyDate(data) {
    this.customDevice.setWarrentyDate(new Date(data.year, data.month - 1, data.day), this.companiesState.getCurrentCompany());
    this.devicesService.editFieldDevice(this.customDevice.getDataForRequestField("warrantyDate", this.customDevice.warrantyDate)).subscribe(data => {

    })
  }
  onChangeIp(data) {
    this.customDevice.setIp(data);
    this.devicesService.editFieldDevice(this.customDevice.getDataForRequestField("ip", this.customDevice.ip)).subscribe(data => {

    })
  }
  onChangeNote() {
    this.devicesService.editFieldDevice(this.customDevice.getDataForRequestField("note", this.customDevice.note)).subscribe(data => {

    })
  }
  onChangeLocation(data) {
    this.customDevice.setLocation(data);
    this.devicesService.editFieldDevice(this.customDevice.getDataForRequestField("location", this.customDevice.location)).subscribe(data => {

    })
  }
  onChangeInstallDate(data) {
    console.log(data);
    this.customDevice.setInstallDate(new Date(data.year, data.month - 1, data.day), this.companiesState.getCurrentCompany());
    this.devicesService.editFieldDevice(this.customDevice.getDataForRequestField("installDate", this.customDevice.installDate)).subscribe(data => {

    })
  }
  getWindowsInfo() {
    return (this.device && this.device.report.system) ? `${this.device.report.system.caption.replace('Microsoft ', '')}${(this.device.report.system.architecture !== '') ? ` ( ${this.device.report.system.architecture} )` : ''}${(this.device.report.system.releaseId !== '') ? ` Version ${this.device.report.system.releaseId}` : ''}` : '';
  }
  getRamSize(ramSize) {
    return (ramSize > 0 && ramSize / 1073741824 > 0) ? (ramSize / 1073741824) + 'GB' : 0 + 'GB';
  };
}
