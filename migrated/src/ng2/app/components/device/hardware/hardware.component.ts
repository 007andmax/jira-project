import { Component, OnInit } from '@angular/core';
import { HardwareService } from './../_services/hardware.service';
import { DeviceDetailService } from './../_services/device_detail.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CommonHttpServices } from '../_services/common_http.service';
import { CommonServices } from '../_services/common.service';
import { CONFIGCONSTANTS } from '../config/app-constants';

@Component({
  selector: 'app-hardware',
  templateUrl: './hardware.component.html',
  styleUrls: ['./hardware.component.scss']
})
export class HardwareComponent implements OnInit {
  
  companyUuid: string = '';
  hardwareDetail: any ={};
  system: any = {};
  graphics: any = {};
  motherBoard: any = {};
  bios: any = {};
  processor: any = {};
  display: any = {};
  logicalDisks: any = {};
  memory: any = {};
  networkAdapters: any = {};
  processors: any = {};
  deviceName: string = '';
  externalIp: string = '';
  deviceDetail: any = {};
  masonryImages;
  loading = false;
	limit = 15;
  DateTimeFormat = CONFIGCONSTANTS.DateTimeFormat;
  constructor(private hardwareService: HardwareService, private toastr: ToastrService,
				 private commonHttpServices: CommonHttpServices, private commonServices: CommonServices,
				 private deviceDetailService: DeviceDetailService) {}

  ngOnInit() {
	this.deviceDetail = JSON.parse(localStorage.getItem('deviceDetail'));
	this.hardwareDetail = this.deviceDetailService.getDevice();
	if (Object.keys(this.hardwareDetail).length === 0) {
		this.getDeviceDetail();
	} else {
		this.setData();
	}
	
  }

  getDeviceDetail() {
	
    this.loading = true;
    this.hardwareService.getAllHardwareList(localStorage.getItem('company_id'), this.deviceDetail.agentId)
    .pipe(first())
    .subscribe(
      resp => {
        this.deviceDetailService.addDevice(resp);
        this.hardwareDetail = this.deviceDetailService.getDevice();
        this.setData();
        this.loading = false;
      },
      error => {
      this.loading = false;
      this.toastr.error('Something went wrong please try again.');
      }
    );
  }

  setData () {
	this.system = this.hardwareDetail.reports[0].system;
	this.deviceName = this.hardwareDetail.reports[0].deviceName;
	this.graphics = this.hardwareDetail.reports[0].videoCards[0];
	this.motherBoard = this.hardwareDetail.reports[0].motherboard;
	this.bios = this.hardwareDetail.reports[0].bios;
	this.display = this.hardwareDetail.reports[0].monitors[0];
	this.logicalDisks = this.hardwareDetail.reports[0].logicalDisks.filter(value => value.is_system === true)[0];
	this.processors = this.hardwareDetail.reports[0].processors[0];
	this.memory = this.hardwareDetail.reports[0].ram.slots[0];
	this.networkAdapters = this.hardwareDetail.reports[0].networkAdapters.filter(value => value.ip_enabled === true)[0] || {};
	this.externalIp = this.hardwareDetail.reports[0].externalIp;
  }

}
