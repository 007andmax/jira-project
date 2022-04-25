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
    } else if (type === "softwaresummaryreport") {
      [(typeArr = ["Device Name", "Software Name", "Publisher", "Version"])];
    } else if (type === "devicesummaryreport") {
      [(typeArr = ["Device Name", "Manufacturer", "Model", "SerialNumber"])];
    } else if (type === "devicewarrantyreport") {
      [(typeArr = ["Device Name", "Manufacturer", "Device Type", "Model", "SerialNumber", "Warranty Date"])];
    } else if (type === "deviceantivirusreport"){
      [(typeArr = ["Device Name","Antivirus"])];
    } else if (type === "networkIPreport") {
      [(typeArr = ["Device Name", "Domain", "IPAddress", "Subnet", "Gateway", "ExternalIP"])];
    } else if (type === "deviceprocessorramreport") {
      [(typeArr = ["Device Name", "Manufacturer", "Model", "ProcessorType", "MemoryGB"])];
    } else if (type === "devicenetworkadapterreport"){
      [(typeArr = ["Device Name", "Adapter", "Link Speed", "Driver Version"])];
    } else if (type === "devicenetworkdetailreport"){
      [(typeArr = ["Device Name", "Domain", "Manf(nic)", "Type", "Mac","IP","Subnet","Gateway","Dns1","Dns2","ExtIP"])];
    } else if (type === "applicationbycompanyreport"){
      [(typeArr = ["Application", "Version", "Device Count"])];
    } else if (type === "devicediskspacereport"){
      [(typeArr = ["Device Name", "Drive Letter", "Total Space","Used", "Free"])];
    } else if (type === "devicedeploymentwarrantyreport"){
      [(typeArr = ["Device Name", "Domain", "Manufacturer","Subnet", "Gateway", "ExternalIP"])];
    } else if (type === "services"){
      [(typeArr = ["Services Name", "Description", "Status", "Type", "Account Name"])];
    } else if (type === "startupprogrammes"){
      [(typeArr = ["Name", "Command", "User"])];
    }
    else if(type == "DeviceipSummary"){
      [(typeArr = ["Device", "Network Name", "Link Speed", "Dhcp", "Ip Address", "Subnet", "Gateway", "Dns1", "Dns2", "Wan Ip"])]
    }
    else if(type == "HardwareSummary"){
      [(typeArr = ["Device", "Operating System", "Cpu", "Ram", "Disk", "Warranty", "Serial Number"])]
    }
    else
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
    if (
      type === "software" ||
      type === "softwaresummaryreport" ||
      type === "devicesummaryreport" ||
      type === "devicewarrantyreport" ||
      type === "deviceantivirusreport" ||
      type === "networkIPreport"||
      type === "deviceprocessorramreport" ||
      type === "devicenetworkadapterreport" ||
      type === "devicenetworkdetailreport" ||
      type === "applicationbycompanyreport" ||
      type === "devicediskspacereport" ||
      type === "devicedeploymentwarrantyreport" ||
      type === "services" ||
      type === "startupprogrammes" ||
      type === "DeviceipSummary" ||
      type === "HardwareSummary"
    ) {
      row = "S.No,";

      for (let index in headerList) {
        row += headerList[index] + ",";
      }
    }
    row = row.slice(0, -1);
    if (
      type === "software" ||
      type === "softwaresummaryreport" ||
      type === "devicesummaryreport" ||
      type === "devicewarrantyreport" ||
      type === "deviceantivirusreport"||
      type === "networkIPreport" ||
      type === "deviceprocessorramreport" ||
      type === "devicenetworkadapterreport" ||
      type === "devicenetworkdetailreport" ||
      type === "applicationbycompanyreport" ||
      type === "devicediskspacereport" ||
      type === "devicedeploymentwarrantyreport" ||
      type === "services" ||
      type === "startupprogrammes" ||
      type === "DeviceipSummary" ||
      type === "HardwareSummary"
    ) {
      str += row + "\r\n";
    }
    for (let i = 0; i < array.length; i++) {
      let line = "";
      if (
        type === "software" ||
        type === "softwaresummaryreport" ||
        type === "devicesummaryreport" ||
        type === "devicewarrantyreport" ||
        type === "deviceantivirusreport" ||
        type === "networkIPreport" ||
        type === "deviceprocessorramreport" ||
        type === "devicenetworkadapterreport" ||
        type === "devicenetworkdetailreport" ||
        type === "applicationbycompanyreport" ||
        type === "devicediskspacereport" ||
        type === "devicedeploymentwarrantyreport" ||
        type === "services" ||
        type === "startupprogrammes" ||
        type === "DeviceipSummary" ||
        type === "HardwareSummary"
      )
        [(line = i + 1 + "")];
      for (let index in headerList) {
        let head = headerList[index];
        if (index === "0" && type === "hardware") {
          line += array[i][head];
        } else if (
          type === "software" ||
          type === "softwaresummaryreport" ||
          type === "devicesummaryreport" ||
          type === "devicewarrantyreport" ||
          type === "deviceantivirusreport" ||
          type === "networkIPreport" ||
          type === "deviceprocessorramreport" ||
          type === "devicenetworkadapterreport" ||
          type === "devicenetworkdetailreport" ||
          type === "applicationbycompanyreport" ||
          type === "devicediskspacereport" ||
          type === "devicedeploymentwarrantyreport" ||
          type === "services" ||
          type === "startupprogrammes" ||
          type === "DeviceipSummary" ||
          type === "HardwareSummary"
        ) {
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
