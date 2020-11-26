import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { REBOOT_DEVICE, REMOVE_DEVICES, SHUTDOWN_DEVICE } from '../../const/confirm';
import { DevicesService } from '../../services/devices/devices.service';
import { DevicesRealTimeService } from '../../states/devices/devices-real-time.service';
import { DevicesStateService } from '../../states/devices/devices-state.service';
import { ConfirmComponent } from '../shared/confirm/confirm.component';
import { ConfirmStateService } from '../shared/confirm/services/confirm-state.service';
import { Device } from './class/device';
import { DeviceCompany } from './class/device-company';

@Component({
  selector: 'app-company-devices',
  templateUrl: './company-devices.component.html',
  styleUrls: ['./company-devices.component.scss']
})
export class CompanyDevicesComponent implements OnInit, OnDestroy {
  devices: Array<DeviceCompany> = [];
  selectAllDevices: boolean = false;
  isOfflineDeviceSelected: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private devicesStateService: DevicesStateService,
    private devicesService: DevicesService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public cd: ChangeDetectorRef,
    private devicesRealTimeService: DevicesRealTimeService) { }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    let companyId = localStorage.getItem("company_id");
    this.devices = (this.devicesStateService.getAllDevices()[companyId]) ? JSON.parse(JSON.stringify(this.devicesStateService.getAllDevices()[companyId])).map(item => new DeviceCompany(item, companyId)) : [];
    console.log("this.devices", this.devices);
    if (this.devices.length > 0) {
      this.devicesService.sendDeviceStatusRequest(companyId, this.devices.filter(item => item.agentId).map(item => item.agentId), ["idle", "norestart", "online"]).subscribe(data => {
        console.log("data", data);
      })
    }
    let getOnDevices = this.devicesStateService.getOnDevices().subscribe(data => {
      if (data[companyId].length > this.devices.length) {
        data[companyId].forEach(item => {
          let find = this.devices.find(device => device.id === item.id);
          if (!find) this.devices.push(new DeviceCompany(item, companyId));
        });
      } else if (data[companyId].length < this.devices.length) {
        this.devices.forEach(item => {
          let findIndex = data[companyId].findIndex(device => device.id === item.id);
          if (findIndex === -1) this.devices.splice(findIndex, 1);
        })
      } else if (data[companyId].length === this.devices.length) {
        this.devices.forEach(item => {
          let findIndex = data[companyId].findIndex(device => device.id === item.id);
          console.log("findIndex", findIndex);
          if (findIndex > -1) item.update(data[companyId][findIndex]);
        })
      }
      this.cd.detectChanges();
      console.log("this.devices", this.devices);
    })
    this.sub.add(getOnDevices);
    this.devicesRealTimeService.oneTimeConnectionArray.subscribe(newChange => {
      if (newChange.action === 'ONE_TIME_CONNECTION_OPEN') {
        for (var i = 0; i < this.devices.length; i++) {
          if (this.devices[i].id === newChange.data.deviceId) {
            this.devices[i].remoteSessions.push(newChange.data)
          }
        }
      } else if (newChange.action === 'ONE_TIME_DELETED') {
        for (var i = 0; i < this.devices.length; i++) {
          for (var r = 0; r < this.devices[i].remoteSessions.length; r++) {
            if (this.devices[i].remoteSessions[r].id === newChange.data) {
              this.devices[i].remoteSessions.splice(r, 1);
            }
          }
        }
      }
      this.cd.detectChanges();
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REBOOT_DEVICE) {
          this.devicesService.sendPowerAction(companyId, this.devicesStateService.getDevicesForReboot().map(item => item.agentId), 'reboot').subscribe(data => {

          });
        }
        if (this.confirmStateService.getConfirmAction() === SHUTDOWN_DEVICE) {
          this.devicesService.sendPowerAction(companyId, this.devicesStateService.getDevicesForShutDown().map(item => item.agentId), 'shutdown').subscribe(data => {

          });
        }
        if (this.confirmStateService.getConfirmAction() === REMOVE_DEVICES) {
          this.devicesService.sendUninstallAgentRequest(companyId, this.devicesStateService.getDevicesForRemove().map(item => item.id)).subscribe(data => {
            this.onChangeSelect();
          });
        }

      }
    })
    this.sub.add(getConfirm);

    let getOnUpdateAgentActivityStatus = this.devicesStateService.getOnUpdateAgentActivityStatus().subscribe(newChange => {
      var isCurrentCompany = this.devicesStateService.getCompanyIdByAgentId(newChange.data.agentId) === companyId;
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
    console.log("selectAllDevices", this.selectAllDevices);
    this.devices.forEach(item => {
      item.selected = (this.selectAllDevices) ? true : false;
    })
    this.isOfflineDeviceSelected = (this.devices.find(item => item.selected && !item.online)) ? true : false;
  }
  public trackById(index, item) {
    return item.id;
  }

}
