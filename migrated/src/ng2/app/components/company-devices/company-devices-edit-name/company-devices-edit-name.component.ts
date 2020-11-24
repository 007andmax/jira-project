import { Component, Input, OnInit } from '@angular/core';
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { DeviceCompany } from '../class/device-company';

@Component({
  selector: 'app-company-devices-edit-name',
  templateUrl: './company-devices-edit-name.component.html',
  styleUrls: ['./company-devices-edit-name.component.scss']
})
export class CompanyDevicesEditNameComponent implements OnInit {
  label: string;
  @Input() device: DeviceCompany;

  constructor(private devicesService: DevicesService,) { }

  ngOnInit() {

  }
  onChangeName() {
    if (this.label.length > 0) this.devicesService.setIcon(this.device.getDataForEditLabel(this.label)).subscribe(data => {

    })
  }
  public onOpenDropDown(open) {
    console.log("open", open);
    if (open) this.label = JSON.parse(JSON.stringify(this.device.label))
  }
  close() {
    this.label = '';
  }
}
