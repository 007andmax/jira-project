import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceCompany } from '../class/device-company';
import { CompanyDevicesRemoteAccessComponent } from '../company-devices-remote-access/company-devices-remote-access.component';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { REBOOT_DEVICE, REMOVE_DEVICES, SHUTDOWN_DEVICE } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { DeviceCompanyAsideParams } from '../class/device-company-aside-params';
import { CompanyDevicesEditLabelComponent } from '../company-devices-edit-label/company-devices-edit-label.component';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { CompanyDevicesTagsComponent } from '../company-devices-tags/company-devices-tags.component';
import { DeviceTag } from '../../setting/manage-tags/manage-tags-devices/class/device-tag';
import { DeviceTagsService } from 'src/app/services/device-tags/device-tags.service';
import { DeviceTagsStateService } from 'src/app/states/device-tags/device-tags-state.service';
import { DeviceTagsRealTimeService } from 'src/app/states/device-tags/device-tags-real-time.service';
import { DevicesRealTimeService } from 'src/app/states/devices/devices-real-time.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-devices-item',
  templateUrl: './company-devices-item.component.html',
  styleUrls: ['./company-devices-item.component.scss']
})
export class CompanyDevicesItemComponent implements OnInit, OnDestroy {
  @ViewChild('editLabel', { static: true }) editLabel: CompanyDevicesEditLabelComponent;
  @ViewChild('deviceTags', { static: true }) deviceTags: CompanyDevicesTagsComponent;
  @Input() device: DeviceCompany;
  @Input() companyId: string;
  timer: any = null;
  sub: Subscription = new Subscription();
  @Output() onChangeSelect = new EventEmitter();
  constructor(private modalService: NgbModal,
    private devicesService: DevicesService,
    public usersStateService: UsersStateService,
    private permissionsService: PermissionsService,
    private devicesStateService: DevicesStateService,
    private confirmStateService: ConfirmStateService,
    private companiesStateService: CompaniesStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private deviceTagsService: DeviceTagsService,
    private deviceTagsRealTimeService: DeviceTagsRealTimeService,
    private devicesRealTimeService: DevicesRealTimeService,
    private deviceTagsStateService: DeviceTagsStateService,
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
    if (this.device.tags) this.deviceTags.setSelectedTag(JSON.parse(JSON.stringify(this.device.tags)).map(item => new DeviceTag(item)));
    let changeTagsrray = this.devicesRealTimeService.changeDevicesArray.subscribe(newChange => {
      if (newChange.action === 'BIND_DEVICE_TO_TAG') {
        let index = newChange.data.devices.findIndex(item => item.deviceId == this.device.agentId || item.deviceId == this.device.id);
        if (index > -1) {
          let tags = this.deviceTagsStateService.getTags().filter(item => newChange.data.devices[index].tags.some(tag => tag == item.id));
          this.device.setTags([...this.device.tags, ...tags]);
          this.deviceTags.setSelectedTag(JSON.parse(JSON.stringify(this.device.tags)).map(item => new DeviceTag(item)));
        }
      }
      if (newChange.action === 'UNBIND_DEVICE_FROM_TAG') {
        let index = newChange.data.devices.findIndex(item => item.deviceId == this.device.agentId || item.deviceId == this.device.id);
        if (index > -1) {
          newChange.data.devices[index].tags.forEach(item => {
            let index = this.device.tags.findIndex(tag => tag.id == item);
            if (index > -1) this.device.tags.splice(index, 1);
          })
          this.deviceTags.setSelectedTag(JSON.parse(JSON.stringify(this.device.tags)).map(item => new DeviceTag(item)));
        }
      }
    })
    this.sub.add(changeTagsrray);
  }
  getTextForTooltip(data) {
    if (data == "workstation") return "Workstation";
    if (data == "router") return "Router";
    if (data == "printer") return "Printer";
    if (data == "switch") return "Switch";
    if (data == "server") return "Server";
    if (data == "tablet") return "Tablet";
    if (data == "network device") return "Network device";
    if (data == "phone") return "Phone";
    if (data == "generic device") return "Generic device";
  }
  public checkDefaultName(name) {
    if (name == "workstation" || name == "router"
      || name == "printer" || name == "switch" || name == "server"
      || name == "tablet" || name == "network device" || name == "phone" || name == "generic device") return true;
    return false;
  }
  openAside(type) {
    if (this.device.agentId || this.device.isCustom) this.devicesStateService.setOnOpenAside(new DeviceCompanyAsideParams(type, [this.device]));
  }
  onChangeTags(data) {
    let forRemove = [];
    let forAdd = [];
    if (data.length > this.device.tags.length) {
      data.forEach(item => {
        let find = this.device.tags.some(dataItem => dataItem.id == item.id);
        if (!find) forAdd.push(item);
      })
    } else {
      this.device.tags.forEach(item => {
        let find = data.some(dataItem => dataItem.id == item.id);
        if (!find) forRemove.push(item);
      })
    }
    if (forRemove.length > 0) {
      this.deviceTagsService.unLinkDevice(this.device.getDataForRequestTags(forRemove.map(item => item.id))).subscribe(res => {

      })
    } else {
      this.deviceTagsService.linkDevice(this.device.getDataForRequestTags(forAdd.map(item => item.id))).subscribe(res => {

      })
    }
  }
  onSelectDevice() {
    this.onChangeSelect.emit(null);
  }
  gotiDetailDevice() {
    localStorage.setItem('company_id', this.companyId);
    localStorage.setItem('agentId', this.device.agentId);
    localStorage.setItem('type', this.device.type);
    var url = `/#/${this.companiesStateService.getCurrentCompany().techDomain}/device-old/dashboard/${this.device.type}/${this.device.agentId}`;
    window.open(url, '_blank');
  };
  remoteAccess(connectionType) {
    const modalRef = this.modalService.open(CompanyDevicesRemoteAccessComponent, { windowClass: 'device-send-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.connectionType = connectionType;
    modalRef.componentInstance.device = this.device;
    modalRef.componentInstance.companyId = this.device.companyId;
    modalRef.componentInstance.action = 'CONNECT_DEVICE';
  }
  public getUserName(userId) {
    let user = this.usersStateService.getAllUsers().find(item => item.id === userId);
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  setIcon(iconName) {
    if (this.device.isCustom) {
      this.device.setType(iconName.toLowerCase());
      this.devicesService.editDevice(this.device.getRequestForEdit()).subscribe(data => {

      })
      return;
    }
    this.devicesService.editAgentInfo(this.device.getDataForEditIcon(iconName)).subscribe(data => {
      this.device.setIconName(iconName);
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
  getWindows() {
    return `${this.device.system.caption.replace('Microsoft', '')} ${this.device.system.releaseId}`
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    clearInterval(this.timer);
  }
}
