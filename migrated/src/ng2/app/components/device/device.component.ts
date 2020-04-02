import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonHttpServices } from './_services/common_http.service';
import { CommonServices } from './_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { HardwareService } from './_services/hardware.service';
import { DeviceDetailService } from './_services/device_detail.service';
import { first } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LockScreenComponent } from './lock-screen/lock-screen.component';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {
  title = 'quck-device';
  totalSeconds:any = 0;
  totalMinutes:any = 0;
  totalHours:any = 0;
  mainCompanyUuid: string = '9eb35e10-e243-4c07-baf0-c234fcd93766';
  deviceDetail: any = {};
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService, private commonHttpServices: CommonHttpServices,
    private commonServices: CommonServices, private toastr: ToastrService,
    private hardwareService: HardwareService,
    private deviceDetailService: DeviceDetailService) {}
  openModal(template) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'remote-control modal-dialog-centered' })
    );
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
    if (localStorage.getItem('currentComapnyId') === undefined) {
      localStorage.setItem('currentComapnyId', this.mainCompanyUuid);
    }
    
    this.getDevicesByCompany();
    setInterval(() => {
      this.updateTime();
    },1000);
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
    this.commonHttpServices.getDevicesByCompany(localStorage.getItem('currentComapnyId'))
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

  padNumber (value) {
    if(value == 0) {
      return '00';
    } else if (value < 10) {
      return '0' + value;
    }
    return value;
  }

}
