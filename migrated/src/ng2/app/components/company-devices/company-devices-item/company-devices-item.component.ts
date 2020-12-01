import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Device } from '../class/device';
import { DeviceCompany } from '../class/device-company';
import { CompanyDevicesRemoteAccessComponent } from '../company-devices-remote-access/company-devices-remote-access.component';
import * as moment from "moment";
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { PermissionsService } from 'src/ng2/app/services/permissions/permissions.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { DevicesStateService } from 'src/ng2/app/states/devices/devices-state.service';
import { REBOOT_DEVICE, REMOVE_DEVICES, SHUTDOWN_DEVICE } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { DeviceCompanyAsideParams } from '../class/device-company-aside-params';

@Component({
  selector: 'app-company-devices-item',
  templateUrl: './company-devices-item.component.html',
  styleUrls: ['./company-devices-item.component.scss']
})
export class CompanyDevicesItemComponent implements OnInit, OnDestroy {
  @Input() device: DeviceCompany;
  timer: any = null;
  @Output() onChangeSelect = new EventEmitter();

  constructor(private modalService: NgbModal,
    private devicesService: DevicesService,
    private usersStateService: UsersStateService,
    private permissionsService: PermissionsService,
    private devicesStateService: DevicesStateService,
    private confirmStateService: ConfirmStateService,
    public cd: ChangeDetectorRef,) { }


  ngOnInit() {
    this.timer = setInterval(() => {

      this.device.remoteSessions.forEach(item => {
        item.agentConnectedAt += 1000;
      });
      if (this.device.online) this.device.timing.online += 1000;
      if (!this.device.online) this.device.timing.offline += 1000;
      if (this.device.timing.idle) this.device.timing.idle += 1000;
      if (this.device.online) this.device.timing.uptimeForOrdering += 1000;
      this.cd.detectChanges();
    }, 1000);

  }
  openAside(type) {
    if (this.device.agentId) this.devicesStateService.setOnOpenAside(new DeviceCompanyAsideParams(type, [this.device.agentId]));
  }
  onSelectDevice() {
    this.onChangeSelect.emit(null);
  }
  gotiDetailDevice() {
    if (this.device.agentId) {
      localStorage.setItem('agentId', this.device.agentId);
      localStorage.setItem('type', this.device.type);
      var url = '/#/ng2/device/dashboard';
      window.open(url, '_blank');
    }

  };
  remoteAccess(connectionType) {
    console.log("this.device", this.device);
    const modalRef = this.modalService.open(CompanyDevicesRemoteAccessComponent, { windowClass: 'device-send-modal' });
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
      this.device.setIconName(iconName);
      this.devicesStateService.updateLabelIcon(this.device);
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
  setMasterAgent() {
    this.devicesService.markDeviceAsMaster(this.device.companyId, this.device.agentId).subscribe(data => {

    })
  }
  onChangeName(data) {
    this.device.setLabel(data);
    this.devicesStateService.updateLabelIcon(this.device);
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
  turnOff(action) {
    if (action === 'reboot') {
      this.confirmStateService.setConfirmAction(REBOOT_DEVICE);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
      modalRef.componentInstance.message = `Are you sure you want to reboot chosen device?`;
      this.devicesStateService.setDevicesForReboot([this.device]);
    }
    if (action === 'shutdown') {
      this.confirmStateService.setConfirmAction(SHUTDOWN_DEVICE);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
      modalRef.componentInstance.message = `Are you sure you want to shutdown chosen device?`;
      this.devicesStateService.setDevicesForShutDown([this.device]);
    }
  }
  removeDevice() {
    this.confirmStateService.setConfirmAction(REMOVE_DEVICES);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to remove 1 device?`;
    this.devicesStateService.setDevicesForRemove([this.device]);
  }
  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
