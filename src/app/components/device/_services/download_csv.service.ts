import { Injectable } from "@angular/core";
@Injectable({
  providedIn: "root",
})
export class ExcelService {
  constructor() {}

  generateExcel(data: any, fileName: any, type: any) {
    this.downloadFile(data, fileName, type);
  }

  downloadFile(data: any, fileName: any, type: any) {
    let typeArr: string[];
    if (type === "hardware") {
      typeArr = ["label", "value"];
    } else
      [(typeArr = ["Software Name", "Publisher", "Version", "Installed On"])];
    let csvData = this.ConvertToCSV(data, typeArr, type);
    let blob = new Blob(["\ufeff" + csvData], {
      type: "text/csv;charset=utf-8;",
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf("Safari") != -1 &&
      navigator.userAgent.indexOf("Chrome") == -1;
    if (isSafariBrowser) {
      //if Safari open in new window to save file with random filename.
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
    let array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    let str = "";
    let row = "";
    if (type === "software") {
      row = "S.No,";

      for (let index in headerList) {
        row += headerList[index] + ",";
      }
    }
    row = row.slice(0, -1);
    if (type === "software") {
      str += row + "\r\n";
    }
    for (let i = 0; i < array.length; i++) {
      let line = "";
      if (type === "software") [(line = i + 1 + "")];
      for (let index in headerList) {
        let head = headerList[index];
        if (index === "0" && type === "hardware") {
          line += array[i][head];
        } else if (type === "software") {
          line += "," + array[i][index];
        } else {
          line += "," + array[i][head];
        }
      }
      str += line + "\r\n";
    }
    return str;
  }
}
