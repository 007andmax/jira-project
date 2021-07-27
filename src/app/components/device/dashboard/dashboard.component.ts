import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, } from 'ngx-uploader';
import { HardwareService } from './../_services/hardware.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CONFIGCONSTANTS } from '../config/app-constants';
import { environment } from '../../../../environments/environment';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AgentService } from 'src/app/services/agent/agent.service';
import { DeviceDetailService } from '../_services/device_detail.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(NgbDatepicker) d: NgbDatepicker;
  url = environment.apiUrl + 'upload';
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  options: UploaderOptions;
  show = false;
  deviceDetail: any = {};
  windows_info: string = '';
  system = {
    install_date: null,
    manufacturer: '',
    asset_tag: '',
    warranty: null,
    architecture: '',
    model: '',
    caption: '',
    version: '',
    release_id: ''
  };
  networkAdapters = {
    ip_address: ''
  }
  logicalDisk: any = [];
  virusInfo: any = [];
  hostName = '';
  label = '';
  showInput = true;
  progressClass = 'p20';
  visible = false;
  editNote = false;
  create = false;
  type = '';
  _id = '';
  DateFormat = CONFIGCONSTANTS.DateFormat1;
  myDateValue: Date;
  sub: Subscription = new Subscription();
  constructor(private hardwareService: HardwareService,
    private deviceDetailService: DeviceDetailService,
    private agentService: AgentService,
    private toastr: ToastrService) {
    this.options = { concurrency: 1, maxUploads: 10, maxFileSize: 1000000 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
      const event: UploadInput = {
        type: 'uploadAll',
        url: this.url,
        method: 'POST',
        data: { foo: 'bar' }
      };
      this.uploadInput.emit(event);
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'cancelled' || output.type === 'removed') {
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {

    }
    // this.files = this.files.filter(file => file.progress.status !== UploadStatus.Done);
  }
  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.url,
      method: 'POST',
      data: { foo: 'bar' }
    };
    this.uploadInput.emit(event);
  }
  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }
  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }
  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
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
    this.hostName = this.deviceDetail.hostName;
    this.label = this.deviceDetail.label;
    this.getDeviceDetail();
    this.agentService.getAgentToken("QuickTech", "s8Y1IuPCUUYlSLMbFijHvut5uOi/KnKNqOLtn57CBlw=").subscribe(data => {
      console.log("data", data);
      this.agentService.setAccessToken(data.AccessToken);
      this.agentService.getAssetsByCompanyId("fdadb2df-ed3d-4e28-b41e-741617b7ffa6").subscribe(res => {
        console.log("res", res);
      })
    })
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
          let release_id = this.system.release_id === '' ? '' : ` Version ${this.system.release_id}`;
          let architecture = this.system.architecture === '' ? '' : ` ( ${this.system.architecture} )`;
          this.windows_info = `${caption}${architecture}${release_id}`;
          if (this.system.install_date !== '') {
            this.system.install_date = {
              "day": new Date(this.system.install_date).getDate(),
              "month": new Date(this.system.install_date).getMonth() + 1,
              "year": new Date(this.system.install_date).getFullYear(),
            };
          }
          this.networkAdapters = resp['reports'][0].networkAdapters.filter(value => value.ip_enabled === true)[0] || {};
          if (this.system.warranty !== '') {
            this.system.warranty = {
              "day": new Date(this.system.warranty).getDate(),
              "month": new Date(this.system.warranty).getMonth() + 1,
              "year": new Date(this.system.warranty).getFullYear()
            };
          }
          let colors = ['#0057a8', '#00d8e7', '#16a4fa', '#0CB2B2', '#485EF0'];
          let count = 0;
          this.logicalDisk.forEach(element => {
            if (element.is_system === true) {
              element.color = '#2ec866';
            } else {
              element.color = colors[count];
              count++;
            }
            if (count == 5) {
              count = 0;
            }
            if (element.free_space != '' && element.size != '') {
              let size = this.convertToGB(element.size);
              let free = this.convertToGB(element.free_space)
              let osize = parseInt(size) - parseInt(free)
              element.percent = Math.round((osize / parseInt(size)) * 100);
            } else {
              element.percent = 0;
            }

          });
          // this.logicalDisk.sort(function(x, y) {
          //   return (x.is_system === y.is_system)? 0 : x? -1 : 1;
          // });
          this.logicalDisk.sort((a, b) => {
            if (a['device_id'] && b['device_id']) {
              return ((a['device_id'].toLowerCase() > b['device_id'].toLowerCase()) ?
                1 : ((b['device_id'].toLowerCase() > a['device_id'].toLowerCase()) ? -1 : 0));
            } else if (a['device_id']) {
              return 1
            } else if (b['device_id']) {
              return -1
            }
            return 0;
          });
          document.getElementById("tag").setAttribute("data-tooltip", this.system.asset_tag);
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
    } else if (type === 'asset_tag') {
      obj.system['asset_tag'] = this.system.asset_tag;
    } else if (type === 'architecture') {
      obj.system['architecture'] = this.system.architecture;
    } else if (type === 'install_date') {
      obj.system['install_date'] = this.system.install_date.year + '/' + this.system.install_date.month + '/' + this.system.install_date.day;
    } else if (type === 'warranty') {
      obj.system['warranty'] = this.system.warranty.year + '/' + this.system.warranty.month + '/' + this.system.warranty.day;
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
  diskSpaceDiff(v1, v2) {
    let val1 = (parseInt(v1) / 1024 / 1024 / 1024).toFixed(2)
    let val2 = (parseInt(v2) / 1024 / 1024 / 1024).toFixed(2)
    return (parseFloat(val1) - parseFloat(val2)).toFixed(2)
  }

  saveLabel() {
    this.label = this.label.toUpperCase();
    const data = {
      agentId: this._id,
      companyId: localStorage.getItem('company_id'),
      newLabelValue: this.label
    }
    this.hardwareService.saveDeviceName(data)
      .pipe(first())
      .subscribe(
        resp => {
          $('#head-label').text(this.label);
          let obj = JSON.parse(localStorage.getItem('deviceDetail_' + this._id));
          obj.label = this.label;
          localStorage.setItem('deviceDetail_' + this._id, JSON.stringify(obj));
        },
        error => {
          this.toastr.error('Something went wrong please try again.');
        }
      );
  }
  format(date: NgbDateStruct | null): string {
    return date ? date.day + '/' + date.month + '/' + date.year : '';
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}