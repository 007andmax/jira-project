import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subscription } from 'rxjs';
import { REBOOT_DEVICE, REMOVE_DEVICES, SHUTDOWN_DEVICE } from 'src/ng2/app/const/confirm';
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { PermissionsService } from 'src/ng2/app/services/permissions/permissions.service';
import { DevicesStateService } from 'src/ng2/app/states/devices/devices-state.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { DeviceCompanyAsideParams } from '../class/device-company-aside-params';
import { DeviceExtended } from '../class/device-extended';
import { DeviceExtendedReport } from '../class/device-extended-report';
import { CompanyDevicesRemoteAccessComponent } from '../company-devices-remote-access/company-devices-remote-access.component';


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
  showRemoteAccess: boolean = false;
  showPreloader: boolean = true;
  sub: Subscription = new Subscription();
  constructor(private devicesStateService: DevicesStateService,
    private modalService: NgbModal,
    private permissionsService: PermissionsService,
    private confirmStateService: ConfirmStateService,
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
            if (item[this.companyId].length > 0) this.devices.push(new DeviceExtended(item[this.companyId][0], this.companyId));
          })
          console.log("this.devices", this.devices);
          this.currentDevice = this.devices[0];
          this.showPreloader = false;
        });
    })
    this.sub.add(getOnOpenAside);
  }
  remoteAccess(connectionType) {

    const modalRef = this.modalService.open(CompanyDevicesRemoteAccessComponent, { windowClass: 'device-send-modal' });
    modalRef.componentInstance.connectionType = connectionType;
    modalRef.componentInstance.device = this.currentDevice;
    modalRef.componentInstance.companyId = this.currentDevice.companyId;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  gotiDetailDevice() {
    localStorage.setItem('agentId', this.currentDevice.agentId);
    localStorage.setItem('type', this.currentDevice.type);
    var url = '/#/ng2/device/dashboard';
    window.open(url, '_blank');
  };
  turnOff(action) {
    if (action === 'reboot') {
      this.confirmStateService.setConfirmAction(REBOOT_DEVICE);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
      modalRef.componentInstance.message = `Are you sure you want to reboot chosen device?`;
      this.devicesStateService.setDevicesForReboot([this.currentDevice]);
    }
    if (action === 'shutdown') {
      this.confirmStateService.setConfirmAction(SHUTDOWN_DEVICE);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
      modalRef.componentInstance.message = `Are you sure you want to shutdown chosen device?`;
      this.devicesStateService.setDevicesForShutDown([this.currentDevice]);
    }
  }
  setMasterAgent() {
    this.devicesService.markDeviceAsMaster(this.currentDevice.companyId, this.currentDevice.agentId).subscribe(data => {

    })
  }
  isLabel() {
    if (this.currentDevice.label && this.currentDevice.hostName) return this.currentDevice.label !== this.currentDevice.hostName;
  }
  removeCurrentDevice() {
    this.confirmStateService.setConfirmAction(REMOVE_DEVICES);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to remove 1 device?`;
    this.devicesStateService.setDevicesForRemove([this.currentDevice]);
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
