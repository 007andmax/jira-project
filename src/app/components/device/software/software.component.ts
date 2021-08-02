import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
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
import { Subject } from "rxjs";
import * as moment from "moment";
import { environment } from './../../../../environments/environment';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})
export class SoftwareComponent implements OnInit, OnDestroy {

  url = environment.apiUrl + 'upload';
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
  pipe = new DatePipe('en-US');
  dtTrigger = new Subject();
  constructor(private softwareListService: SoftwareListService,
    private toastr: ToastrService,
    private deviceDetailService: DeviceDetailService,
    private hardwareService: HardwareService,
    private router: Router,
    private excelService: ExcelService,
    private companiesStateService: CompaniesStateService,
    private commonHttpServices: CommonHttpServices) {
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
      this.router.navigate([`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/device/dashboard/${this.type}/${this._id}`]);
    }
    this.myDateValue = new Date();
    this.deviceDetail = JSON.parse(localStorage.getItem('deviceDetail_' + this._id));
    if (Object.keys(this.deviceDetailService.getDevice()).length === 0) {
      this.getDeviceDetail();
    } else {
      let temp = this.deviceDetailService.getDevice();
      this.softwareList = temp['reports'][0]['softList'];
      setTimeout(() => {
        this.dtTrigger.next();
      }, 500);
      this.getPdfData();
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

  decline() {
    this.selectedList = [];
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  downloadCsv() {
    let downloadCsvList = [];
    this.softwareList.forEach(element => {
      downloadCsvList.push([
        element.softName.replace(',', ' ') || 'N/A',
        element.softPublisher.replace(',', ' ') || 'N/A',
        element.softVersion || 'N/A',
        element.softInstalledOn !== '' ? this.pipe.transform(new Date(element.softInstalledOn), this.DateFormat) : 'N/A',
        element.softVersion || 'N/A'
      ]);
    });
    let fileName = 'Software List';
    // const columnNames = [
    //   {name: 'Software Name', value: 'softName'},
    //   {name: 'Publisher', value: 'softPublisher'}, 
    //   {name: 'Version', value: 'softVersion'}, 
    //   {name: 'Installed on', value: 'softInstalledOn'}, 
    //   {name: 'Current Version', value: 'currentSoftVersion'}];
    const columnNames = ['Software Name', 'Publisher', 'Version', 'Installed on', 'Current Version'];
    this.excelService.generateExcel(downloadCsvList, columnNames, fileName);
  }

  getPdfData() {
    let pdfList = [];
    this.softwareList.forEach(element => {
      pdfList.push([
        element.softName.replace(',', ' ') || 'N/A',
        element.softPublisher.replace(',', ' ') || 'N/A',
        element.softVersion || 'N/A',
        element.softInstalledOn !== '' ? this.pipe.transform(new Date(element.softInstalledOn), this.DateFormat) : 'N/A',
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
      margin: 0 auto;
      max-width:95%;
      padding:0 20px;
    } 
    table{
      border-collapse: collapse;
      width: 100%;
      table-layout:fixed;
    }</style>
    <body> 
    <div class="container" style="width: 960px;margin: 0 auto;max-width:95%;padding:0 20px;">
      <table style="width: 100%;border-collapse: collapse;border: solid 1px #dfe3e8;table-layout:fixed;">
      <thead style="width: 100%;font-family: Arial, Helvetica, sans-serif;">
      <tr style="width: 100%;font-family: Arial, Helvetica, sans-serif;">
          <th style="width:100px;text-align: left;color: #fff;padding: 15px 24px 15px;vertical-align: middle;font-family: Arial, Helvetica, sans-serif;background-color: #fff;" >
              <img src="/file/${localStorage.getItem('imId')}.jpg" alt="Logo" title="logo" style="max-width:100px;height:auto;"/>
          </th> 
          <th align="left" style="text-align:left;font-size: 16px;line-height: 1.33;color: #000;padding:15px 0 15px 70px;vertical-align: middle;font-family: Arial, Helvetica, sans-serif;background-color: #fff;">
            <div class="reports-head" style="width:585px;text-align:center;color: #364656;float:left;margin-left:-105px;">
                  <p style="margin:0;line-height:1.2;color:#364656;font-size:16px;font-family: Arial, Helvetica, sans-serif;font-weight:600;">` + localStorage.getItem('currentCompanyName') + ` - Software Summary Report</p>
                  <p style="line-height:1.5;color:#364656;margin:3px 0;font-size: 13px;font-family: Arial, Helvetica, sans-serif;font-weight:400;">Summary of ` + this.deviceDetail.report.deviceName + ` softwares installed (` + pdfList.length + ` items)</p>
                  <p style="margin:0;line-height:1;color:#4f5f79;font-size:11px;line-height: 1.09;font-family: Arial, Helvetica, sans-serif;font-weight:400;">Generated on ` + moment(new Date()).format('LL') + ` @ ` + moment(new Date()).format('LT') + `</p>
            </div>    
          </th> 
      </tr> 
    </thead>
        <tbody style="background-color: #f3f7f9;">
          <tr style="width: 100%;">
            <td colspan="2" style="width: 100%;padding: 24px;">
               <table style="width: 100%;border: solid 1px #dfe3e8;border-collapse: collapse;text-align: left;table-layout:fixed;">
                    <thead>
                        <tr>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 35%;">Software Name</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 20%;">Publisher</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 14%;">Version</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 12%;">Installed on</th>
                            <th style="border: solid 1px #dfe3e8;background-color: #f9fafb;font-size: 11px;color: #364656;font-family: Arial, Helvetica, sans-serif;padding: 10px 12px;text-align: left;width: 19%;">Current Version</th>
                        </tr>
                    </thead>
                    <tbody>`;
    pdfList.forEach(element => {
      html = html + `<tr style="width: 100%;">
          <td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 40%;vertical-align: top;">` + element[0] + `</td>`;
      html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 20%;vertical-align: top;">` + element[1] + `</td>`;
      html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 14%;vertical-align: top;">` + element[2] + `</td>`;
      html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 12%;vertical-align: top;">` + element[3] + `</td>`;
      html = html + `<td style="border: solid 1px #dfe3e8;background-color: #ffffff;font-size: 11px;color: #4f5f79;font-family: Arial, Helvetica, sans-serif;padding: 8px 12px;text-align: left;width: 14%;vertical-align: top;">` + element[4] + `</td></tr>`
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
                  <td style="width: 33.33%;color: #4f5f79;font-size: 11px;font-family: Arial, Helvetica, sans-serif;padding: 8px 24px;background-color: #fff;text-align: left;vertical-align: middle;">Report Prepare by: ` + localStorage.getItem('currentUser') + `</td>
                  <td style="width: 33.33%;color: #4f5f79;font-size:11px;font-family: Arial, Helvetica, sans-serif;padding: 8px 24px;background-color: #fff;text-align: center;vertical-align: middle;">` + localStorage.getItem('currentCompanyName') + `</td>
                  <td style="width: 33.33%;color: #4f5f79;font-size: 11px;font-family: Arial, Helvetica, sans-serif;padding: 8px 24px;background-color: #fff;text-align: right;vertical-align: middle;">Quicktech 2020 ©. All rights reserved</td>
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
      orientation: 'PORTRAIT'
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
