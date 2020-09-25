import { Component, OnInit, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, } from 'ngx-uploader';
import { HardwareService } from './../_services/hardware.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CONFIGCONSTANTS } from '../config/app-constants';
import { environment } from '../../../../environments/environment';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import {NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
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
  windows_info:string = '';
  system = {
    install_date: null,
    manufacturer: '',
    asset_tag: '',
    warranty: null,
    architecture: '',
    model: '',
    caption: '',
    version: ''
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
  DateFormat = CONFIGCONSTANTS.DateFormat1;
   constructor(private hardwareService: HardwareService,
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
  myDateValue: Date;
  ngOnInit() {
    this.myDateValue = new Date();
    this.deviceDetail = JSON.parse(localStorage.getItem('deviceDetail'));
    this.hostName = this.deviceDetail.hostName;
    this.label = this.deviceDetail.label;
    this.getDeviceDetail();
    // this.getVirusInfo();
  }
  getDeviceDetail() {
	
    this.hardwareService.getAllHardwareList(localStorage.getItem('company_id'), this.deviceDetail.agentId)
    .pipe(first())
    .subscribe(
      resp => {
        this.logicalDisk = resp.reports[0].logicalDisks;
        this.virusInfo = resp.reports[0].antivirus[0];
        this.system = resp.reports[0].system || {};
        this.windows_info = this.system.caption + '(' + this.system.architecture + ') Version ' + this.system.version;
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
          if(element.is_system === true) {
            element.color = '#2ec866';  
          } else {
            element.color = colors[count];
            count++;
          }
          if (count == 5) {
            count = 0;
          }
          if(element.free_space != '' && element.size != '') {
            let size = this.convertToGB(element.size);
            let free = this.convertToGB(element.free_space)
            let osize = parseInt(size) - parseInt(free)
            element.percent =  Math.round((osize/parseInt(size)) * 100);
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
      agentId: localStorage.getItem('agentId'),
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
    return (parseInt(value)/1024/1024/1024).toFixed(2)
  }
  saveLabel() {
    this.label = this.label.toUpperCase();
    const data = {
      agentId: localStorage.getItem('agentId'),
      companyId: localStorage.getItem('company_id'),
      newLabelValue: this.label
    }
    this.hardwareService.saveDeviceName(data)
    .pipe(first())
    .subscribe(
      resp => {
        $('#head-label').text(this.label);
        let obj = JSON.parse(localStorage.getItem('deviceDetail'));
        obj.label = this.label;
        localStorage.setItem('deviceDetail', JSON.stringify(obj));
      },
      error => {
        this.toastr.error('Something went wrong please try again.');
      }
    );
  }
  format(date: NgbDateStruct | null): string {
    return date ? date.day + '/' + date.month + '/' + date.year : '';
  }
}