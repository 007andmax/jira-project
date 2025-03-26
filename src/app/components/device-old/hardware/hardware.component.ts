import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HardwareService } from './../_services/hardware.service';
import { DeviceDetailService } from './../_services/device_detail.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CommonHttpServices } from '../_services/common_http.service';
import { ExcelService } from '../_services/download_csv.service';
import { CONFIGCONSTANTS } from '../config/app-constants';
import { Router } from '@angular/router';
import { System, Graphics, Motherboard, Bios, Processor, Display, LogicalDisk, Memory, Adapter, DeviceDetail } from './class/system';
import { HardwareHeaderComponent } from './hardware-header/hardware-header.component';
declare var $: any;
@Component({
  selector: 'app-hardware',
  templateUrl: './hardware.component.html',
  styleUrls: ['./hardware.component.scss']
})
export class HardwareComponent implements OnInit {

  hardwareDetail: object = {};
  system: System;
  graphics: Graphics;
  motherBoard: Motherboard;
  bios: Bios;
  display: Display;
  logicalDisks: LogicalDisk;
  memory: Array<Memory> = [];
  networkAdapters: Adapter;
  processors: Processor;
  deviceName: string = '';
  externalIp: string = '';
  deviceDetail: DeviceDetail;
  loading: boolean = false;
  printSystem: Array<Array<string>>;
  printMotherBoard: Array<Array<string>>;
  printProcessor: Array<Array<string>>;
  printMemory: Array<Array<string>>;
  printNetwork: Array<Array<string>>;
  printGraphic: Array<Array<string>>;
  printDisplay: Array<Array<string>>;
  printDisk: Array<Array<string>>;
  printOS: Array<Array<string>>;
  pdfUrl: string = '';
  _id: string = '';
  type: string = '';
  WindowsLicenseKey: string;
  DateTimeFormat = CONFIGCONSTANTS.DateTimeFormat;
  @ViewChild('header', { static: true }) header: HardwareHeaderComponent;
  constructor(private hardwareService: HardwareService,
    private toastr: ToastrService,
    private deviceDetailService: DeviceDetailService,
    private router: Router,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.type = window.location.href.split('/')[window.location.href.split('/').length - 2];
    this._id = window.location.href.split('/')[window.location.href.split('/').length - 1];
    // $('main').css('margin-right', '64px')
    if (this.type === 'printer') {
      this.router.navigate([`/ng2/device/dashboard/${this.type}/${this._id}`]);
    }
    this.deviceDetail = JSON.parse(localStorage.getItem('deviceDetail_' + this._id));
    this.hardwareDetail = this.deviceDetailService.getDevice();
    if (Object.keys(this.hardwareDetail).length === 0) {
      this.getDeviceDetail();
    } else {
      this.setData();
      this.cd.detectChanges();
      this.header.getPdfData();
    }

  }

  getDeviceDetail() {

    this.loading = true;
    this.hardwareService.getAllHardwareList(localStorage.getItem('company_id'), this.deviceDetail['agentId'])
      .pipe(first())
      .subscribe(
        resp => {
          this.deviceDetailService.addDevice(resp);
          this.hardwareDetail = this.deviceDetailService.getDevice();
          this.setData();
          this.cd.detectChanges();
          this.header.getPdfData();
          this.loading = false;
        },
        error => {
          this.loading = false;
          this.toastr.error('Something went wrong please try again.');
        }
      );
  }

