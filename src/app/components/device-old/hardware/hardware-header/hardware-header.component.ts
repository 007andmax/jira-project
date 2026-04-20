import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import * as moment from "moment";
import { CommonHttpServices } from '../../_services/common_http.service';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from '../../_services/download_csv.service';

@Component({
    selector: 'hardware-header',
    templateUrl: './hardware-header.component.html',
    styleUrls: ['./hardware-header.component.scss'],
    standalone: true
})
export class HardwareHeaderComponent implements OnInit {
  @Input() loading: boolean;
  @Input() printSystem: Array<Array<string>>;
  @Input() deviceName: string = '';
  @Input() printMotherBoard: Array<Array<string>>;
  @Input() printProcessor: Array<Array<string>>;
  @Input() printMemory: Array<Array<string>>;
  @Input() printNetwork: Array<Array<string>>;
  @Input() printGraphic: Array<Array<string>>;
  @Input() printDisplay: Array<Array<string>>;
  @Input() printDisk: Array<Array<string>>;
  @Input() printOS: Array<Array<string>>;
  pdfUrl: string = '';
  constructor(private commonHttpServices: CommonHttpServices,
    private toastr: ToastrService,
    public cd: ChangeDetectorRef,
    private excelService: ExcelService) { }

  ngOnInit() {
  }
  printPdf() {
    window.open(this.pdfUrl, '_blank');
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
    let downloadCsvList = [];
    downloadCsvList.push({ label: 'Computer', value: '' });
    this.printSystem.forEach(element => {
      downloadCsvList.push({ label: element[0], value: element[1] });
    });
    downloadCsvList.push({ label: '', value: '' });
    downloadCsvList.push({ label: 'Motherboard', value: '' });
    this.printMotherBoard.forEach(element => {
      downloadCsvList.push({ label: element[0], value: element[1] })
    });
    downloadCsvList.push({ label: '', value: '' });
    downloadCsvList.push({ label: 'Processor', value: '' });
    this.printProcessor.forEach(element => {
      downloadCsvList.push({ label: element[0], value: element[1] })
    });
    downloadCsvList.push({ label: '', value: '' });
    downloadCsvList.push({ label: 'Memory', value: '' });
    this.printMemory.forEach(element => {
      downloadCsvList.push({ label: element[0], value: element[1] })
    });
    downloadCsvList.push({ label: '', value: '' });
    downloadCsvList.push({ label: 'Network Card', value: '' });
    this.printNetwork.forEach(element => {
      downloadCsvList.push({ label: element[0], value: element[1] })
    });
    downloadCsvList.push({ label: '', value: '' });
    downloadCsvList.push({ label: 'Graphics Card', value: '' });
    this.printGraphic.forEach(element => {
      downloadCsvList.push({ label: element[0], value: element[1] })
    });
    downloadCsvList.push({ label: '', value: '' });
    downloadCsvList.push({ label: 'Display', value: '' });
    this.printDisplay.forEach(element => {
      downloadCsvList.push({ label: element[0], value: element[1] })
    });
    downloadCsvList.push({ label: '', value: '' });
    downloadCsvList.push({ label: 'Hard Disk', value: '' });
    this.printDisk.forEach(element => {
      downloadCsvList.push({ label: element[0], value: element[1] })
    });
    downloadCsvList.push({ label: '', value: '' });
    downloadCsvList.push({ label: 'Operating System', value: '' });
    this.printOS.forEach(element => {
      downloadCsvList.push({ label: element[0], value: element[1] })
    });
    let fileName = 'Hardware Detail';
    this.excelService.generateExcel(downloadCsvList, fileName, 'hardware');
  }

}
