import { Component, OnInit, OnDestroy } from '@angular/core';
import {formatDate} from '@angular/common';
import { SoftwareListService } from './../_services/software-list.service';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetailService } from './../_services/device_detail.service';
import { CommonHttpServices } from './../_services/common_http.service';
import { ExcelService } from './../_services/download_csv.service';
import { first } from 'rxjs/operators';
import { HardwareService } from '../_services/hardware.service';
import { CONFIGCONSTANTS } from '../config/app-constants';
import { Router } from '@angular/router';
import { Subject } from "rxjs";
declare var $:any;

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})
export class SoftwareComponent implements OnInit, OnDestroy {

  url = 'http://localhost:4200/upload';
  formData: FormData;
  loading = false;
  myDateValue: Date;
  check_all = false;
  selectedList: any[] = [];
  softwareList: any[] = [];
  humanizeBytes: Function;
  dragOver: boolean;
  deviceDetail: any = {};
  pdfUrl = '';
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
        orderable: false
      }, {
        data: 'softInstalledOn',
        orderable: true
      }, {
        data: 'softVersion',
        orderable: false
      }]
  };
  dtTrigger = new Subject();
  constructor(private softwareListService: SoftwareListService,
      private toastr: ToastrService,
      private deviceDetailService: DeviceDetailService,
      private hardwareService: HardwareService,
      private router: Router,
      private excelService: ExcelService,
      private commonHttpServices: CommonHttpServices) {
  }

  ngOnInit() {
    // if (window.innerWidth <= 1440) {
    //   $('main').css('margin-right', '64px')
    // } else {
    //   $('main').css('margin-right', '352px')
    // }
    
    if(localStorage.getItem('type') === 'printer') {
      this.router.navigate(['/ng2/device/dashboard']);
    }
    this.myDateValue = new Date();
    this.deviceDetail = JSON.parse(localStorage.getItem('deviceDetail'));
    if (Object.keys(this.deviceDetailService.getDevice()).length === 0) {
      this.getDeviceDetail();
    } else {
      let temp = this.deviceDetailService.getDevice();
      this.softwareList = temp['reports'][0]['softList'];
      this.getPdfData();
      this.dtTrigger.next();
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
        this.dtTrigger.next();
        this.getPdfData();
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

  decline () {
    this.selectedList = [];
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  downloadCsv(){
    let downloadCsvList = [];
    this.softwareList.forEach(element => {
      downloadCsvList.push({
        'Software Name': element.softName || 'N/A',
        'Publisher': element.softPublisher || 'N/A',
        'Version': element.softVersion || 'N/A',
        'Installed On': element.softInstalledOn || 'N/A',
        'Current Version': element.softVersion || 'N/A'
      });
    });
    let fileName = 'Software List';
    this.excelService.generateExcel(downloadCsvList, fileName, 'software');
  }

  getPdfData() {
    let pdfList = [];
    this.softwareList.forEach(element => {
      pdfList.push([
        element.softName.replace(',', ' ') || 'N/A',
        element.softPublisher.replace(',', ' ') || 'N/A',
        element.softVersion || 'N/A',
        element.softInstalledOn || 'N/A',
        element.softVersion || 'N/A'
      ]);
    });
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
      max-width: 960px;
      margin: 0 auto;
    }
    table{
      border-collapse: collapse;
      width: 100%;
    }</style>
    <body>
    <div class="container" style="width: 960px;margin: 0 auto;">
      <table style="width: 100%;border-collapse: collapse;border: solid 1px #dfe3e8;">
        <thead style="width: 100%;font-family: Arial, Helvetica, sans-serif;">
          <tr style="width: 100%;font-family: Arial, Helvetica, sans-serif;">
            <th style="width: 50%;text-align: left;font-size:16px;line-height: 1.33;color: #fff;padding: 17px 24px;vertical-align: middle;font-family: Arial, Helvetica, sans-serif;background-color: #364656;text-transform: capitalize;">
              Software Summary Report - ` + localStorage.getItem('currentCompanyName') + `
            </th>
            <th style="width: 50%;text-align: right;font-size: 16px;line-height: 1.33;color: #fff;padding: 17px 24px;vertical-align: middle;font-family: Arial, Helvetica, sans-serif;background-color: #364656;">
              <div style="display: block;font-size: 11px;color: #ffffff;line-height: 1;">`;
    html = html + (this.deviceDetail.label || this.deviceDetail.hostName || this.deviceDetail.ip) + `</div>
              <div style="display: block;font-size: 11px;color: #ffffff;font-family: Arial, Helvetica, sans-serif;line-height: 1;">` + formatDate(new Date(), 'yyyy-MM-dd', 'en') + `</div>

            </th>
          </tr>
        </thead>
        <tbody style="background-color: #f3f7f9;">
          <tr style="width: 100%;">
            <td colspan="2" style="width: 100%;padding: 24px;">
               <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;">
                    <thead>
                        <tr>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 13px 12px;text-align: left;width: 40%;">Software Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 13px 12px;text-align: left;width: 20%;">Publisher</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 13px 12px;text-align: left;width: 14%;">Version</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 13px 12px;text-align: left;width: 12%;">Installed on</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 13px 12px;text-align: left;width: 14%;">Current Version</th>
                        </tr>
                    </thead>
                    <tbody>`;
        pdfList.forEach(element => {
          html = html + `<tr style="width: 100%;">
          <td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 12px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 13px 12px;text-align: left;width: 40%;vertical-align: top;">` + element[0] + `</td>`;
          html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 12px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 13px 12px;text-align: left;width: 20%;vertical-align: top;">` + element[1] +`</td>`;
          html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 12px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 13px 12px;text-align: left;width: 14%;vertical-align: top;">` + element[2] + `</td>`;
          html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 12px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 13px 12px;text-align: left;width: 12%;vertical-align: top;">` + element[3] + `</td>`;
          html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 12px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 13px 12px;text-align: left;width: 14%;vertical-align: top;">` + element[4] + `</td></tr>`
        });
        html = html + `</tbody>
        </table>
     </td>
   </tr>

 </tbody>
 <tfoot style="width: 100%;">
          <tr style="width: 100%;">
            <td style="width: 100%;" colspan="2">
              <table style="width: 100%;border-collapse: collapse;">
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
      fileName: 'Software Summary Report',
      orientation: 'LANDSCAPE'
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



}