  setData() {
    this.system = this.hardwareDetail['reports'][0].system || {};
    this.deviceName = this.hardwareDetail['reports'][0].deviceName;
    this.graphics = this.hardwareDetail['reports'][0].videoCards[0] || {};
    this.motherBoard = this.hardwareDetail['reports'][0].motherboard || {};
    this.bios = this.hardwareDetail['reports'][0].bios || {};
    this.display = this.hardwareDetail['reports'][0].monitors[0] || {};
    this.logicalDisks = this.hardwareDetail['reports'][0].logicalDisks.filter(value => value.isSystem === true)[0] || {};
    this.processors = this.hardwareDetail['reports'][0].processors[0] || {};
    this.memory = this.hardwareDetail['reports'][0].ram.slots || {};
    this.networkAdapters = this.hardwareDetail['reports'][0].networkAdapters.filter(value => value.ipEnabled === true)[0] || {};
    this.externalIp = this.hardwareDetail['reports'][0].externalIp || {};
    this.WindowsLicenseKey = this.hardwareDetail['reports'][0].WindowsLicenseKey || {};

    this.printSystem = [
      ['Manufacturer', this.system['manufacturer'] || 'N/A'],
      ['Computer Model', this.system['model'] || 'N/A'],
      ['Computer Name', this.deviceName || 'N/A'],
      ['System Type', this.system['architecture'] != undefined ? '(' + this.system['architecture'] + ') system' : 'N/A'],
      ['Warranty', this.system['warranty'] || 'N/A']
    ];
    this.printMotherBoard = [
      ['Manufacturer', this.motherBoard['manufacturer'] || 'N/A'],
      ['Model', this.motherBoard['serialNumber'] || 'N/A'],
      ['BIOS Manufacturer', this.bios['manufacturer'] || 'N/A'],
      ['BIOS Model', 'BIOS Date ' + (this.bios['releaseDate'] || 'N/A') + ' Version: ' + (this.bios['version'] || 'N/A')]
    ];
    this.printProcessor = [
      ['Model', this.processors['name'] || 'N/A'],
      ['Clock Speed', 'N/A'],
      ['Socket & Cache(s)', 'N/A']
    ];
    this.printMemory = [
      ['Memory', this.memory[0]['capacity'] != undefined ? (this.memory[0]['capacity'] / 1024 / 1024) + ' MB RAM' : 'N/A']
    ];
    this.printNetwork = [
      ['Model(s)', this.networkAdapters['description'] || 'N/A'],
      ['IP', this.networkAdapters['ipAddress'] || 'N/A'],
      ['Subnet Mask', this.networkAdapters['subnet'] || 'N/A'],
      ['Preferred DNS Server', this.networkAdapters['dns'] || 'N/A'],
      ['Link Speed', this.networkAdapters['speed'] != undefined ? (this.networkAdapters['speed'] / 1000000) + ' (MegaBit)' : 'N/A'],
      ['External IP', this.externalIp || 'N/A'],
      ['MAC', this.formatMacAddress(this.networkAdapters['mac']) || 'N/A'],
      ['DHCP', this.networkAdapters['dhcpServer'] || 'N/A'],
    ];
    this.printGraphic = [
      ['Model', this.graphics['hardwareDeviceName'] || 'N/A'],
      ['Video Processor', 'N/A'],
      ['Memory Size', this.graphics['memory'] != undefined ? (this.graphics['memory'] / 1024 / 1024) + ' MB VRAM' : 'N/A'],
      ['Driver', 'version ' + this.graphics['driverVersion']]
    ];
    this.printDisplay = [
      ['Manufacturer', this.display['manufacturer'] || 'N/A'],
      ['Model', this.display['name'] || 'N/A'],
      ['Color Depth', 'N/A'],
      ['Refresh Rate', 'N/A']
    ];
    this.printDisk = [
      ['Model', this.logicalDisks['deviceId'] || 'N/A'],
      ['File Format(s)', 'NTFS ' + this.logicalDisks['deviceId']],
      ['Size', this.logicalDisks['size'] != undefined ? (this.logicalDisks['size'] / 1024 / 1024) + ' GB' : 'N/A'],
      ['Free Space', this.logicalDisks['freeSpace'] != undefined ? (this.logicalDisks['freeSpace'] / 1024 / 1024) + ' GB' : 'N/A']
    ];
    this.printOS = [
      ['Name', this.system['caption'] || 'N/A'],
      ['IP', this.networkAdapters['ipAddress'] || 'N/A'],
      ['Version', this.system['version'] || 'N/A'],
      ['Service Pack', this.system['servicePack'] || 'N/A'],
      ['Windows key', this.WindowsLicenseKey || 'N/A']
    ];
  }

  formatMacAddress = function (mac: any) {
    if (mac) {
      return mac.match(/.{1,2}/g).join(' ');
    } else {
      return 'N/A';
    }

  };








}
