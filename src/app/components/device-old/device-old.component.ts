
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonHttpServices } from './_services/common_http.service';
import { RemoteControlService } from './_services/remoteControl.service';
import { CommonServices } from './_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { HardwareService } from './_services/hardware.service';
import { DeviceDetailService } from './_services/device_detail.service';
import { first } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { ShellStateService } from 'src/app/states/shell/shell-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TerminalService } from './_services/terminal.service';
import { command } from './class/device';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { Subscription } from 'rxjs';
import { CompanyDevicesRemoteAccessComponent } from '../company-devices/company-devices-remote-access/company-devices-remote-access.component';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { Device } from '../company-devices/class/device';
import { NavOldComponent } from './nav/nav.component';
declare var $: any;

@Component({
  standalone: true,
  imports: [NavOldComponent, RouterModule, CommonModule],
  selector: 'device-old',
  templateUrl: './device-old.component.html',
  styleUrls: ['./device-old.component.scss'],
  standalone: true
})
export class DeviceOldComponent implements OnInit, OnDestroy {
  totalSeconds: any = 0;
  totalMinutes: any = 0;
  totalHours: any = 0;
  loading: boolean = false;
  // mainCompanyUuid: string = '9eb35e10-e243-4c07-baf0-c234fcd93766';
  deviceDetail: any = {};
  restServerAddress = '';
  remoteConnectPort = 0;
  deviceType = '';
  playTimer = true;
  _id: string = '';
  type: string = '';
  interval;
  sub: Subscription = new Subscription();
  constructor(private modalService: NgbModal, private commonHttpServices: CommonHttpServices,
    private commonServices: CommonServices, private toastr: ToastrService,
    private deviceDetailService: DeviceDetailService,
    private companiesStateService: CompaniesStateService,
    private shellStateService: ShellStateService,
    private devicesStateService: DevicesStateService,
    private devicesService: DevicesService,
    public cd: ChangeDetectorRef,
    private terminalService: TerminalService) { }

