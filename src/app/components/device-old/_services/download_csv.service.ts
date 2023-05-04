import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor() {
  }

  generateExcel(data: any, fileName: any, type: any) {
    this.downloadFile(data, fileName, type);
  }

  downloadFile(data: any, fileName: any, type: any) {
    let typeArr: string[];
    if (type === 'hardware') {
      typeArr = ['label', 'value'];
    } else[
      typeArr = ['Software Name', 'Publisher', 'Version', 'Installed On', 'Current Version']
    ]
    let csvData = this.ConvertToCSV(data, typeArr, type);
    console.log("csvData", csvData);
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", fileName + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray, headerList, type) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    console.log("array", array);
    let str = '';
    let row = '';
    if (type === 'software' || type === 'Software List') {
      row = 'S.No,';

      for (let index in headerList) {
        row += headerList[index] + ',';
      }
    }
    row = row.slice(0, -1);
    if (type === 'software' || type === 'Software List') {
      str += row + '\r\n';
    }
    for (let i = 0; i < array.length; i++) {
      let line = '';
      if (type === 'software' || type === 'Software List') [
        line = (i + 1) + ''
      ]
      for (let index in headerList) {
        console.log("index", index);
        let head = headerList[index];
        console.log("array[i]", Array.isArray(array[i]), array[i][index]);
        if (index === '0' && type === 'hardware') {
          line += (Array.isArray(array[i]) == false) ? array[i][head] : array[i][index];
        } else {
          line += ',' + ((Array.isArray(array[i]) == false) ? array[i][head] : array[i][index]);
        }
      }
      console.log("line", line);
      str += line + '\r\n';
    }
    return str;
  }
}