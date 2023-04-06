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
import { DELETE_SOFTWARE } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SoftwareHeaderComponent } from './software-header/software-header.component';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})
export class SoftwareComponent implements OnInit, OnDestroy {
  url = environment.apiUrl + 'upload';
  formData: FormData;
  loading = false;
  check_all = false;
  selectedList: any[] = [];
  softwareList: any[] = [];
  deviceDetail: any = {};
  search = '';
  DateFormat = CONFIGCONSTANTS.DateFormat;
  dtOptions: DataTables.Settings = {
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
  @ViewChild('header') header: SoftwareHeaderComponent;
  dtTrigger = new Subject();
  sub: Subscription = new Subscription();
  constructor(private softwareListService: SoftwareListService,
    private toastr: ToastrService,
    private deviceDetailService: DeviceDetailService,
    private hardwareService: HardwareService,
    private router: Router,
    private excelService: ExcelService,
    private modalService: NgbModal,
    private confirmStateService: ConfirmStateService,
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
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_SOFTWARE) this.deleteSoftware();
      }
    })
    this.sub.add(getConfirm);
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

  selectedRecord(flag: string, index) {
    if (flag == 'single') {
      if (this.softwareList[index].checked === true) {
        this.selectedList.push(index);
      } else {
        this.selectedList.splice(this.selectedList.indexOf(index), 1);
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

  // openModal (template: TemplateRef<any>, id) {
  //   if (this.selectedList.length === 0 && id !== '') {
  //     this.selectedList.push(id);
  //   }
  //   this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  // }

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

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.dtTrigger.unsubscribe();
  }
  onDeleteSoftware() {
    this.confirmStateService.setConfirmAction(DELETE_SOFTWARE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Are you sure you want to remove this software?`;
  }
}
