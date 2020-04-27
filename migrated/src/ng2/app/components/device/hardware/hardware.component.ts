import { Component, OnInit } from '@angular/core';
import { HardwareService } from './../_services/hardware.service';
import { DeviceDetailService } from './../_services/device_detail.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CommonHttpServices } from '../_services/common_http.service';
import { ExcelService } from '../_services/download_csv.service';
import { CommonServices } from '../_services/common.service';
import { CONFIGCONSTANTS } from '../config/app-constants';
import { Router } from '@angular/router';

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
         private deviceDetailService: DeviceDetailService,
         private router: Router,
         private excelService: ExcelService) {}

  ngOnInit() {
    if(localStorage.getItem('type') === 'printer') {
      this.router.navigate(['/ng2/device/dashboard']);
    }
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
	this.system = this.hardwareDetail.reports[0].system || {};
	this.deviceName = this.hardwareDetail.reports[0].deviceName;
	this.graphics = this.hardwareDetail.reports[0].videoCards[0] || {};
	this.motherBoard = this.hardwareDetail.reports[0].motherboard || {};
	this.bios = this.hardwareDetail.reports[0].bios || {};
	this.display = this.hardwareDetail.reports[0].monitors[0] || {};
	this.logicalDisks = this.hardwareDetail.reports[0].logicalDisks.filter(value => value.is_system === true)[0] || {};
	this.processors = this.hardwareDetail.reports[0].processors[0] || {};
	this.memory = this.hardwareDetail.reports[0].ram.slots[0] || {};
	this.networkAdapters = this.hardwareDetail.reports[0].networkAdapters.filter(value => value.ip_enabled === true)[0] || {};
	this.externalIp = this.hardwareDetail.reports[0].externalIp || {};
  }

  formatMacAddress = function (mac) {
    if(mac) {
      return mac.match(/.{1,2}/g).join(' ');  
    } else {
      return 'N/A';
    }
    
  };

  downloadCsv(){
    let downloadCsvList = [];
    let system = [
      ['Manufacturer', this.system.manufacturer || 'N/A'],
      ['Computer Model', this.system.model || 'N/A'],
      ['Computer Name', this.deviceName || 'N/A'],
      ['System Type', this.system.architecture != undefined ? '(' + this.system.architecture + ') system' : 'N/A'],
      ['Warranty', this.system.warranty || 'N/A']
    ];
    let motherBoard = [
      ['Manufacturer', this.motherBoard.manufacturer || 'N/A'],
      ['Model', this.motherBoard.serial_number || 'N/A'],
      ['BIOS Manufacturer', this.bios.manufacturer || 'N/A'],
      ['BIOS Model', 'BIOS Date ' + (this.bios.release_date || 'N/A') + ' Version: ' + (this.bios.version || 'N/A')]
    ];
    let processor = [
      ['Model', this.processors.name || 'N/A'],
      ['Clock Speed', 'N/A'],
      ['Socket & Cache(s)', 'N/A']
    ];
    let memory = [
      ['Memory', this.memory.capacity != undefined ? (this.memory.capacity/1024/1024) + ' MB RAM' : 'N/A']
    ];
    let network = [
      ['Model(s)', this.networkAdapters.description || 'N/A'],
      ['IP', this.networkAdapters.ip_address || 'N/A'],
      ['Subnet Mask', this.networkAdapters.subnet || 'N/A'],
      ['Preferred DNS Server', this.networkAdapters.dns || 'N/A'],
      ['Link Speed', this.networkAdapters.speed != undefined ? (this.networkAdapters.speed/1000000) + ' (MegaBit)' : 'N/A'],
      ['External IP', this.externalIp || 'N/A'],
      ['MAC', this.formatMacAddress(this.networkAdapters.mac) || 'N/A'],
      ['DHCP', this.networkAdapters.dhcp_server || 'N/A'],
    ];
    let graphic = [
      ['Model', this.graphics.hardwareDeviceName || 'N/A'],
      ['Video Processor', 'N/A'],
      ['Memory Size', this.graphics.memory != undefined ? (this.graphics.memory/1024/1024) + ' MB VRAM' : 'N/A'],
      ['Driver', 'version ' + this.graphics.driverVersion]
    ];
    let display = [
      ['Manufacturer', this.display.manufacturer || 'N/A'],
      ['Model', this.display.name || 'N/A'],
      ['Color Depth', 'N/A'],
      ['Refresh Rate', 'N/A']
    ];
    let disk = [
      ['Model', this.logicalDisks.device_id || 'N/A'],
      ['File Format(s)', 'NTFS ' + this.logicalDisks.device_id],
      ['Size', this.logicalDisks.size != undefined ? (this.logicalDisks.size/1024/1024) + ' GB' : 'N/A'],
      ['Free Space', this.logicalDisks.free_space != undefined ? (this.logicalDisks.free_space/1024/1024) + ' GB' : 'N/A']
    ];
    let os = [
      ['Name', this.system.caption || 'N/A'],
      ['IP', this.networkAdapters.ip_address || 'N/A'],
      ['Version', this.system.version || 'N/A'],
      ['Service Pack', this.system.service_pack || 'N/A']
    ];
    downloadCsvList = [system, motherBoard, processor, memory, network, graphic, display, disk, os];
    let fileName = 'Hardware Detail';
    // const columnNames = [
    //   {name: 'Software Name', value: 'softName'},
    //   {name: 'Publisher', value: 'softPublisher'}, 
    //   {name: 'Version', value: 'softVersion'}, 
    //   {name: 'Installed on', value: 'softInstalledOn'}, 
    //   {name: 'Current Version', value: 'currentSoftVersion'}];
    this.excelService.generateHardwareExcel(downloadCsvList, fileName);
  }

}
