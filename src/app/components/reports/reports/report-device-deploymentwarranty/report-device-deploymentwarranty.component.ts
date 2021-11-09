import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CONFIGCONSTANTS } from 'src/app/components/device/config/app-constants';
import { CommonHttpServices } from 'src/app/components/device/_services/common_http.service';
import { ExcelService } from 'src/app/components/device/_services/download_csv.service';
import { AgentService } from 'src/app/services/agent/agent.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { DeviceDeploymentWarrantyReport } from '../../class/report-device-deploymentwarranty';

@Component({
  selector: 'report-device-deploymentwarranty',
  templateUrl: './report-device-deploymentwarranty.component.html',
  styleUrls: ['./report-device-deploymentwarranty.component.scss']
})
export class ReportDeviceDeploymentwarrantyComponent implements OnInit {
  clientName: string;
  companies = [];
  deviceDeploymentWarrantyList: any = [];
  deviceDeploymentWarrantyReport: DeviceDeploymentWarrantyReport = new DeviceDeploymentWarrantyReport();
  date = new Date();
  DateFormat = CONFIGCONSTANTS.DateFormat1;
  loading = false;
  devices = [];
  tempararyDeviceList: any = [];
  //filter: NetworkIPReportFilter = new NetworkIPReportFilter();
  selectedClient = null;
  orientation: string = "PORTRAIT";
  report: string = "device-deploymentwarranty-report";
  template: string = "PDF_TEMPLATE";
  fileName: string = "device-deploymentwarranty-report";
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
  ) { }

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
    this.deviceDeploymentWarrantyList = [];
    this.agentService.getDeviceDeploymentWarrantyByGuid(id).subscribe((resp) => {
      if (resp.length > 0) {
        this.deviceDeploymentWarrantyList = resp;
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
      this.deviceDeploymentWarrantyReport.setCompanyId(selectClient.id);
      this.getAllCompanyList(selectClient.id);
    } else {
      this.deviceDeploymentWarrantyReport.setCompanyId(null);
      this.devices = [];
      this.clientName = "All Companies";
      this.deviceDeploymentWarrantyList = [];
    }
  }

  onSelectDevice(data) {
    this.deviceDeploymentWarrantyReport.setDeviceName(data ? data : null);
    if (data) {
      if (
        this.deviceDeploymentWarrantyReport.companyId &&
        this.deviceDeploymentWarrantyReport.deviceName
      ) {
        this.deviceDeploymentWarrantyList = this.tempararyDeviceList.filter(
          (x) => x.Name == data
        );
      }
    } else {
      this.deviceDeploymentWarrantyList = this.tempararyDeviceList;
      this.devices = this.tempararyDeviceList
        .map((item) => item.Name)
        .filter((value, index, self) => self.indexOf(value) === index);
    }
  }

  getReportByDeviceDeploymentWarranty(){

  }

  sendEmail(){

  }

  printPdf(){

  }

  downloadCsv(){

  }

  goToReportList(){
    this.leftPanelStateService.goToState("new-reports");
  }

  onFilter(){

  }

}
