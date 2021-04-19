import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { DeviceCompany } from '../class/device-company';

@Component({
  selector: 'app-company-devices-edit-name',
  templateUrl: './company-devices-edit-name.component.html',
  styleUrls: ['./company-devices-edit-name.component.scss']
})
export class CompanyDevicesEditNameComponent implements OnInit {
  label: string;
  @Input() device: DeviceCompany;
  @Output() onChangeName = new EventEmitter();
  constructor(private devicesService: DevicesService,) { }

  ngOnInit() {
  }
  changeName() {
    this.devicesService.editAgentInfo(this.device.getDataForEditLabel((this.label.length > 0) ? this.label : this.device.hostName || this.device.ip)).subscribe(data => {
      this.onChangeName.emit(this.label);
    })
  }
  public onOpenDropDown(open) {
    if (open) this.label = JSON.parse(JSON.stringify(this.device.label || this.device.hostName || this.device.ip))
  }
  close() {
    this.label = '';
  }
}
