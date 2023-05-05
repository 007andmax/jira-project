import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonHttpServices } from '../../_services/common_http.service';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from '../../_services/download_csv.service';
import { CONFIGCONSTANTS } from '../../config/app-constants';
import * as moment from "moment";

@Component({
  selector: 'software-header',
  templateUrl: './software-header.component.html',
  styleUrls: ['./software-header.component.scss']
})
export class SoftwareHeaderComponent implements OnInit {
  @Input() deviceDetail: any = {};
  @Input() loading: boolean;
  @Input() softwareList: any[] = [];
  @Output() onSearch = new EventEmitter<any>();
  DateFormat = CONFIGCONSTANTS.DateFormat;
  pdfUrl = '';
  pipe = new DatePipe('en-US');
  constructor(private commonHttpServices: CommonHttpServices,
    private excelService: ExcelService,
    private toastr: ToastrService,) { }

  ngOnInit() {
  }
  printPdf() {
    window.open(this.pdfUrl, '_blank');
  }
  search(event) {
    this.onSearch.emit(event.target.value)
  }
  getPdfData() {
    let pdfList = [];
    console.log("this.softwareList", this.softwareList);
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
  downloadCsv() {
    console.log("this.softwareList", this.softwareList);
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
    const columnNames = ['Software Name', 'Publisher', 'Version', 'Installed on', 'Current Version'];
    console.log("downloadCsvList", downloadCsvList);
    this.excelService.generateExcel(downloadCsvList, columnNames, fileName);
  }
}
