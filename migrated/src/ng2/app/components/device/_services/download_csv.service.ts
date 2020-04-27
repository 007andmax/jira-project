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
    workbook.xlsx.writeBuffer().then((data) => {
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
      titleRow.font = { size: 16, bold: true }
      data[i].forEach(d => {
        let row = worksheet.addRow(d);
      });
      worksheet.addRow([]);
    }
    worksheet.mergeCells('A1:B1');
    worksheet.mergeCells('A8:B8');
    worksheet.mergeCells('A14:B14');
    worksheet.mergeCells('A19:B19');
    worksheet.mergeCells('A22:B22');
    worksheet.mergeCells('A32:B32');
    worksheet.mergeCells('A38:B38');
    worksheet.mergeCells('A44:B44');
    worksheet.mergeCells('A50:B50');
    worksheet.getCell('A2').font = {bold: true};
    worksheet.getCell('A3').font = {bold: true};
    worksheet.getCell('A4').font = {bold: true};
    worksheet.getCell('A5').font = {bold: true};
    worksheet.getCell('A6').font = {bold: true};
    worksheet.getCell('A9').font = {bold: true};
    worksheet.getCell('A10').font = {bold: true};
    worksheet.getCell('A11').font = {bold: true};
    worksheet.getCell('A12').font = {bold: true};
    worksheet.getCell('A15').font = {bold: true};
    worksheet.getCell('A16').font = {bold: true};
    worksheet.getCell('A17').font = {bold: true};
    worksheet.getCell('A20').font = {bold: true};
    worksheet.getCell('A23').font = {bold: true};
    worksheet.getCell('A24').font = {bold: true};
    worksheet.getCell('A25').font = {bold: true};
    worksheet.getCell('A26').font = {bold: true};
    worksheet.getCell('A27').font = {bold: true};
    worksheet.getCell('A28').font = {bold: true};
    worksheet.getCell('A29').font = {bold: true};
    worksheet.getCell('A30').font = {bold: true};
    worksheet.getCell('A33').font = {bold: true};
    worksheet.getCell('A34').font = {bold: true};
    worksheet.getCell('A35').font = {bold: true};
    worksheet.getCell('A36').font = {bold: true};
    worksheet.getCell('A39').font = {bold: true};
    worksheet.getCell('A40').font = {bold: true};
    worksheet.getCell('A41').font = {bold: true};
    worksheet.getCell('A42').font = {bold: true};
    worksheet.getCell('A45').font = {bold: true};
    worksheet.getCell('A46').font = {bold: true};
    worksheet.getCell('A47').font = {bold: true};
    worksheet.getCell('A48').font = {bold: true};
    worksheet.getCell('A51').font = {bold: true};
    worksheet.getCell('A52').font = {bold: true};
    worksheet.getCell('A53').font = {bold: true};
    worksheet.getCell('A54').font = {bold: true};

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName + '.csv');
    })
  }
}