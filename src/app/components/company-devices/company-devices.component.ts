import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subscription } from 'rxjs';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { REBOOT_DEVICE, REMOVE_DEVICES, SHUTDOWN_DEVICE } from '../../const/confirm';
import { DevicesService } from '../../services/devices/devices.service';
import { DeviceStatus } from '../../states/devices/class/device-status';
import { DevicesRealTimeService } from '../../states/devices/devices-real-time.service';
import { DevicesStateService } from '../../states/devices/devices-state.service';
import { LeftPanelStateService } from '../../states/left-panel/left-panel-state.service';
import { ConfirmComponent } from '../shared/confirm/confirm.component';
import { ConfirmStateService } from '../shared/confirm/services/confirm-state.service';
import { DeviceCompany } from './class/device-company';
import { CompanyDeviceFilter } from './class/device-company-filter';
import { DeviceRemoteSessions } from './class/device-remote-sessions';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { DeviceTagsStateService } from 'src/app/states/device-tags/device-tags-state.service';
import { fadeInAnimation } from 'src/app/animations';
import { CompanyDevicesHeaderComponent } from './company-devices-header/company-devices-header.component';

@Component({
  selector: 'app-company-devices',
  templateUrl: './company-devices.component.html',
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  styleUrls: ['./company-devices.component.scss']
})
export class CompanyDevicesComponent implements OnInit, OnDestroy {
  devices: Array<DeviceCompany> = [];
  selectAllDevices: boolean = false;
  isOfflineDeviceSelected: boolean = false;
  filter: CompanyDeviceFilter = new CompanyDeviceFilter();
  showPreloader: boolean = true;
  companyId: string;
  toggleFilter: boolean = false;
  sub: Subscription = new Subscription();
  @ViewChild('header', { static: true }) header: CompanyDevicesHeaderComponent;
  constructor(private devicesStateService: DevicesStateService,
    private devicesService: DevicesService,
    private confirmStateService: ConfirmStateService,
    private companiesStateService: CompaniesStateService,
    private modalService: NgbModal,
    public cd: ChangeDetectorRef,
    public activateRoute: ActivatedRoute,
    private leftPanelStateService: LeftPanelStateService,
    private customerPortalStateService: CustomerPortalStateService,
    private websocketService: WebsocketService,
    private deviceTagsStateService: DeviceTagsStateService,
    private devicesRealTimeService: DevicesRealTimeService) { }

