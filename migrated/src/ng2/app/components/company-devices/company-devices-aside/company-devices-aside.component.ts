import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { DevicesStateService } from 'src/ng2/app/states/devices/devices-state.service';
import { DeviceCompanyAsideParams } from '../class/device-company-aside-params';
import { DeviceExtended } from '../class/device-extended';
import { DeviceExtendedReport } from '../class/device-extended-report';


@Component({
  selector: 'app-company-devices-aside',
  templateUrl: './company-devices-aside.component.html',
  styleUrls: ['./company-devices-aside.component.scss']
})
export class CompanyDevicesAsideComponent implements OnInit, OnDestroy {
  @Input() companyId: string;
  tab: string = "SYSTEM";
  devices: Array<DeviceExtended> = [];
  currentDevice: DeviceExtended;
  open: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private devicesStateService: DevicesStateService,
    private devicesService: DevicesService) { }


  ngOnInit() {
    let getOnOpenAside = this.devicesStateService.getOnOpenAside().subscribe((data: DeviceCompanyAsideParams) => {
      console.log("data", data);
      this.open = true;
      forkJoin(
        [...data.ids.map(item => this.devicesService.getDeviceExtended(this.companyId, item))]
      )
        .subscribe(res => {
          console.log("res", res);

          res.forEach(item => {
            if (item[this.companyId].length > 0) this.devices.push(new DeviceExtended(item[this.companyId][0]));
          })
          console.log("this.devices", this.devices);
          this.currentDevice = this.devices[0];
        });
    })
    this.sub.add(getOnOpenAside);
  }
  isLabel() {
    if (this.currentDevice.label && this.currentDevice.hostName) return this.currentDevice.label !== this.currentDevice.hostName;
  }
  removeDevice() {
    let index = this.devices.findIndex(item => item.id === this.currentDevice.id);
    this.devices.splice(index, 1);
    this.currentDevice = this.devices[0];
  }
  close() {
    this.open = false;
    this.currentDevice = null;
    this.devices = [];
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
