
import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { SoftwareListService } from './../_services/software-list.service';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetailService } from './../_services/device_detail.service';
import { CommonHttpServices } from './../_services/common_http.service';
import { ExcelService } from './../_services/download_csv.service';
import { first } from 'rxjs/operators';
import { HardwareService } from '../_services/hardware.service';
import { CONFIGCONSTANTS } from '../config/app-constants';
import { Router } from '@angular/router';
import { Subject, Subscription } from "rxjs";
import { environment } from './../../../../environments/environment';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SoftwareHeaderComponent } from './software-header/software-header.component';
import { TicketTaskComponent } from '../ticket-task/ticket-task.component';
import { SoftwarePipe } from '../_pipe/software.pipe';
import { DataTablesModule } from 'angular-datatables';

@Component({
  standalone: true,
  imports: [TicketTaskComponent, DataTablesModule, SoftwarePipe, CommonModule, SoftwareHeaderComponent],
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss'],

})
export class SoftwareComponent implements OnInit, OnDestroy {
  url = environment.apiUrl + 'upload';
  formData: FormData;
  loading = false;
  softwareList: any[] = [];
  deviceDetail: any = {};
  search = '';
  DateFormat = CONFIGCONSTANTS.DateFormat;
  dtOptions: any = {
    searching: false,
    paging: false,
    info: false,
    order: [[0, 'asc']],
    columns: [{
      data: 'softName',
      orderable: true
    }, {
      data: 'softPublisher',
      orderable: true
    }, {
      data: 'softVersion',
      orderable: true
    }, {
      data: 'softInstalledOn',
      orderable: true
    }, {
      data: 'softVersion',
      orderable: true
    }]
  };
  _id: string = '';
  type: string = '';
  @ViewChild('header', { static: true }) header: SoftwareHeaderComponent;
  dtTrigger = new Subject();
  sub: Subscription = new Subscription();
  constructor(private toastr: ToastrService,
    private deviceDetailService: DeviceDetailService,
    private hardwareService: HardwareService,
    private router: Router,
    public cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    // if (window.innerWidth <= 1440) {
    //   $('main').css('margin-right', '64px')
    // } else {
    //   $('main').css('margin-right', '352px')
    // }
    this.type = window.location.href.split('/')[window.location.href.split('/').length - 2];
    this._id = window.location.href.split('/')[window.location.href.split('/').length - 1];
    if (this.type === 'printer') {
      this.router.navigate([`/device/dashboard/${this.type}/${this._id}`]);
    }
    this.deviceDetail = JSON.parse(localStorage.getItem('deviceDetail_' + this._id));
    if (Object.keys(this.deviceDetailService.getDevice()).length === 0) {
      this.getDeviceDetail();
    } else {
      let temp = this.deviceDetailService.getDevice();
      this.softwareList = temp['reports'][0]['softList'];
      this.cd.detectChanges();
      setTimeout(() => {
        this.dtTrigger.next();
      }, 500);
      this.header.getPdfData();
    }
  }
  onSearch(data) {
    this.search = data;
  }
  getDeviceDetail() {

    this.loading = true;
    this.hardwareService.getAllHardwareList(localStorage.getItem('company_id'), this.deviceDetail.agentId)
      .pipe(first())
      .subscribe(
        resp => {
          this.deviceDetailService.addDevice(resp);
          this.softwareList = this.deviceDetailService.getSoftware();
          this.cd.detectChanges();
          this.dtTrigger.next();
          this.header.getPdfData();
          this.loading = false;
        },
        error => {
          this.loading = false;
          this.toastr.error('Something went wrong please try again.');
        }
      );
  }
  onDateChange(newDate: Date) {

  }
  // openModal (template: TemplateRef<any>, id) {
  //   if (this.selectedList.length === 0 && id !== '') {
  //     this.selectedList.push(id);
  //   }
  //   this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  // }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.dtTrigger.unsubscribe();
  }
}
