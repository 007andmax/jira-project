import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CONFIGCONSTANTS } from "src/app/components/device/config/app-constants";
import { CommonHttpServices } from "src/app/components/device/_services/common_http.service";
import { ExcelService } from "src/app/components/device/_services/download_csv.service";
import { AgentService } from "src/app/services/agent/agent.service";
import { CompaniesStateService } from "src/app/states/company/companies-state.service";
import { LeftPanelStateService } from "src/app/states/left-panel/left-panel-state.service";
import { DeviceDiskSpaceReport } from "../../class/device-diskspace-report";
import { DeviceDiskSpaceReportFilter } from "./Class/device-diskspace-report";

@Component({
  selector: "report-device-diskspace",
  templateUrl: "./report-device-diskspace.component.html",
  styleUrls: ["./report-device-diskspace.component.scss"],
})
export class ReportDeviceDiskspaceComponent implements OnInit {
  clientName: string;
  companies = [];
  deviceDiskSpaceList: any = [];
  deviceDiskSpaceReport: DeviceDiskSpaceReport = new DeviceDiskSpaceReport();
  date = new Date();
  DateFormat = CONFIGCONSTANTS.DateFormat1;
  loading = false;
  devices = [];
  tempararyDeviceList: any = [];
  filter: DeviceDiskSpaceReportFilter = new DeviceDiskSpaceReportFilter();
  selectedClient = null;
  orientation: string = "PORTRAIT";
  report: string = "device-diskspace-report";
  template: string = "PDF_TEMPLATE";
  fileName: string = "device-diskspace-report";
  accountType = "CLIENT";
  constructor(
    private agentService: AgentService,
    private companiesState: CompaniesStateService,
    private companiesStateService: CompaniesStateService,
    public leftPanelStateService: LeftPanelStateService,
    private modalService: NgbModal,
    private commonHttpServices: CommonHttpServices,
    private toastr: ToastrService,
    private excelService: ExcelService
  ) {}

  ngOnInit() {
    this.clientName = "All Companies";
    this.companiesState.onInit();
    this.setPreviewDataDevice();
  }

  setPreviewDataDevice() {
    this.agentService
      .getAgentToken(
        "QuickTech",
        "s8Y1IuPCUUYlSLMbFijHvut5uOi/KnKNqOLtn57CBlw="
      )
      .subscribe((data) => {
        this.agentService.setAccessToken(data.AccessToken);
        this.companiesStateService.getOnCompanies().subscribe((data) => {
          this.companies = this.getClientsList(data);
        });
      });
  }

  getAllCompanyList(id) {
    this.deviceDiskSpaceList = [];
    this.agentService.getDeviceProcessorRamByGuid(id).subscribe((resp) => {
      if (resp.length > 0) {
        this.deviceDiskSpaceList = resp;
        this.tempararyDeviceList = resp;
        this.devices = this.tempararyDeviceList
          .map((item) => item.Name)
          .filter((value, index, self) => self.indexOf(value) === index);
      }
    });
  }

  getClientsList(data) {
    return data
      .filter((item) => item.accountType === "CLIENT" && !item.deletedAt)
      .sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase()
          ? 1
          : b.name.toLowerCase() > a.name.toLowerCase()
          ? -1
          : 0
      );
  }

  selectClient(selectClient) {
    if (selectClient) {
      this.clientName = selectClient.name;
      this.deviceDiskSpaceReport.setCompanyId(selectClient.id);
      this.getAllCompanyList(selectClient.id);
    } else {
      this.deviceDiskSpaceReport.setCompanyId(null);
      this.devices = [];
      this.clientName = "All Companies";
      this.deviceDiskSpaceList = [];
    }
  }

  onSelectDevice(data) {
    this.deviceDiskSpaceReport.setDeviceName(data ? data : null);
    if (data) {
      if (
        this.deviceDiskSpaceReport.companyId &&
        this.deviceDiskSpaceReport.deviceName
      ) {
        this.deviceDiskSpaceList = this.tempararyDeviceList.filter(
          (x) => x.Name == data
        );
      }
    } else {
      this.deviceDiskSpaceList = this.tempararyDeviceList;
      this.devices = this.tempararyDeviceList
        .map((item) => item.Name)
        .filter((value, index, self) => self.indexOf(value) === index);
    }
  }

  getReportByDiskSpaceDetail() {}

  sendEmail() {}

  printPdf() {}

  downloadCsv() {}

  goToReportList() {}

  onFilter() {}
}
