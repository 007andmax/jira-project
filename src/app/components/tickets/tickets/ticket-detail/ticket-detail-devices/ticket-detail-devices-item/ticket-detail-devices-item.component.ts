import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceCompany } from 'src/app/components/company-devices/class/device-company';
import { CompanyDevicesRemoteAccessComponent } from 'src/app/components/company-devices/company-devices-remote-access/company-devices-remote-access.component';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { REBOOT_DEVICE, REMOVE_DEVICES, SHUTDOWN_DEVICE } from 'src/app/const/confirm';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';

@Component({
  selector: 'ticket-detail-devices-item',
  templateUrl: './ticket-detail-devices-item.component.html',
  styleUrls: ['./ticket-detail-devices-item.component.scss']
})
export class TicketDetailDevicesItemComponent implements OnInit {
  @Input() device: DeviceCompany;
  constructor(private modalService: NgbModal,
    private confirmStateService: ConfirmStateService,
    private devicesStateService: DevicesStateService,) { }

  ngOnInit() {
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
  getLabelForEdit() {
    if (this.device.isCustom) return this.device.name;
    if (this.device.label) return this.device.label;
    return this.device.hostName || this.device.ip;
  }
  remoteAccess(connectionType) {
    const modalRef = this.modalService.open(CompanyDevicesRemoteAccessComponent, { windowClass: 'device-send-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.connectionType = connectionType;
    modalRef.componentInstance.device = this.device;
    modalRef.componentInstance.companyId = this.device.companyId;
    modalRef.componentInstance.action = 'CONNECT_DEVICE';
  }
  turnOff(action) {
    if (action === 'reboot') {
      this.confirmStateService.setConfirmAction(REBOOT_DEVICE);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
      modalRef.componentInstance.message = `Are you sure you want to reboot chosen device?`;
      this.devicesStateService.setDevicesForReboot([this.device]);
    }
    if (action === 'shutdown') {
      this.confirmStateService.setConfirmAction(SHUTDOWN_DEVICE);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
      modalRef.componentInstance.message = `Are you sure you want to shutdown chosen device?`;
      this.devicesStateService.setDevicesForShutDown([this.device]);
    }
  }
  removeDevice() {
    this.confirmStateService.setConfirmAction(REMOVE_DEVICES);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to remove 1 device?`;
    this.devicesStateService.setDevicesForRemove([this.device]);
  }
  getTimeStatus(data) {
    let { days, hours, minutes } = this.returnTimeFormatUpTime(data);
    return `(${days > 0 ? days + ' day ' : ''}${hours > 0 ? hours + ' hrs ' : ''}${minutes > 0 ? minutes + ' min' : ''}${minutes < 1 && hours < 1 && days < 1 ? ' 0 min' : ''})`
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
}
