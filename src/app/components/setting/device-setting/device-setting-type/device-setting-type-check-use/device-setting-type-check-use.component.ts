import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DeviceType } from 'src/app/components/company-devices/class/device-type';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { GlNumberUse } from '../../../accounting/gl-number/gl-number-check-use/class/gl-number-use';
import { DeviceTypeCheck } from './class/device-type-check';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { DELETE_DEVICE_TYPE } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';


@Component({
  selector: 'app-device-setting-type-check-use',
  templateUrl: './device-setting-type-check-use.component.html',
  styleUrls: ['./device-setting-type-check-use.component.scss'],
  providers: [TicketsListService]
})
export class DeviceSettingTypeCheckUseComponent implements OnInit {
  @ViewChild('addBtn', { static: false }) addBtn: DisabledBtnDirective;
  opened: boolean = false;
  deviceType: DeviceType;
  assignDeviceType: DeviceType;
  assestType: Array<DeviceType> = [];
  showPreloader: boolean = true;
  valid: boolean = false;
  list: Array<DeviceTypeCheck> = [];
  sub: Subscription = new Subscription();
  constructor(
    private devicesStateService: DevicesStateService,
    private devicesService: DevicesService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    if (this.devicesStateService.isGetDeviceType) this.assestType = this.devicesStateService.getDeviceTypes();
    let onGetDeviceType = this.devicesStateService.onGetDeviceType.subscribe(data => {
      this.assestType = data;
    })
    this.sub.add(onGetDeviceType);
    let onCheckDeviceTypeForRemove = this.devicesStateService.onCheckDeviceTypeForRemove.subscribe(data => {
      this.deviceType = data.deviceType;
      this.list = data.list.companies.map(item => new DeviceTypeCheck(item));
      this.opened = true;
      this.cd.detectChanges();
    });
    this.sub.add(onCheckDeviceTypeForRemove);
  }
  isDisable() {
    return (this.assignDeviceType && this.list.some(company => company.devices.some(item => item.selected)))
  }
  public checkDefaultName(name) {
    if (name == "workstation" || name == "router"
      || name == "printer" || name == "switch" || name == "server"
      || name == "tablet" || name == "network device" || name == "phone" || name == "generic device") return true;
    return false;
  }
  getAssignDevicesTypes() {
    this.showPreloader = true;
    this.devicesService.getAssignDevicesTypes(this.deviceType.id).subscribe((data: any) => {
      if (data.companies.length > 0) {
        this.list = data.companies.map(item => new DeviceTypeCheck(item));
      } else {
        this.confirmStateService.setConfirmAction(DELETE_DEVICE_TYPE);
        const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
        modalRef.componentInstance.header = `Delete Device Type`;
        modalRef.componentInstance.message = `Are you sure you want to delete this device type?`;
        this.devicesStateService.setDeviceTypeForRemove(this.deviceType);
        this.closed();
      }
      this.showPreloader = false;
    })
  }
  onSelectAssestType(item: DeviceType) {
    this.assignDeviceType = item;
  }
  setAssignDeviceType() {
    this.addBtn.setDisabled(true);
    let list = [];
    this.list.forEach(company => {
      company.devices.forEach(item => {
        if (item.selected) list.push(item.deviceId);
      })
    })
    this.devicesService.setAssignDevicesTypes({
      "deviceTypeId": this.assignDeviceType.id,
      "devices": list,
    }).subscribe((data: any) => {
      this.addBtn.setDisabled(false);
      this.getAssignDevicesTypes();
    })
  }

  closed() {
    this.opened = false;
    this.list = [];
    this.showPreloader = true;
    this.cd.detectChanges();
  }

  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
