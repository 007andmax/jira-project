import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DeviceExtended } from '../../class/device-extended';
import * as moment from "moment";
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { HardwareService } from '../../../device/_services/hardware.service';
import { DatePickerComponent } from '../../../shared/date-picker/date-picker.component';

@Component({
  selector: 'app-company-devices-aside-system',
  templateUrl: './company-devices-aside-system.component.html',
  styleUrls: ['./company-devices-aside-system.component.scss']
})
export class CompanyDevicesAsideSystemComponent implements OnInit {
  @ViewChild('datePickerInstalledOn') datePickerInstalledOn: DatePickerComponent;
  @ViewChild('datePickerWarranty') datePickerWarranty: DatePickerComponent;
  @Input() device: DeviceExtended;
  toggleWindowSpecifications: boolean = false;
  toggleDeviceSpecifications: boolean = false;
  constructor(private devicesService: DevicesService,
    private hardwareService: HardwareService) { }

  ngOnInit() {
  }
  onChangeName(value) {
    this.devicesService.editAgentInfo(this.device.getDataForEditName(value)).subscribe(data => {
      this.device.setHostName(value);
    })
  }
  getNetworkAdapterField(field) {
    let find = this.device.report.networkAdapters.find(item => item.is_default);
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
  getWindowsInfo() {
    return (this.device.report.system) ? `${this.device.report.system.caption.replace('Microsoft ', '')}${(this.device.report.system.architecture !== '') ? ` ( ${this.device.report.system.architecture} )` : ''}${(this.device.report.system.release_id !== '') ? ` Version ${this.device.report.system.release_id}` : ''}` : '';
  }
  getRamSize(ramSize) {
    return (ramSize > 0 && ramSize / 1073741824 > 0) ? (ramSize / 1073741824) + 'GB' : 0 + 'GB';
  };
}
