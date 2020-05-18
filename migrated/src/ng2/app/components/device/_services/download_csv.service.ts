import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor() {
  }
  generateExcel(data, header, fileName) {
    
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName + 'Data');
    //Add Header Row
    let headerRow = worksheet.addRow(header);
    
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCFFE5' },
        bgColor: { argb: 'FFCCFFE5' }
      }
      cell.style = {font:{bold: true}}
    })
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    data.forEach(d => {
      let row = worksheet.addRow(d);
    }
    );
    //Generate Excel File with given name
    workbook.csv.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName + '.csv');
    })
  }

  generateHardwareExcel(data, fileName) {
    
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(fileName + 'Data');

    for(let i = 0; i < data.length; i++) {
      let title = '';
      if (i == 0) {
        title = 'Computer';
      } else if (i == 1) {
        title = 'Motherboard';
      } else if (i == 2) {
        title = 'Processor';
      } else if (i == 3) {
        title = 'Memory';
      } else if (i == 4) {
        title = 'Network Card';
      } else if (i == 5) {
        title = 'Graphics Card';
      } else if (i == 6) {
        title = 'Display';
      } else if (i == 7) {
        title = 'Hard disk';
      } else if (i == 8) {
        title = 'Operating System';
      }
      let titleRow = worksheet.addRow([title]);
      titleRow.font = { size: 20, bold: true }
      data[i].forEach(d => {
        let row = worksheet.addRow(d);
      });
      worksheet.addRow([]);
    }
    // worksheet.mergeCells('A1:B1');
    // worksheet.mergeCells('A8:B8');
    // worksheet.mergeCells('A14:B14');
    // worksheet.mergeCells('A19:B19');
    // worksheet.mergeCells('A22:B22');
    // worksheet.mergeCells('A32:B32');
    // worksheet.mergeCells('A38:B38');
    // worksheet.mergeCells('A44:B44');
    // worksheet.mergeCells('A50:B50');

    //Generate Excel File with given name
    workbook.csv.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName + '.csv');
    })
  }
}