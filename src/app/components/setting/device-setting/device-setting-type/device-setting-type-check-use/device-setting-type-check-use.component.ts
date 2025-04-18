import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DeviceType } from 'src/app/components/company-devices/class/device-type';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { GlNumberUse } from '../../../accounting/gl-number/gl-number-check-use/class/gl-number-use';
import { DeviceTypeCheck } from './class/device-type-check';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';

@Component({
  selector: 'app-device-setting-type-check-use',
  templateUrl: './device-setting-type-check-use.component.html',
  styleUrls: ['./device-setting-type-check-use.component.scss'],
  providers: [TicketsListService]
})
export class DeviceSettingTypeCheckUseComponent implements OnInit {

  @Input() deviceType: DeviceType;
  assignDeviceType: DeviceType;
  assestType: Array<DeviceType> = [];
  showPreloader: boolean = true;
  valid: boolean = false;
  list: Array<DeviceTypeCheck> = [];
  sub: Subscription = new Subscription();
  constructor(
    public activeModal: NgbActiveModal,
    private devicesStateService: DevicesStateService,
    private devicesService: DevicesService,
    private confirmStateService: ConfirmStateService,
  ) { }

  ngOnInit() {
    this.getAssignDevicesTypes();
    /* let onRefreshGlNumbersCheck = this.glNumberStateService.onRefreshGlNumbersCheck.subscribe(data => {
       this.showPreloader = true;
       this.glNumberService.validateForRemove(this.glNumber.id).subscribe((data: any) => {
         this.getGlNumber(data);
       });
     })
     this.sub.add(onRefreshGlNumbersCheck);*/
    if (this.devicesStateService.isGetDeviceType) this.assestType = this.devicesStateService.getDeviceTypes();
    let onGetDeviceType = this.devicesStateService.onGetDeviceType.subscribe(data => {
      this.assestType = data;
    })
    this.sub.add(onGetDeviceType);
  }
  getAssignDevicesTypes() {
    this.showPreloader = true;
    this.devicesService.getAssignDevicesTypes(this.deviceType.id).subscribe((data: any) => {

      this.list = data.companies.map(item => new DeviceTypeCheck(item));
      this.showPreloader = false;
    })
  }
  onSelectAssestType(item: DeviceType) {
    this.assignDeviceType = item;
  }
  setAssignDeviceType() {
    let list = [];
    this.list.forEach(company => {
      company.devices.forEach(item => {
        if (item.selected) list.push(item.id);
      })
    })
    this.devicesService.setAssignDevicesTypes({
      "deviceTypeId": this.assignDeviceType.id,
      "devices": list,
    }).subscribe((data: any) => {
      this.getAssignDevicesTypes();
    })
  }


  cancelConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(false);
  };

  approveConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(true);
  };
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
