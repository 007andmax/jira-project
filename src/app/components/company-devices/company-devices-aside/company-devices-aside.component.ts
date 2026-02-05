import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subscription } from 'rxjs';
import { REBOOT_DEVICE, REMOVE_DEVICES, SHUTDOWN_DEVICE } from 'src/app/const/confirm';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { DeviceCompanyAsideParams } from '../class/device-company-aside-params';
import { DeviceExtended } from '../class/device-extended';
import { CompanyDevicesRemoteAccessComponent } from '../company-devices-remote-access/company-devices-remote-access.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { DeviceCompany } from '../class/device-company';
import { CompanyDevicesAsideSystemComponent } from './company-devices-aside-system/company-devices-aside-system.component';
import { CompanyDevicesAsideNetworkTabComponent } from './company-devices-aside-network-tab/company-devices-aside-network-tab.component';

@Component({
  selector: 'app-company-devices-aside',
  templateUrl: './company-devices-aside.component.html',
  styleUrls: ['./company-devices-aside.component.scss']
})
export class CompanyDevicesAsideComponent implements OnInit, OnDestroy {
  @Input() companyId: string;
  @Input() devicesCompany: Array<DeviceCompany> = [];
  @ViewChild("system", { static: false }) system: CompanyDevicesAsideSystemComponent;
  @ViewChild("network", { static: false }) network: CompanyDevicesAsideNetworkTabComponent;
  tab: string = "SYSTEM";
  devices: Array<DeviceExtended> = [];
  customDevices: Array<DeviceCompany> = [];
  currentDevice: DeviceExtended;
  customDevice: DeviceCompany;
  open: boolean = false;
  showRemoteAccess: boolean = false;
  showPreloader: boolean = true;
  sub: Subscription = new Subscription();
  constructor(private devicesStateService: DevicesStateService,
    private modalService: NgbModal,
    private permissionsService: PermissionsService,
    private confirmStateService: ConfirmStateService,
    private companiesStateService: CompaniesStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public usersStateService: UsersStateService,
    public cd: ChangeDetectorRef,
    private devicesService: DevicesService) { }

  ngOnInit() {
    let getOnOpenAside = this.devicesStateService.getOnOpenAside().subscribe((data: DeviceCompanyAsideParams) => {
      if (this.open) {
        let find = data.devices[0].isCustom ? this.devicesCompany.find(item => item.deviceId === data.devices[0].deviceId) : this.devices.find(item => item.agentId === data.devices[0].agentId);
        if (find) {
          if (!find.isCustom) {
            this.currentDevice = new DeviceExtended(find, this.companyId);
            this.customDevice = null;
          } else {
            this.customDevice = new DeviceCompany(find, this.companyId);
            this.currentDevice = null;
          }
          return;
        }
      }
      this.open = true;
      this.customDevices = data.devices.filter(item => item.isCustom);
      let list = data.devices.filter(item => !item.isCustom);
      if (list.length == 0) {
        if (!this.currentDevice) {
          this.customDevice = data.devices[0];
        } else {
          this.customDevice = this.customDevices[this.customDevices.length - 1];
        }
        this.tab = data.type;
        this.showPreloader = false;
      }
      if (list.length > 0) forkJoin(
        [...list.map(item => item.agentId).map(item => this.devicesService.getDeviceExtended(this.companyId, item))]
      )
        .subscribe(res => {
          res.forEach(item => {
            if (item[this.companyId].length > 0) this.devices.push(new DeviceExtended(item[this.companyId][0], this.companyId));
          })
          if (!this.currentDevice) {
            this.currentDevice = this.devices[0];
          } else {
            this.currentDevice = this.devices[this.devices.length - 1];
          }
          this.tab = data.type;
          this.showPreloader = false;
        });
    })
    this.sub.add(getOnOpenAside);
  }
  public setCurrentDevice(data) {
    this.customDevice = null;
    this.currentDevice = data;
    this.cd.detectChanges();
  }
  public setCustomDevice(data) {
    this.tab = 'SYSTEM';
    this.customDevice = data;
    this.currentDevice = null;
    if (this.system) this.system.refresh(this.customDevice);
    if (this.network) this.network.refresh(this.customDevice);
    this.cd.detectChanges();
  }
  public getFieldForCheckIcon() {
    if (this.currentDevice) return this.currentDevice.iconName;
    if (this.customDevice) return this.customDevice.type;
  }
  public getTextForDisplayName() {
    if (this.currentDevice) return !this.isLabel() ? this.currentDevice.hostName || this.currentDevice.ip : this.currentDevice.label || this.currentDevice.hostName || this.currentDevice.ip;
    if (this.customDevice) return this.customDevice.name;
  }
  remoteAccess(connectionType) {
    const modalRef = this.modalService.open(CompanyDevicesRemoteAccessComponent, { windowClass: 'device-send-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.connectionType = connectionType;
    modalRef.componentInstance.device = this.currentDevice;
    modalRef.componentInstance.companyId = this.currentDevice.companyId;
    modalRef.componentInstance.action = 'CONNECT_DEVICE';
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  gotiDetailDevice() {
    localStorage.setItem('company_id', this.companyId);
    localStorage.setItem('agentId', this.currentDevice.agentId);
    localStorage.setItem('type', this.currentDevice.type);

    var url = `/#/${this.companiesStateService.getCurrentCompany().techDomain}/device-old/dashboard/${this.currentDevice.type}/${this.currentDevice.agentId}`;
    window.open(url, '_blank');
  };
  turnOff(action) {
    if (action === 'reboot') {
      this.confirmStateService.setConfirmAction(REBOOT_DEVICE);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
      modalRef.componentInstance.header = `Reboot Device`;
      modalRef.componentInstance.message = `Are you sure you want to reboot chosen device?`;
      this.devicesStateService.setDevicesForReboot([this.currentDevice]);
    }
    if (action === 'shutdown') {
      this.confirmStateService.setConfirmAction(SHUTDOWN_DEVICE);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
      modalRef.componentInstance.header = `Shutdown Device`;
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
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Device`;
    modalRef.componentInstance.message = `Are you sure you want to remove 1 device?`;
    this.devicesStateService.setDevicesForRemove([this.currentDevice || this.customDevice]);
  }
  removeDevice() {
    let index = this.devices.findIndex(item => item.deviceId === this.currentDevice.deviceId);
    this.devices.splice(index, 1);
    this.currentDevice = this.devices[0];
  }
  close() {
    this.open = false;
    this.showPreloader = true;
    this.currentDevice = null;
    this.customDevice = null;
    this.devices = [];
    this.tab = "SYSTEM";
    this.devicesStateService.setCloseAside();
  }
  public trackById(index, item) {
    return item.deviceId;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
