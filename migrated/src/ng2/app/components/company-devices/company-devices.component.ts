import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { REBOOT_DEVICE, SHUTDOWN_DEVICE } from '../../const/confirm';
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
    private devicesRealTimeService: DevicesRealTimeService) { }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    let companyId = localStorage.getItem("company_id");
    this.devices = (this.devicesStateService.getAllDevices()[companyId]) ? this.devicesStateService.getAllDevices()[companyId].map(item => new DeviceCompany(item, companyId)) : [];
    console.log("this.devices", this.devices);
    if (this.devices.length > 0) {
      this.devicesService.sendDeviceStatusRequest(companyId, this.devices.filter(item => item.agentId).map(item => item.agentId), ["idle", "norestart", "online"]).subscribe(data => {
        console.log("data", data);
      })
    }
    this.devicesStateService.getOnDevices().subscribe(data => {
      let devices = data[companyId].map(item => new DeviceCompany(item, companyId));
      devices.forEach(item => {
        let find = this.devices.find(device => device.agentId === item.agentId);
        if (!find && find.agentId) {
          this.devicesService.sendDeviceStatusRequest(companyId, [find.agentId], ["idle", "norestart", "online"]).subscribe(res => {
            console.log("res", res);
          })
        }
      });
      this.devices = devices;
      console.log("this.devices", this.devices);
    })
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
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REBOOT_DEVICE) {
          this.devicesService.sendPowerAction(companyId, this.devicesStateService.getDevicesForReboot(), 'reboot').subscribe(data => {

          });
        }
        if (this.confirmStateService.getConfirmAction() === SHUTDOWN_DEVICE) {
          this.devicesService.sendPowerAction(companyId, this.devicesStateService.getDevicesForShutDown(), 'shutdown').subscribe(data => {

          });
        }

      }
    })
    this.sub.add(getConfirm);
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
