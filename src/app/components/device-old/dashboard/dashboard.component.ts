
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HardwareService } from './../_services/hardware.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CONFIGCONSTANTS } from '../config/app-constants';
import { environment } from '../../../../environments/environment';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetailService } from '../_services/device_detail.service';
import { Subscription } from 'rxjs';
import * as moment from "moment";
import { DashboardDetailsDashboardComponent } from './dashboard-details-dashboard/dashboard-details-dashboard.component';
import { DashboardDiskDrivesComponent } from './dashboard-disk-drives/dashboard-disk-drives.component';
import { DashboardServicesComponent } from './dashboard-services/dashboard-services.component';
import { DashboardTagsComponent } from './dashboard-tags/dashboard-tags.component';

@Component({
  standalone: true,
  imports: [DashboardDetailsDashboardComponent, DashboardDiskDrivesComponent, DashboardServicesComponent, DashboardTagsComponent, CommonModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true
})
export class DashboardComponent implements OnInit, OnDestroy {
  url = environment.apiUrl + 'upload';
  formData: FormData;
  dragOver: boolean;
  show = false;
  deviceDetail: any = {};
  windows_info: string = '';
  system = {
    installDate: null,
    manufacturer: '',
    assetTag: '',
    warranty: null,
    architecture: '',
    model: '',
    caption: '',
    version: '',
    releaseId: '',
    warrantyTime: null,
    install_dateTime: null,
  };
  networkAdapters = {
    ipAddress: ''
  }
  logicalDisk: any = [];
  virusInfo: any = [];
  showInput = true;
  progressClass = 'p20';
  visible = false;
  type = '';
  _id = '';
  DateFormat = CONFIGCONSTANTS.DateFormat1;
  myDateValue: Date;
  sub: Subscription = new Subscription();
  constructor(private hardwareService: HardwareService,
    private deviceDetailService: DeviceDetailService,
    private toastr: ToastrService) {
  }

  onChangeInstallDate(data) {
    this.system.installDate = data;
    this.system.install_dateTime = new Date(data.year, data.month - 1, data.day).getTime();
    this.updateDashboard('installDate');
  }
  onChangeWarranty(data) {
    this.system.warranty = data;
    this.system.warrantyTime = new Date(data.year, data.month - 1, data.day).getTime();
    this.updateDashboard('warranty');
  }
  ngOnInit() {
    this.type = window.location.href.split('/')[window.location.href.split('/').length - 2];
    this._id = window.location.href.split('/')[window.location.href.split('/').length - 1];
    this.myDateValue = new Date();
    if (this.deviceDetailService.device) this.setPreviewDataDevice();
    let onGetDevice = this.deviceDetailService.onGetDevice.subscribe(data => {
      this.setPreviewDataDevice();
    })
    this.sub.add(onGetDevice);

    // this.getVirusInfo();
  }
  setPreviewDataDevice() {
    this.deviceDetail = JSON.parse(localStorage.getItem('deviceDetail_' + this._id));
    this.getDeviceDetail();
  }
  getDeviceDetail() {

    this.hardwareService.getAllHardwareList(localStorage.getItem('company_id'), this.deviceDetail.agentId)
      .pipe(first())
      .subscribe(
        resp => {
          this.logicalDisk = resp.reports[0].logicalDisks;
          this.virusInfo = resp.reports[0].antivirus[0];
          this.system = resp.reports[0].system || {};
          let caption = this.system.caption.replace('Microsoft ', '')
          let releaseId = this.system.releaseId === '' ? '' : ` Version ${this.system.releaseId}`;
          let architecture = this.system.architecture === '' ? '' : ` ( ${this.system.architecture} )`;
          this.windows_info = `${caption}${architecture}${releaseId}`;
          if (this.system.installDate !== '') {
            this.system.install_dateTime = new Date(this.system.installDate).getTime();
            this.system.installDate = {
              "day": new Date(this.system.installDate).getDate(),
              "month": new Date(this.system.installDate).getMonth(),
              "year": new Date(this.system.installDate).getFullYear(),
            };
          } else {
            this.system.install_dateTime = new Date().getTime();
          }
          this.networkAdapters = resp['reports'][0].networkAdapters.filter(value => value.ipEnabled === true)[0] || {};
          if (this.system.warranty !== '') {
            this.system.warrantyTime = new Date(this.system.warranty).getTime();
            this.system.warranty = {
              "day": new Date(this.system.warranty).getDate(),
              "month": new Date(this.system.warranty).getMonth(),
              "year": new Date(this.system.warranty).getFullYear()
            };
          } else {
            this.system.warrantyTime = new Date().getTime();
          }
          let colors = ['#0057a8', '#00d8e7', '#16a4fa', '#0CB2B2', '#485EF0'];
          let count = 0;
          this.logicalDisk.forEach(element => {
            if (element.isSystem === true) {
              element.color = '#2ec866';
            } else {
              element.color = colors[count];
              count++;
            }
            if (count == 5) {
              count = 0;
            }
            if (element.freeSpace != '' && element.size != '') {
              let size = this.convertToGB(element.size);
              let free = this.convertToGB(element.freeSpace)
              let osize = parseInt(size) - parseInt(free)
              element.percent = Math.round((osize / parseInt(size)) * 100);
            } else {
              element.percent = 0;
            }

          });
          // this.logicalDisk.sort(function(x, y) {
          //   return (x.isSystem === y.isSystem)? 0 : x? -1 : 1;
          // });
          this.logicalDisk.sort((a, b) => {
            if (a['deviceId'] && b['deviceId']) {
              return ((a['deviceId'].toLowerCase() > b['deviceId'].toLowerCase()) ?
                1 : ((b['deviceId'].toLowerCase() > a['deviceId'].toLowerCase()) ? -1 : 0));
            } else if (a['deviceId']) {
              return 1
            } else if (b['deviceId']) {
              return -1
            }
            return 0;
          });
          document.getElementById("tag").setAttribute("data-tooltip", this.system.assetTag);
          document.getElementById("manufacture").setAttribute("data-tooltip", this.system.manufacturer);
        },
        error => {
          this.toastr.error('Something went wrong please try again.');
        }
      );
  }
  getVirusInfo() {

    this.hardwareService.getVirusInfo(localStorage.getItem('company_id'))
      .pipe(first())
      .subscribe(
        resp => {
          // this.virusInfo = resp;

        },
        error => {
          this.toastr.error('Something went wrong please try again.');
        }
      );
  }
  onDateChange(newDate: Date) {

  }
  updateDashboard(type: any) {
    let obj = {
      system: {}
    };
    if (type === 'manufacturer') {
      obj.system['manufacturer'] = this.system.manufacturer;
    } else if (type === 'model') {
      obj.system['model'] = this.system.model;
    } else if (type === 'assetTag') {
      obj.system['assetTag'] = this.system.assetTag;
    } else if (type === 'architecture') {
      obj.system['architecture'] = this.system.architecture;
    } else if (type === 'installDate') {
      obj.system['installDate'] = moment(new Date(this.system.installDate.year, this.system.installDate.month - 1, this.system.installDate.day)).format('YYYY/MM/DD');
    } else if (type === 'warranty') {
      obj.system['warranty'] = moment(new Date(this.system.warranty.year, this.system.warranty.month - 1, this.system.warranty.day)).format('YYYY/MM/DD');
    }
    const data = {
      agentId: this._id,
      companyId: localStorage.getItem('company_id'),
      override: obj
    }
    this.hardwareService.overrideHardware(data)
      .pipe(first())
      .subscribe(
        resp => {
          if (resp.errors === 'success') {
          }
        },
        error => {
          this.toastr.error('Something went wrong please try again.');
        }
      );
  }
  convertToGB(value) {
    return (parseInt(value) / 1024 / 1024 / 1024).toFixed(2)
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + '/' + date.month + '/' + date.year : '';
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}