  ngOnInit() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.leftPanelStateService.changeStateWithoutNavigate('company-devices');
    if (this.deviceTagsStateService.getTags().length == 0 && !this.customerPortalStateService.isCustomerPortal) this.deviceTagsStateService.onInitGetTags();
    let id = this.activateRoute.snapshot.params['id'];
    if (id) {
      this.companyId = id;
      this.getDevice(id);
      this.companiesStateService.setCompanyRoutingId(id);
    }
    let subscription = this.activateRoute.params.subscribe(params => {

      if (params['id'] && id != params['id']) {
        id = params['id'];
        this.companiesStateService.setCompanyRoutingId(id);
        this.companyId = id;
        this.getDevice(id);
      }

    });
    this.sub.add(subscription);
    let geLefttFilter = this.devicesStateService.onFilter.subscribe((data) => {
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.filter.setFilter(JSON.parse(JSON.stringify(data)));
      this.cd.detectChanges();
    });
    this.sub.add(geLefttFilter);
    let changeDevicesArray = this.devicesRealTimeService.changeDevicesArray.subscribe(newChange => {
      if (newChange.action === 'CUSTOM_DEVICE_SAVED') {
        this.devices.push(new DeviceCompany({ ...newChange.data, isCustom: true, id: newChange.data.deviceId }, newChange.data.companyId));
      }
      if (newChange.action === 'CUSTOM_DEVICE_REMOVED') {
        let index = this.devices.findIndex(item => item.id == newChange.data);
        if (index > -1) this.devices.splice(index, 1);
      }
      if (newChange.action === 'CUSTOM_DEVICE_EDITED') {
        if (newChange.data.companyId == this.companyId) {
          let index = this.devices.findIndex(item => item.id == newChange.data.deviceId);
          if (index > -1) this.devices[index].update(newChange.data);
        }
      }
      this.filter.onCurrentFilter(this.devices);
      this.cd.detectChanges();
    })
    this.sub.add(changeDevicesArray);
    let onDeviceUninstalled = this.devicesStateService.onChangeDevice.subscribe(newChange => {
      if (id == newChange.data.clientCompanyId) {
        this.devicesStateService.changeDevice(this.devices, newChange);
        this.filter.onCurrentFilter(this.devices);
        this.cd.detectChanges();
        this.showPreloader = false;
      }
    })
    this.sub.add(onDeviceUninstalled);
    let onInitWebSocket = this.devicesStateService.onInitWebSocket.subscribe(data => {
      if (this.companyId && this.devices.filter(item => !item.isCustom).length > 0) this.sendDeviceStatusRequest(this.companyId, this.devices.filter(item => item.agentId).map(item => item.agentId));
    })
    this.sub.add(onInitWebSocket);
    let getOnClosedRemoveConnecion = this.devicesStateService.getOnClosedRemoveConnecion().subscribe(data => {
      this.devices.forEach(item => {
        let findIndex = item.remoteSessions.findIndex(remoteSession => remoteSession.id === data);
        if (findIndex > -1) item.remoteSessions.splice(findIndex, 1);
      })
      this.cd.detectChanges();
    })
    this.sub.add(getOnClosedRemoveConnecion);
    let oneTimeConnectionArray = this.devicesRealTimeService.oneTimeConnectionArray.subscribe(newChange => {
      if (newChange.action === 'ONE_TIME_CONNECTION_OPEN') {
        for (var i = 0; i < this.devices.length; i++) {
          if (this.devices[i].id === newChange.data.deviceId) {
            this.devices[i].remoteSessions.push(new DeviceRemoteSessions({
              startedAt: newChange.data.startedAt,
              id: newChange.data.sessionId,
              userId: newChange.data.performer.id,
            }))
          }
        }
      }
      this.cd.detectChanges();
    })
    this.sub.add(oneTimeConnectionArray);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REBOOT_DEVICE) {
          this.devicesService.sendPowerAction(this.companyId, this.devicesStateService.getDevicesForReboot().map(item => item.agentId), 'reboot').subscribe(data => {
          });
        }
        if (this.confirmStateService.getConfirmAction() === SHUTDOWN_DEVICE) {
          this.devicesService.sendPowerAction(this.companyId, this.devicesStateService.getDevicesForShutDown().map(item => item.agentId), 'shutdown').subscribe(data => {
          });
        }
        if (this.confirmStateService.getConfirmAction() === REMOVE_DEVICES) {
          if (this.devicesStateService.getDevicesForRemove().filter(item => item.isCustom).length > 0) this.removeCustomDevice(this.devicesStateService.getDevicesForRemove().filter(item => item.isCustom).map(item => item.id));
          if (this.devicesStateService.getDevicesForRemove().filter(item => !item.isCustom).length > 0) this.devicesService.sendUninstallAgentRequest(this.companyId, this.devicesStateService.getDevicesForRemove().filter(item => !item.isCustom).map(item => item.id)).subscribe(data => {
            this.onChangeSelect();
          });
        }
      }
    })
    this.sub.add(getConfirm);
    let getOnUpdateAgentActivityStatus = this.devicesStateService.getOnUpdateAgentActivityStatus().subscribe(newChange => {
      var isCurrentCompany = this.devices.find(item => item.agentId === newChange.data.agentId);
      if (newChange.data && newChange.data.statuses && newChange.data.statuses.hasOwnProperty('Idle')) {
        if (isCurrentCompany) {
          for (var i = 0; i < this.devices.length; i++) {
            if (this.devices[i].agentId === newChange.data.agentId) {
              if (newChange.data.statuses.Idle) {
                this.devices[i].timing.idle = this.devicesStateService.getMillisecondsFromTimeString(newChange.data.statuses.Idle);
              } else {
                this.devices[i].timing.idle = null;
              }
              break;
            }
          }
        }
      } else if (newChange.data && newChange.data.statuses && newChange.data.statuses.hasOwnProperty('NoRestart') && newChange.data.statuses.hasOwnProperty('Online')) {
        if (isCurrentCompany) {
          for (var i = 0; i < this.devices.length; i++) {
            if (this.devices[i].agentId === newChange.data.agentId) {
              this.devices[i].timing.noRestart = this.devicesStateService.getMillisecondsFromTimeString(newChange.data.statuses.NoRestart);
              this.devices[i].timing.online = this.devicesStateService.getMillisecondsFromTimeString(newChange.data.statuses.Online);
              this.devices[i].timing.uptimeForOrdering = this.devicesStateService.getMillisecondsFromTimeString(newChange.data.statuses.Online);
              break;
            }
          }
        }
      }
    })
    this.sub.add(getOnUpdateAgentActivityStatus);
    let getOnResetDeviceTiming = this.devicesStateService.getOnResetDeviceTiming().subscribe(data => {
      let findIndex = this.devices.findIndex(item => item.id === data.id);
      if (findIndex > -1) {
        this.devices[findIndex].timing.idle = null;
        if (data.online) {
          this.devices[findIndex].timing.online = 0;
        } else {
          this.devices[findIndex].timing.offline = 0;
          this.devices[findIndex].offlineAt = new Date().toUTCString();
          this.devices[findIndex].timing.uptimeForOrdering = 0;
        }
      }
    })
    this.sub.add(getOnResetDeviceTiming);
    let getOnSendDeviceStatus = this.devicesStateService.getOnSendDeviceStatus().subscribe((data: DeviceStatus) => {
      if (this.companyId === data.companyId && this.devicesStateService.getIsInitWebSocket() && this.devices.filter(item => !item.isCustom).length > 0) this.devicesService.sendDeviceStatusRequest(data.companyId, data.agentIds, data.actions).subscribe(res => {
      })
    })
    this.sub.add(getOnSendDeviceStatus);
  }
  removeCustomDevice(ids) {
    forkJoin(
      [...ids.map(item => this.devicesService.deleteCustomDevice(item))]
    )
      .subscribe(res => {

      });
  }
  onCloseFilters() {
    this.header.setToggleFilter(false);
  }
  getDevice(id) {
    this.devicesService.getCompanyDevices(id).subscribe((data: any) => {
      if (data && Object.keys(data).length > 0) {
        this.devices = data[id].map(item => new DeviceCompany(item, this.companyId));
        this.filter.onFilterName(this.devices);
      }
      this.showPreloader = false;
      if (this.devices.filter(item => !item.isCustom).length > 0 && this.devicesStateService.getIsInitWebSocket()) this.sendDeviceStatusRequest(this.companyId, this.devices.filter(item => item.agentId).map(item => item.agentId));
    });
  }
  public onFilter(field) {
    this.filter.onFilter(field, this.devices)
  }
  sendDeviceStatusRequest(companyId, ids) {
    this.devicesService.sendDeviceStatusRequest(companyId, ids, ["idle", "norestart", "online"]).subscribe(data => {
    })
  }
  onRemoveAgents() {
    let len = this.devices.filter(item => item.selected).length;
    this.confirmStateService.setConfirmAction(REMOVE_DEVICES);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to remove ${(len === 1) ? "1 device" : len + " devices"}?`;
    this.devicesStateService.setDevicesForRemove(this.devices.filter(item => item.selected));
  }
  onTurnOff(action) {
    if (action === 'reboot') {
      this.confirmStateService.setConfirmAction(REBOOT_DEVICE);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
      modalRef.componentInstance.message = `Are you sure you want to reboot chosen device?`;
      this.devicesStateService.setDevicesForReboot(this.devices.filter(item => item.selected));
    }
    if (action === 'shutdown') {
      this.confirmStateService.setConfirmAction(SHUTDOWN_DEVICE);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
      modalRef.componentInstance.message = `Are you sure you want to shutdown chosen device?`;
      this.devicesStateService.setDevicesForShutDown(this.devices.filter(item => item.selected));
    }
  }
  onChangeSelect() {
    let find = this.devices.find(item => !item.selected);
    this.selectAllDevices = (find) ? false : true;
    this.isOfflineDeviceSelected = (this.devices.find(item => item.selected && !item.isCustom && !item.online)) ? true : false;
  }
  toogleDevices() {
    this.devices.forEach(item => {
      item.selected = (this.selectAllDevices) ? true : false;
    })
    this.isOfflineDeviceSelected = (this.devices.find(item => item.selected && !item.isCustom && !item.online)) ? true : false;
  }
  isLabel(device) {
    if (device.label && device.hostName) return device.label !== device.hostName;
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    if (this.customerPortalStateService.isCustomerPortal && this.devicesRealTimeService.subsribeToDevicesCustomerUsers) this.devicesRealTimeService.subsribeToDevicesCustomerUsers.unsubscribe();
    this.companiesStateService.setCompanyRoutingId(null);
    this.sub.unsubscribe();
  }
}
