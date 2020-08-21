import { Component, OnInit } from '@angular/core';
import { HardwareService } from './../_services/hardware.service';
import { DeviceDetailService } from './../_services/device_detail.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CommonHttpServices } from '../_services/common_http.service';
import { ExcelService } from '../_services/download_csv.service';
import { CONFIGCONSTANTS } from '../config/app-constants';
import { Router } from '@angular/router';
import * as moment from "moment";
import { System, Graphics, Motherboard, Bios, Processor, Display, LogicalDisk, Memory, Adapter, DeviceDetail } from './class/system';
declare var $:any;
@Component({
  selector: 'app-hardware',
  templateUrl: './hardware.component.html',
  styleUrls: ['./hardware.component.scss']
})
export class HardwareComponent implements OnInit {
  
  companyUuid: string = '';
  hardwareDetail: object ={};
  system: System;
  graphics: Graphics;
  motherBoard: Motherboard;
  bios: Bios;
  display: Display;
  logicalDisks: LogicalDisk;
  memory: Memory; 
  networkAdapters: Adapter;
  processors: Processor;
  deviceName: string = '';
  externalIp: string = '';
  deviceDetail: DeviceDetail;
  loading: boolean = false;
  limit: number = 15;
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
  DateTimeFormat = CONFIGCONSTANTS.DateTimeFormat;
  constructor(private hardwareService: HardwareService, private toastr: ToastrService,
				 private commonHttpServices: CommonHttpServices, 
         private deviceDetailService: DeviceDetailService,
         private router: Router,
         private excelService: ExcelService) {}

