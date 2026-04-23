
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { ReportListItemComponent } from '../../reports/report-list-item/report-list-item.component';

@Component({
  standalone: true,
  imports: [ReportListItemComponent, CommonModule],
  selector: 'devices-report',
  templateUrl: './devices-report.component.html',
  styleUrls: ['./devices-report.component.scss'],

})
export class DevicesReportComponent implements OnInit {
  searchText: string = "";
  title: string = "Reports";
  devicereportList: Array<{ type: string; name: string; address: string }> = [
    { type: 'DEVICE', name: 'Device Summary report', address: 'report-device-summary' },
    { type: 'HARDWARE', name: 'Hardware Summary reports', address: 'hardware-summary-device' },
    { type: 'HARDWARE', name: 'Device Processor Ram report', address: 'report-device-processorram' },
    { type: 'HARDWARE', name: 'Device Disk Space report', address: 'report-device-diskspace' },
    { type: "NETWORK", name: "Device IP Summary report", address: "device-ip-summary-device" },
    { type: 'NETWORK', name: 'Network IP report', address: "network-ip-report" },
    { type: 'NETWORK', name: "Network Detail report", address: "network-detail-report", },
    { type: 'NETWORK', name: "Network Adapter report", address: "network-adapter-report", },
    { type: 'SOFTWARE', name: "Software Summary report", address: "software-summary-device", },
    { type: 'SOFTWARE', name: "Device Antivirus report", address: "report-device-antivirus", },
    { type: 'SOFTWARE', name: "Application By Company report ", address: "applicationbycompany-report", },
    { type: 'WARRANTY', name: "Device Warranty report", address: "report-device-warranty", },
    { type: 'WARRANTY', name: "Device Deployment Warranty report", address: "report-device-deploymentwarranty", },

  ]
  constructor(
    public leftPanelStateService: LeftPanelStateService,
    private permissionsService: PermissionsService
  ) { }

  ngOnInit() {
    this.leftPanelStateService.changeStateWithoutNavigate(
      "new-device-summary"
    );
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action);
  }
  public getListTitles(type, searchs) {

    if (type === "DEVICE") {
      return searchs !== ""
        ? this.devicereportList
          .filter(
            (x) =>
              x.type === "DEVICE" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.name)
        : this.devicereportList
          .filter((x) => x.type === "DEVICE")
          .map((x) => x.name);
    }
    if (type === "HARDWARE") {
      return searchs !== ""
        ? this.devicereportList
          .filter(
            (x) =>
              x.type === "HARDWARE" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.name)
        : this.devicereportList.filter((x) => x.type === "HARDWARE").map((x) => x.name);
    }

    if (type === "NETWORK") {
      return searchs !== ""
        ? this.devicereportList
          .filter(
            (x) =>
              x.type === "NETWORK" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.name)
        : this.devicereportList.filter((x) => x.type === "NETWORK").map((x) => x.name);
    }
    if (type === "SOFTWARE") {
      return searchs !== ""
        ? this.devicereportList
          .filter(
            (x) =>
              x.type === "SOFTWARE" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.name)
        : this.devicereportList
          .filter((x) => x.type === "SOFTWARE")
          .map((x) => x.name);
    }
    if (type === "WARRANTY") {
      return searchs !== ""
        ? this.devicereportList
          .filter(
            (x) =>
              x.type === "WARRANTY" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.name)
        : this.devicereportList
          .filter((x) => x.type === "WARRANTY")
          .map((x) => x.name);
    }
  }

  public getListStates(type, searchs) {

    if (type === "DEVICE") {
      return searchs !== ""
        ? this.devicereportList
          .filter(
            (x) =>
              x.type === "DEVICE" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.address)
        : this.devicereportList
          .filter((x) => x.type === "DEVICE")
          .map((x) => x.address);
    }
    if (type === "HARDWARE") {
      return searchs !== ""
        ? this.devicereportList
          .filter(
            (x) =>
              x.type === "HARDWARE" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.address)
        : this.devicereportList
          .filter((x) => x.type === "HARDWARE")
          .map((x) => x.address);
    }

    if (type === "NETWORK") {
      return searchs !== ""
        ? this.devicereportList
          .filter(
            (x) =>
              x.type === "NETWORK" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.address)
        : this.devicereportList
          .filter((x) => x.type === "NETWORK")
          .map((x) => x.address);
    }
    if (type === "SOFTWARE") {
      return searchs !== ""
        ? this.devicereportList
          .filter(
            (x) =>
              x.type === "SOFTWARE" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.address)
        : this.devicereportList
          .filter((x) => x.type === "SOFTWARE")
          .map((x) => x.address);
    }
    if (type === "WARRANTY") {
      return searchs !== ""
        ? this.devicereportList
          .filter(
            (x) =>
              x.type === "WARRANTY" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.address)
        : this.devicereportList
          .filter((x) => x.type === "WARRANTY")
          .map((x) => x.address);
    }
  }

  search(event) {
    this.searchText = event.target.value.toLowerCase();
  }
}
