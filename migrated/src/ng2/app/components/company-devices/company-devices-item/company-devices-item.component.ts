import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class CompanyDevicesItemComponent implements OnInit {
  @Input() device: DeviceCompany;

  constructor(private modalService: NgbModal,
    private devicesService: DevicesService,
    private usersStateService: UsersStateService,
    private permissionsService: PermissionsService,) { }

  ngOnInit() {
  }
  openModalRemoteAccess() {
    const modalRef = this.modalService.open(CompanyDevicesRemoteAccessComponent, { windowClass: 'quote-send-modal' });
    /*let data = JSON.parse(JSON.stringify(quote.getDataForCreate(true)));
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.action = QUOTE_MODAL_ACTION_ADD;*/
    console.log(this.returnTimeFormatForPage(this.device.timing.offline));
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
  returnTimeFormatConnected(time) {

    console.log("time", time);
    var days = 0;
    var hours = 0;
    var minutes = 0;
    var seconds = 0;
    if (time > 86400000) {
      days = Math.floor(time / 86400000);
      hours = Math.floor((time - (days * 86400000)) / 3600000);
      minutes = Math.floor((time - (days * 86400000) - (hours * 3600000)) / 60000);
      seconds = Math.floor((time - (days * 86400000) - (hours * 3600000) - (minutes * 60000)) / 1000);
    } else if (time < 86400000 && time > 3600000) {
      days = 0;
      hours = Math.floor((time - (days * 86400000)) / 3600000);
      minutes = Math.floor((time - (days * 86400000) - (hours * 3600000)) / 60000);
      seconds = Math.floor((time - (days * 86400000) - (hours * 3600000) - (minutes * 60000)) / 1000);
    } else if (time < 3600000 && time > 60000) {
      days = 0;
      hours = 0;
      minutes = Math.floor((time - (days * 86400000) - (hours * 3600000)) / 60000);
      seconds = Math.floor((time - (days * 86400000) - (hours * 3600000) - (minutes * 60000)) / 1000);
    } else {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = Math.floor((time - (days * 86400000) - (hours * 3600000) - (minutes * 60000)) / 1000);
    }

    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    }
  }
  returnTimeFormatForPage(time) {
    return {
      days: (time == 0) ? 0 : moment(time).date(),
      hours: (time == 0) ? 0 : moment(time).hour(),
      minutes: (time == 0) ? 0 : moment(time).minute(),
      seconds: (time == 0) ? 0 : moment(time).second()
    }
  }
}
