import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Device } from '../class/device';
import { DeviceCompany } from '../class/device-company';
import { CompanyDevicesRemoteAccessComponent } from '../company-devices-remote-access/company-devices-remote-access.component';
import * as moment from "moment";
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { PermissionsService } from 'src/ng2/app/services/permissions/permissions.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';

@Component({
  selector: 'app-company-devices-item',
  templateUrl: './company-devices-item.component.html',
  styleUrls: ['./company-devices-item.component.scss']
})
export class CompanyDevicesItemComponent implements OnInit, OnDestroy {
  @Input() device: DeviceCompany;
  timer: any = null;
  constructor(private modalService: NgbModal,
    private devicesService: DevicesService,
    private usersStateService: UsersStateService,
    private permissionsService: PermissionsService,
    public cd: ChangeDetectorRef,) { }


  ngOnInit() {
    this.timer = setInterval(() => {

      this.device.remoteSessions.forEach(item => {
        item.agentConnectedAt += 1000;
      });
      if (this.device.online) this.device.timing.online += 1000;
      if (!this.device.online) this.device.timing.offline += 1000;
      if (this.device.timing.idle) this.device.timing.idle += 1000;
      this.cd.detectChanges();
    }, 1000);
  }
  remoteAccess(connectionType) {
    console.log("this.device", this.device);
    const modalRef = this.modalService.open(CompanyDevicesRemoteAccessComponent, { windowClass: 'quote-send-modal' });
    modalRef.componentInstance.connectionType = connectionType;
    modalRef.componentInstance.device = this.device;
    modalRef.componentInstance.companyId = this.device.companyId;
  }
  public getUserName(userId) {
    let user = this.usersStateService.getAllUsers().find(item => item.id === userId);
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  setIcon(iconName) {
    this.devicesService.setIcon(this.device.getDataForEditIcon(iconName)).subscribe(data => {

    })
  }
  isLabel() {
    if (this.device.label && this.device.hostName) return this.device.label !== this.device.hostName;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  returnTimeFormat(time) {
    let hours = 0;
    let minutes = 0;
    hours = Math.floor(time / 3600000);
    minutes = Math.floor((time - (hours * 3600000)) / 60000);
    return {
      hours: hours,
      minutes: minutes,
    }
  }
  returnTimeFormatUpTime(time) {
    let days = 0;
    let hours = 0;
    let minutes = 0;
    days = Math.floor(time / 86400000);
    hours = Math.floor((time - (days * 86400000)) / 3600000);
    minutes = Math.floor((time - (days * 86400000) - (hours * 3600000)) / 60000);
    return {
      days: days,
      hours: hours,
      minutes: minutes,
    }
  }
  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
