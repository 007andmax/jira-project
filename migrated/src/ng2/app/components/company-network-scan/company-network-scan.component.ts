import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DevicesStateService } from '../../states/devices/devices-state.service';

import { Device } from '../company-devices/class/device';

@Component({
  selector: 'app-company-network-scan',
  templateUrl: './company-network-scan.component.html',
  styleUrls: ['./company-network-scan.component.scss']
})
export class CompanyNetworkScanComponent implements OnInit, OnDestroy {
  devices: Array<Device> = [];
  showPreloader: boolean = true;
  companyId: string;
  sub: Subscription = new Subscription();
  constructor(private devicesStateService: DevicesStateService,
    public cd: ChangeDetectorRef,) { }


  ngOnInit() {
    this.companyId = localStorage.getItem("company_id");
    if (this.devicesStateService.getAllDevices()) {
      this.devices = (this.devicesStateService.getAllDevices()[this.companyId]) ? JSON.parse(JSON.stringify(this.devicesStateService.getAllDevices()[this.companyId])).map(item => new Device(item)) : [];

      this.showPreloader = false;
      this.cd.detectChanges();
    }
    let getOnDevices = this.devicesStateService.getOnDevices().subscribe(data => {
      this.devices = (data[this.companyId]) ? JSON.parse(JSON.stringify(data[this.companyId])).map(item => new Device(item)) : [];

      this.cd.detectChanges();
      this.showPreloader = false;
    })
    this.sub.add(getOnDevices);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