  ngOnInit() {

    // $('main').css('margin-right', '64px')
    if(localStorage.getItem('type') === 'printer') {
      this.router.navigate(['/ng2/device/dashboard']);
    }
    this.deviceDetail = JSON.parse(localStorage.getItem('deviceDetail'));
    this.hardwareDetail = this.deviceDetailService.getDevice();
    if (Object.keys(this.hardwareDetail).length === 0) {
      this.getDeviceDetail();
    } else {
      this.setData();
      this.getPdfData();
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
        this.getPdfData();
        this.loading = false;
      },
      error => {
      this.loading = false;
      this.toastr.error('Something went wrong please try again.');
      }
    );
  }

  setData () {
    this.system = this.hardwareDetail['reports'][0].system || {};
    this.deviceName = this.hardwareDetail['reports'][0].deviceName;
    this.graphics = this.hardwareDetail['reports'][0].videoCards[0] || {};
    this.motherBoard = this.hardwareDetail['reports'][0].motherboard || {};
    this.bios = this.hardwareDetail['reports'][0].bios || {};
    this.display = this.hardwareDetail['reports'][0].monitors[0] || {};
    this.logicalDisks = this.hardwareDetail['reports'][0].logicalDisks.filter(value => value.is_system === true)[0] || {};
    this.processors = this.hardwareDetail['reports'][0].processors[0] || {};
    this.memory = this.hardwareDetail['reports'][0].ram.slots[0] || {};
    this.networkAdapters = this.hardwareDetail['reports'][0].networkAdapters.filter(value => value.ip_enabled === true)[0] || {};
    this.externalIp = this.hardwareDetail['reports'][0].externalIp || {};

    this.printSystem = [
      ['Manufacturer', this.system['manufacturer'] || 'N/A'],
      ['Computer Model', this.system['model'] || 'N/A'],
      ['Computer Name', this.deviceName || 'N/A'],
      ['System Type', this.system['architecture'] != undefined ? '(' + this.system['architecture'] + ') system' : 'N/A'],
      ['Warranty', this.system['warranty'] || 'N/A']
    ];
    this.printMotherBoard = [
      ['Manufacturer', this.motherBoard['manufacturer'] || 'N/A'],
      ['Model', this.motherBoard['serial_number'] || 'N/A'],
      ['BIOS Manufacturer', this.bios['manufacturer'] || 'N/A'],
      ['BIOS Model', 'BIOS Date ' + (this.bios['release_date'] || 'N/A') + ' Version: ' + (this.bios['version'] || 'N/A')]
    ];
    this.printProcessor = [
      ['Model', this.processors['name'] || 'N/A'],
      ['Clock Speed', 'N/A'],
      ['Socket & Cache(s)', 'N/A']
    ];
    this.printMemory = [
      ['Memory', this.memory['capacity'] != undefined ? (this.memory['capacity']/1024/1024) + ' MB RAM' : 'N/A']
    ];
    this.printNetwork = [
      ['Model(s)', this.networkAdapters['description'] || 'N/A'],
      ['IP', this.networkAdapters['ip_address'] || 'N/A'],
      ['Subnet Mask', this.networkAdapters['subnet'] || 'N/A'],
      ['Preferred DNS Server', this.networkAdapters['dns'] || 'N/A'],
      ['Link Speed', this.networkAdapters['speed'] != undefined ? (this.networkAdapters['speed']/1000000) + ' (MegaBit)' : 'N/A'],
      ['External IP', this.externalIp || 'N/A'],
      ['MAC', this.formatMacAddress(this.networkAdapters['mac']) || 'N/A'],
      ['DHCP', this.networkAdapters['dhcp_server'] || 'N/A'],
    ];
    this.printGraphic = [
      ['Model', this.graphics['hardwareDeviceName'] || 'N/A'],
      ['Video Processor', 'N/A'],
      ['Memory Size', this.graphics['memory'] != undefined ? (this.graphics['memory']/1024/1024) + ' MB VRAM' : 'N/A'],
      ['Driver', 'version ' + this.graphics['driverVersion']]
    ];
    this.printDisplay = [
      ['Manufacturer', this.display['manufacturer'] || 'N/A'],
      ['Model', this.display['name'] || 'N/A'],
      ['Color Depth', 'N/A'],
      ['Refresh Rate', 'N/A']
    ];
    this.printDisk = [
      ['Model', this.logicalDisks['device_id'] || 'N/A'],
      ['File Format(s)', 'NTFS ' + this.logicalDisks['device_id']],
      ['Size', this.logicalDisks['size'] != undefined ? (this.logicalDisks['size']/1024/1024) + ' GB' : 'N/A'],
      ['Free Space', this.logicalDisks['free_space'] != undefined ? (this.logicalDisks['free_space']/1024/1024) + ' GB' : 'N/A']
    ];
    this.printOS = [
      ['Name', this.system['caption'] || 'N/A'],
      ['IP', this.networkAdapters['ip_address'] || 'N/A'],
      ['Version', this.system['version'] || 'N/A'],
      ['Service Pack', this.system['service_pack'] || 'N/A']
    ];
  }

  formatMacAddress = function (mac: any) {
    if(mac) {
      return mac.match(/.{1,2}/g).join(' ');  
    } else {
      return 'N/A';
    }
    
  };

  downloadCsv(){
    let downloadCsvList = [];
    downloadCsvList.push({label: 'Computer', value: ''});
    this.printSystem.forEach(element => {
      downloadCsvList.push({label: element[0], value: element[1]});
    });
    downloadCsvList.push({label: '', value: ''});
    downloadCsvList.push({label: 'Motherboard', value: ''});
    this.printMotherBoard.forEach(element => {
      downloadCsvList.push({label: element[0], value: element[1]})
    });
    downloadCsvList.push({label: '', value: ''});
    downloadCsvList.push({label: 'Processor', value: ''});
    this.printProcessor.forEach(element => {
      downloadCsvList.push({label: element[0], value: element[1]})
    });
    downloadCsvList.push({label: '', value: ''});
    downloadCsvList.push({label: 'Memory', value: ''});
    this.printMemory.forEach(element => {
      downloadCsvList.push({label: element[0], value: element[1]})
    });
    downloadCsvList.push({label: '', value: ''});
    downloadCsvList.push({label: 'Network Card', value: ''});
    this.printNetwork.forEach(element => {
      downloadCsvList.push({label: element[0], value: element[1]})
    });
    downloadCsvList.push({label: '', value: ''});
    downloadCsvList.push({label: 'Graphics Card', value: ''});
    this.printGraphic.forEach(element => {
      downloadCsvList.push({label: element[0], value: element[1]})
    });
    downloadCsvList.push({label: '', value: ''});
    downloadCsvList.push({label: 'Display', value: ''});
    this.printDisplay.forEach(element => {
      downloadCsvList.push({label: element[0], value: element[1]})
    });
    downloadCsvList.push({label: '', value: ''});
    downloadCsvList.push({label: 'Hard Disk', value: ''});
    this.printDisk.forEach(element => {
      downloadCsvList.push({label: element[0], value: element[1]})
    });
    downloadCsvList.push({label: '', value: ''});
    downloadCsvList.push({label: 'Operating System', value: ''});
    this.printOS.forEach(element => {
      downloadCsvList.push({label: element[0], value: element[1]})
    });
    let fileName = 'Hardware Detail';
    this.excelService.generateExcel(downloadCsvList, fileName, 'hardware');
  }

  getPdfData() {
    let html = `
    <style>
    * {
      padding: 0;
      margin: 0;
    }
    body {
      padding: 0;
      margin: 0;
      -ms-box-sizing: border-box;
      -o-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      font-weight: normal;
      font-style: normal;
      line-height: 1.33;
      letter-spacing: normal;
      color: #4f5f79;
      background-color: #f3f7f9;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    ul,
    li,
    ol {
      padding: 0;
      margin: 0;
    }
    a {
      text-decoration: none;
      border: none;
    }
    img {
      border: none;
      outline: none;
    }

    .container{
      width: 100%;
      margin: 0 auto;
      max-width:95%;
      padding:0 20px;
    }
    table{
      border-collapse: collapse;
      width: 100%;
    }
    </style>  
    <body>
    <div class="container" style="width: 960px;margin: 0 auto;max-width:95%;padding:0 20px;">
      <table style="width: 100%;border-collapse: collapse;border: solid 1px #dfe3e8;table-layout:fixed;">
        <thead style="width: 100%;font-family: Arial, Helvetica, sans-serif;">
          <tr style="width: 100%;font-family: Arial, Helvetica, sans-serif;">
          <th style="width:100px;text-align: left;color: #fff;padding: 15px 24px 15px;vertical-align: middle;font-family: Arial, Helvetica, sans-serif;background-color: #fff;">
              <img src="/file/${localStorage.getItem('imId')}.jpg" alt="Logo" title="logo" style="max-width:100px;height:auto;"/>
          </th>  
            <th style="text-align:left;font-size: 16px;line-height: 1.33;color: #000;padding:15px 0 15px 70px;vertical-align: middle;font-family: Arial, Helvetica, sans-serif;background-color: #fff;">
               <div class="reports-head" style="width:585px;text-align:center;color: #364656;margin-left:-105px;">
                    <p style="margin:0;line-height:1.2;color:#364656;font-size:16px;font-family: Arial, Helvetica, sans-serif;font-weight:600;">` + localStorage.getItem('currentCompanyName') + ` - Hardware Summary Report</p>
                    <p style="line-height:1.5;color:#364656;margin:3px 0;font-size: 13px;font-family: Arial, Helvetica, sans-serif;font-weight:400;">Summary of ` + this.deviceName + ` hardware installed (9 items)</p>
                    <p style="margin:0;line-height:1;color:#4f5f79;font-size:11px;line-height: 1.09;font-family: Arial, Helvetica, sans-serif;font-weight:400;">Generated on ` + moment(new Date()).format('LL') + ` @ ` + moment(new Date()).format('LT') + `</p>
               </div>   
            </th> 
          </tr> 
        </thead>
        <tbody style="background-color: #f3f7f9;">
          <tr style="width: 100%;">
            <td colspan="2" style="width: 100%;padding: 24px;">
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;margin-bottom: 8px;table-layout:fixed;">
              <thead>
                  <tr>
                      <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Computer</th>
                  </tr>
              </thead>
              <tbody>`
              this.printSystem.forEach(element => {
                html = html + `<tr style="width: 100%;">`;
                html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` + element[0] + `</td>`;
                html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` + element[1] + `</td></tr>`
              });
              html = html + `</tbody>
            </table>
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;margin-bottom: 8px;table-layout:fixed;">
              <thead>
                  <tr>
                      <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Motherboard</th>
                  </tr>
              </thead>
              <tbody>`
              this.printMotherBoard.forEach(element => {
                html = html + `<tr style="width: 100%;">`;
                html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` + element[0] + `</td>`;
                html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` + element[1] + `</td></tr>`
              });
              html = html + `</tbody>
            </table>
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;margin-bottom: 8px;table-layout:fixed;">
              <thead>
                  <tr>
                      <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Processor</th>
                  </tr>
              </thead>
              <tbody>`
              this.printProcessor.forEach(element => {
                html = html + `<tr style="width: 100%;">`;
                html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` + element[0] + `</td>`;
                html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` + element[1] + `</td></tr>`
              });
              html = html + `</tbody>
            </table>
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;margin-bottom: 8px;table-layout:fixed;">
              <thead>
                  <tr>
                      <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Memory</th>
                  </tr>
              </thead>
              <tbody>`
              this.printMemory.forEach(element => {
                html = html + `<tr style="width: 100%;">`;
                html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` + element[0] + `</td>`;
                html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` + element[1] + `</td></tr>`
              });
              html = html + `</tbody>
            </table>
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;margin-bottom: 8px;table-layout:fixed;">
              <thead>
                  <tr>
                      <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Network Card</th>
                  </tr>
              </thead>
              <tbody>`
              this.printNetwork.forEach(element => {
                html = html + `<tr style="width: 100%;">`;
                html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` + element[0] + `</td>`;
                html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` + element[1] + `</td></tr>`
              });
              html = html + `</tbody>
            </table>
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;margin-bottom: 8px;table-layout:fixed;">
              <thead>
                  <tr>
                      <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Graphics Card</th>
                  </tr>
              </thead>
              <tbody>`
              this.printGraphic.forEach(element => {
                html = html + `<tr style="width: 100%;">`;
                html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` + element[0] + `</td>`;
                html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` + element[1] + `</td></tr>`
              });
              html = html + `</tbody>
            </table>
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;margin-bottom: 8px;table-layout:fixed;">
              <thead>
                  <tr>
                      <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Display</th>
                  </tr>
              </thead>
              <tbody>`
              this.printDisplay.forEach(element => {
                html = html + `<tr style="width: 100%;">`;
                html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` + element[0] + `</td>`;
                html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` + element[1] + `</td></tr>`
              });
              html = html + `</tbody>
            </table>
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;margin-bottom: 8px;table-layout:fixed;">
              <thead>
                  <tr>
                      <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Hard Disk</th>
                  </tr>
              </thead>
              <tbody>`
              this.printDisk.forEach(element => {
                html = html + `<tr style="width: 100%;">`;
                html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` + element[0] + `</td>`;
                html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` + element[1] + `</td></tr>`
              });
              html = html + `</tbody>
            </table>
            <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;table-layout:fixed;">
              <thead>
                  <tr>
                      <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 100%;" colspan="2">Operating System</th>
                  </tr>
              </thead>
              <tbody>`
              this.printOS.forEach(element => {
                html = html + `<tr style="width: 100%;">`;
                html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 16.7%;">` + element[0] + `</td>`;
                html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;font-weight: bold;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 83.3%;">` + element[1] + `</td></tr>`
              });
              html = html + `</tbody>
            </table>
     </td>
   </tr>

 </tbody>
 <tfoot style="width: 100%;">
          <tr style="width: 100%;">
            <td style="width: 100%;" colspan="2">
              <table style="width: 100%;border-collapse: collapse;table-layout:fixed;">
                <tr>
                  <td style="width: 33.33%;color: #4f5f79;font-size: 12px;font-family: Arial, Helvetica, sans-serif;padding: 8px 24px;line-height: 1.33;background-color: #fff;text-align: left;vertical-align: middle;">Report Prepare by: ` + localStorage.getItem('currentUser') + `</td>
                  <td style="width: 33.33%;color: #4f5f79;font-size:12px;font-family: Arial, Helvetica, sans-serif;padding: 8px 24px;line-height: 1.33;background-color: #fff;text-align: center;vertical-align: middle;">` + localStorage.getItem('currentCompanyName') + `</td>
                  <td style="width: 33.33%;color: #4f5f79;font-size: 12px;font-family: Arial, Helvetica, sans-serif;padding: 8px 24px;line-height: 1.33;background-color: #fff;text-align: right;vertical-align: middle;">Quicktech 2020 ©. All rights reserved</td>
               </tr>
              </table>
            </td> 
          </tr>
        </tfoot>
 </table>
        </div>
        </body>`;
    let data = {
      content: html,
      id: '',
      fileName: 'Hardware Summary Report',
      orientation:'PORTRAIT'
    };
    this.loading = true;
    this.commonHttpServices.printPdf(data)
    .pipe()
    .subscribe(data => {
      this.loading = false;
      this.pdfUrl = data.url;
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

  printPdf() {
    window.open(this.pdfUrl, '_blank');
  }

  saveLabel() {
    this.deviceName = this.deviceName.toUpperCase();
    const data = {
      agentId: localStorage.getItem('agentId'),
      companyId: localStorage.getItem('company_id'),
      newLabelValue: this.deviceName
    }
    this.hardwareService.saveDeviceName(data)
    .pipe(first())
    .subscribe(
      resp => {
        $('#head-label').text(this.deviceName);
        let obj = JSON.parse(localStorage.getItem('deviceDetail'));
        obj.label = this.deviceName;
        localStorage.setItem('deviceDetail', JSON.stringify(obj));
      },
      error => {
        this.toastr.error('Something went wrong please try again.');
      }
    );
  }

}
