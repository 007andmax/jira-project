import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { DevicesStateService } from 'src/ng2/app/states/devices/devices-state.service';
import { DeviceCompanyAsideParams } from '../class/device-company-aside-params';

@Component({
  selector: 'app-company-devices-aside',
  templateUrl: './company-devices-aside.component.html',
  styleUrls: ['./company-devices-aside.component.scss']
})
export class CompanyDevicesAsideComponent implements OnInit, OnDestroy {
  @Input() companyId: string;
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
        .subscribe(res4 => {
          console.log("res4", res4);
        });
    })
    this.sub.add(getOnOpenAside);
  }
  close() {
    this.open = false;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
