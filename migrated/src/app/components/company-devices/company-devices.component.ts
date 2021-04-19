import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
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

@Component({
  selector: 'app-company-devices',
  templateUrl: './company-devices.component.html',
  styleUrls: ['./company-devices.component.scss']
})
export class CompanyDevicesComponent implements OnInit, OnDestroy {
  devices: Array<DeviceCompany> = [];
  selectAllDevices: boolean = false;
  isOfflineDeviceSelected: boolean = false;
  filter: CompanyDeviceFilter = new CompanyDeviceFilter();
  showPreloader: boolean = true;
  companyId: string;
  sub: Subscription = new Subscription();
  constructor(private devicesStateService: DevicesStateService,
    private devicesService: DevicesService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public cd: ChangeDetectorRef,
    private leftPanelStateService: LeftPanelStateService,
    private devicesRealTimeService: DevicesRealTimeService) { }

  ngOnInit() {
    this.leftPanelStateService.setCompanyPage("company-devices");
    this.companyId = localStorage.getItem("company_id");
    if (this.devicesStateService.getAllDevices()) {
      this.devices = (this.devicesStateService.getAllDevices()[this.companyId]) ? JSON.parse(JSON.stringify(this.devicesStateService.getAllDevices()[this.companyId])).map(item => new DeviceCompany(item, this.companyId)) : [];
      this.filter.onFilterName(this.devices);
      this.showPreloader = false;
    }
    if (this.devices.length > 0) this.sendDeviceStatusRequest(this.companyId, this.devices.filter(item => item.agentId).map(item => item.agentId));
    let getOnDevices = this.devicesStateService.getOnDevices().subscribe(data => {
      //  if (this.devices.length === 0 && data[this.companyId]) this.sendDeviceStatusRequest(this.companyId, data[this.companyId].filter(item => item.agentId).map(item => item.agentId));
      if (!data[this.companyId] && this.devices.length === 0) return;
      if (data[this.companyId].length > this.devices.length) {
        data[this.companyId].forEach(item => {
          let find = this.devices.find(device => device.id === item.id);
          if (!find) this.devices.push(new DeviceCompany(item, this.companyId));
        });
      } else if (data[this.companyId].length < this.devices.length) {
        this.devices.forEach((item, index) => {
          let findIndex = data[this.companyId].findIndex(device => device.id === item.id);
          if (findIndex === -1) this.devices.splice(index, 1);
        })
      } else if (data[this.companyId].length === this.devices.length) {
        this.devices.forEach(item => {
          let findIndex = data[this.companyId].findIndex(device => device.id === item.id);
          if (findIndex > -1) item.update(data[this.companyId][findIndex]);
        })
      }
      this.filter.onCurrentFilter(this.devices);
      this.cd.detectChanges();
      this.showPreloader = false;
    })
    this.sub.add(getOnDevices);
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
          this.devicesService.sendUninstallAgentRequest(this.companyId, this.devicesStateService.getDevicesForRemove().map(item => item.id)).subscribe(data => {
            this.onChangeSelect();
          });
        }
      }
    })
    this.sub.add(getConfirm);
    let getOnUpdateAgentActivityStatus = this.devicesStateService.getOnUpdateAgentActivityStatus().subscribe(newChange => {
      var isCurrentCompany = this.devicesStateService.getCompanyIdByAgentId(newChange.data.agentId) === this.companyId;
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
      if (this.companyId === data.companyId) this.devicesService.sendDeviceStatusRequest(data.companyId, data.agentIds, data.actions).subscribe(res => {
      })
    })
    this.sub.add(getOnSendDeviceStatus);
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
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to remove ${(len === 1) ? "1 device" : len + " devices"}?`;
    this.devicesStateService.setDevicesForRemove(this.devices.filter(item => item.selected));
  }
  onTurnOff(action) {
    if (action === 'reboot') {
      this.confirmStateService.setConfirmAction(REBOOT_DEVICE);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
      modalRef.componentInstance.message = `Are you sure you want to reboot chosen device?`;
      this.devicesStateService.setDevicesForReboot(this.devices.filter(item => item.selected));
    }
    if (action === 'shutdown') {
      this.confirmStateService.setConfirmAction(SHUTDOWN_DEVICE);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
      modalRef.componentInstance.message = `Are you sure you want to shutdown chosen device?`;
      this.devicesStateService.setDevicesForShutDown(this.devices.filter(item => item.selected));
    }
  }
  onChangeSelect() {
    let find = this.devices.find(item => !item.selected);
    this.selectAllDevices = (find) ? false : true;
    this.isOfflineDeviceSelected = (this.devices.find(item => item.selected && !item.online)) ? true : false;
  }
  toogleDevices() {
    this.devices.forEach(item => {
      item.selected = (this.selectAllDevices) ? true : false;
    })
    this.isOfflineDeviceSelected = (this.devices.find(item => item.selected && !item.online)) ? true : false;
  }
  isLabel(device) {
    if (device.label && device.hostName) return device.label !== device.hostName;
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
