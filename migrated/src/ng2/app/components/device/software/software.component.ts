import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { SoftwareListService } from './../_services/software-list.service';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetailService } from './../_services/device_detail.service';
import { first } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { HardwareService } from '../_services/hardware.service';
import { CONFIGCONSTANTS } from '../config/app-constants';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})
export class SoftwareComponent implements OnInit {

  url = 'http://localhost:4200/upload';
  private modalRef: BsModalRef;
  formData: FormData;
  loading = false;
  myDateValue: Date;
  check_all = false;
  selectedList: any[] = [];
  softwareList: any[] = [];
  humanizeBytes: Function;
  dragOver: boolean;
  deviceDetail: any = {};
  DateFormat = CONFIGCONSTANTS.DateFormat;
  constructor(private softwareListService: SoftwareListService,
      private toastr: ToastrService,
      private modalService: BsModalService,
      private deviceDetailService: DeviceDetailService,
      private hardwareService: HardwareService) {
  }

  ngOnInit() {
    this.myDateValue = new Date();
    this.deviceDetail = JSON.parse(localStorage.getItem('deviceDetail'));
    if (Object.keys(this.deviceDetailService.getDevice()).length === 0) {
      this.getDeviceDetail();
    } else {
      let temp = this.deviceDetailService.getDevice();
      this.softwareList = temp['reports'][0]['softList'];
    }
  }

  getDeviceDetail() {
	
    this.loading = true;
    this.hardwareService.getAllHardwareList(localStorage.getItem('company_id'), this.deviceDetail.agentId)
    .pipe(first())
    .subscribe(
      resp => {
        this.deviceDetailService.addDevice(resp);
        this.softwareList = this.deviceDetailService.getSoftware();
        this.loading = false;
      },
      error => {
      this.loading = false;
      this.toastr.error('Something went wrong please try again.');
      }
    );
  }
  onDateChange(newDate: Date) {
    console.log(newDate);
  }

  selectedRecord(flag: string, index) {
    if (flag == 'single') {
      if (this.softwareList[index].checked === true) {
        this.selectedList.push(index);
      } else {
        this.selectedList.splice( this.selectedList.indexOf(index), 1 );
      }
    } else if (flag == 'all' && this.check_all === true) {
      this.selectedList = [];
      for (let i = 0; i < this.softwareList.length; i++) {
        this.selectedList.push(index);
        this.softwareList[i].checked = true;
      }
    } else {
      this.selectedList = [];
      this.softwareList.forEach(element => {
        element.checked = false;
      });
    }
    if (this.selectedList.length === this.softwareList.length) {
      this.check_all = true;
    } else {
      this.check_all = false;
    }
  }

  openModal (template: TemplateRef<any>, id) {
    if (this.selectedList.length === 0 && id !== '') {
      this.selectedList.push(id);
    }
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  deleteSoftware() {
    this.loading = true;  
    this.softwareListService.deleteSoftware(this.selectedList)
    .pipe()
    .subscribe(data => {
      this.loading = false;
    },
    error => {
      this.loading = false;
      const statusError = error;
      if (statusError && statusError.meta) {
        this.toastr.error(statusError.meta.message);
      } else {
        this.toastr.error('Something went wrong please try again.');
      }
    });
  }

  decline () {
    this.selectedList = [];
    this.modalRef.hide();
  }



}