  openModal() {
    const modalRef = this.modalService.open(CompanyDevicesRemoteAccessComponent, { windowClass: 'device-send-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.connectionType = 'CSS';
    modalRef.componentInstance.companyId = localStorage.getItem('company_id');
    modalRef.componentInstance.device = this.deviceDetail;
    modalRef.componentInstance.action = 'CONNECT_DEVICE';
  }

  ngOnInit(): void {
    this.type = window.location.href.split('/')[window.location.href.split('/').length - 2];
    this._id = window.location.href.split('/')[window.location.href.split('/').length - 1];
    this.shellStateService.onInit();
    localStorage.setItem('uuid_' + this._id, uuidv4());
    this.deviceType = this.type;
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    $('body').addClass('ng7-device');
    if (this.companiesStateService.getCurrentCompany()) this.getDevicesByCompany();
    let onCurrentCompany = this.companiesStateService.onCurrentCompany.subscribe((data) => {
      this.getDevicesByCompany();
    })
    this.sub.add(onCurrentCompany);
    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);
    let onInitWebSocket = this.devicesStateService.onInitWebSocket.subscribe(data => {
      this.sendDeviceStatusRequest(localStorage.getItem('company_id'), [this._id]);
    })
    this.sub.add(onInitWebSocket);
    let getOnUpdateAgentActivityStatus = this.devicesStateService.getOnUpdateAgentActivityStatus().subscribe(newChange => {
      var isCurrentCompany = this.deviceDetail.agentId === newChange.data.agentId;
      if (newChange.data && newChange.data.statuses && newChange.data.statuses.hasOwnProperty('Idle')) {
        if (isCurrentCompany) {
          if (this.deviceDetail.agentId === newChange.data.agentId) {
            if (newChange.data.statuses.Idle) {
              this.deviceDetail.timing.idle = this.devicesStateService.getMillisecondsFromTimeString(newChange.data.statuses.Idle);
            } else {
              this.deviceDetail.timing.idle = null;
            }
          }
        }
      } else if (newChange.data && newChange.data.statuses && newChange.data.statuses.hasOwnProperty('NoRestart') && newChange.data.statuses.hasOwnProperty('Online')) {
        if (isCurrentCompany) {
          if (this.deviceDetail.agentId === newChange.data.agentId) {
            this.deviceDetail.timing.noRestart = this.devicesStateService.getMillisecondsFromTimeString(newChange.data.statuses.NoRestart);
            this.deviceDetail.timing.online = this.devicesStateService.getMillisecondsFromTimeString(newChange.data.statuses.Online);
            this.deviceDetail.timing.uptimeForOrdering = this.devicesStateService.getMillisecondsFromTimeString(newChange.data.statuses.Online);
          }
        }
      }
      this.cd.detectChanges();
    })
    this.sub.add(getOnUpdateAgentActivityStatus);
  }
  sendDeviceStatusRequest(companyId, ids) {
    this.devicesService.sendDeviceStatusRequest(companyId, ids, ["idle", "norestart", "online"]).subscribe(data => {
    })
  }
  updateTime() {
    this.totalSeconds++;
    if (parseInt(this.totalSeconds) === 60) {
      this.totalSeconds = 0;
      this.totalMinutes++;
    }
    if (this.totalMinutes === 60) {
      this.totalMinutes = 0;
      this.totalHours++;
    }
    $('#counter').text(this.padNumber(this.totalHours) + ' hr : ' + this.padNumber(this.totalMinutes) + ' min : ' + this.padNumber(this.totalSeconds) + ' sec');
  }
  getDevicesByCompany() {
    this.commonHttpServices.getDevicesByCompany(localStorage.getItem('company_id'), this._id)
      .pipe()
      .subscribe(resp => {
        const tempObj = this.commonServices.cleanObject(resp);
        let deviceList = [];
        for (let key of Object.keys(tempObj)) {
          for (let key1 of Object.keys(tempObj[key])) {
            deviceList.push(tempObj[key][key1]);
            deviceList[deviceList.length - 1].company_id = key;
          }
        }
        this.deviceDetailService.addDeviceList(deviceList);
        let index = deviceList.findIndex(value => value.agentId === this._id)
        this.deviceDetail = new Device(deviceList[index]);
        localStorage.setItem('deviceDetail_' + this._id, JSON.stringify(deviceList[index]))
        localStorage.setItem('company_id', deviceList[index].company_id);
        this.deviceDetailService.setDevice(JSON.stringify(deviceList[index]));
      },
        error => {
          this.toastr.error('Something went wrong please try again.');
        });
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
  padNumber(value) {
    if (value == 0) {
      return '00';
    } else if (value < 10) {
      return '0' + value;
    }
    return value;
  }

  timerControl() {
    this.playTimer = !this.playTimer
    if (this.interval && !this.playTimer) {
      clearInterval(this.interval);
    } else {
      this.interval = setInterval(() => {
        this.updateTime();
      }, 1000);
    }
  }

  restartTimerControl() {
    clearInterval(this.interval);
    this.totalSeconds = 0;
    this.totalMinutes = 0;
    this.totalHours = 0;
    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  sendCommand(command) {
    if (JSON.parse(localStorage.getItem('deviceDetail_' + this._id)).online === true) {
      let data: command = {
        "companyId": localStorage.getItem('company_id'),
        "agentId": this._id,
        "sessionId": localStorage.getItem('uuid_' + this._id),
        "scriptType": 'cmd', // 'powershell'
        "script": 'shutdown /' + command,
        "file": false,
        "keepOpen": true
      }

      this.terminalService.sendCommand(data)
        .pipe(first())
        .subscribe(resp => {
        },
          error => {
            const statusError = error;
          });
    } else {
      this.toastr.error('The device is offline');
    }

  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.deviceDetailService.setDevice(null);
  }
}
