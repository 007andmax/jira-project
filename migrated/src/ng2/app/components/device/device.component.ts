import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonHttpServices } from './_services/common_http.service';
import { RemoteControlService } from './_services/remoteControl.service';
import { CommonServices } from './_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { HardwareService } from './_services/hardware.service';
import { DeviceDetailService } from './_services/device_detail.service';
import { first } from 'rxjs/operators';
import { LockScreenComponent } from './lock-screen/lock-screen.component';

@Component({
  selector: 'app-root',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {
  title = 'quck-device';
  totalSeconds:any = 0;
  totalMinutes:any = 0;
  totalHours:any = 0;
  loading:boolean = false;
  mainCompanyUuid: string = '9eb35e10-e243-4c07-baf0-c234fcd93766';
  deviceDetail: any = {};
  restServerAddress = '';
  remoteConnectPort = 0;
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService, private commonHttpServices: CommonHttpServices,
    private commonServices: CommonServices, private toastr: ToastrService,
    private hardwareService: HardwareService,
    private deviceDetailService: DeviceDetailService, 
    private remoteControlService: RemoteControlService) {}
  openModal(template) {
    if(this.deviceDetail.online === true) {
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: 'remote-control modal-dialog-centered' })
      );
    } else {
      this.toastr.error('The device is offline!');
    }
    
  }

  lock() {
    this.modalRef = this.modalService.show(
      LockScreenComponent,
      Object.assign({}, { class: 'remote-control modal-dialog-centered lock', backdrop: true })
    );
  }
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getCurrentCompany();
    
    setInterval(() => {
      this.updateTime();
    },1000);
  }

  getCurrentCompany() {
	
    this.commonHttpServices.getCurrentCompany()
    .pipe(first())
    .subscribe(
      resp => {
        localStorage.setItem('currentCompany', resp.id);
        if (localStorage.getItem('currentCompany') === undefined || localStorage.getItem('currentCompany') === null) {
          localStorage.setItem('currentCompany', this.mainCompanyUuid);
        }
        
        this.getDevicesByCompany();
      },
      error => {
      this.toastr.error('Something went wrong please try again.');
      }
    );
  }

  getDeviceDetail() {
	
    this.hardwareService.getAllHardwareList(localStorage.getItem('company_id'), this.deviceDetail.agentId)
    .pipe(first())
    .subscribe(
      resp => {
        this.deviceDetailService.addDevice(resp);
      },
      error => {
      this.toastr.error('Something went wrong please try again.');
      }
    );
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
  }

  getDevicesByCompany() {
    this.commonHttpServices.getDevicesByCompany(localStorage.getItem('currentCompany'))
      .pipe()
      .subscribe(resp => {
        const tempObj = this.commonServices.cleanObject(resp);
        let deviceList = [];
        for (let key of Object.keys(tempObj)) {
          for (let key1 of Object.keys(tempObj[key])) {
            deviceList.push(tempObj[key][key1]);
          }
        }
        this.deviceDetailService.addDeviceList(deviceList);
        this.deviceDetail = tempObj[Object.keys(tempObj)[0]][0];
        localStorage.setItem('deviceDetail', JSON.stringify(tempObj[Object.keys(tempObj)[0]][0]))
        localStorage.setItem('company_id', Object.keys(tempObj)[0]);
        // this.getDeviceDetail();
      },
      error => {
        this.toastr.error('Something went wrong please try again.');
      });
    }

    getViewer() {
      this.loading = true;
      this.remoteControlService.getViewer()
      .pipe()
      .subscribe(resp => {
        this.loading = false;
      },
      error => {
        console.log('Something went wrong please try again.');
      });
    }

    getConstant(sessionId) {
      this.remoteControlService.getConstant()
      .pipe()
      .subscribe(resp => {
        this.restServerAddress = resp['rest.server.url'];
        this.remoteConnectPort = resp['remote.connect.port'];
        let url = 'quicktech://connect?serverIP=' + this.restServerAddress + '&port=' + this.remoteConnectPort + '&sessionID=' + sessionId;
        window.open(url, '_self');
      },
      error => {
        console.log('Something went wrong please try again.');
      });
    }

    createConnection(type) {
      this.loading = true;
      let data = {
        deviceId: this.deviceDetail.id,
        type: type,
        companyId: localStorage.getItem('company_id')
      };
      this.remoteControlService.createConnection(data)
      .pipe()
      .subscribe(resp => {
        this.loading = false;
        if (type === 'CSS') {
          this.modalRef.hide();
          this.getViewer();
        } else {
          this.getConstant(resp.sessionId);
          
        }
        
      },
      error => {
        this.toastr.error('Something went wrong please try again.');
      });
    }

  padNumber (value) {
    if(value == 0) {
      return '00';
    } else if (value < 10) {
      return '0' + value;
    }
    return value;
  }

}
