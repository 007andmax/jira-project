import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CONFIGCONSTANTS } from 'src/app/components/device/config/app-constants';
import { CommonHttpServices } from 'src/app/components/device/_services/common_http.service';
import { ExcelService } from 'src/app/components/device/_services/download_csv.service';
import { AgentService } from 'src/app/services/agent/agent.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DeviceSummaryReport } from '../../class/device-summary-report';
import { ReportValidate1 } from '../../class/report-validate1';
import { DeviceSummaryReportFilter } from './Class/device-summary-report';

@Component({
  selector: 'report-device-summary',
  templateUrl: './report-device-summary.component.html',
  styleUrls: ['./report-device-summary.component.scss']
})
export class ReportDeviceSummaryComponent implements OnInit {
  deviceSummaryList: any = [];
  companies = [];
  deviceSummaryReport: DeviceSummaryReport = new DeviceSummaryReport();
  clientName: string;
  validate: ReportValidate1 = new ReportValidate1();
  devices = [];
  loadingInProgress: boolean = false;
  date = new Date();
  DateFormat = CONFIGCONSTANTS.DateFormat1;
  filter: DeviceSummaryReportFilter = new DeviceSummaryReportFilter();

  constructor(private agentService: AgentService,
    private companiesStateService: CompaniesStateService,
    private commonHttpServices: CommonHttpServices,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private companiesState: CompaniesStateService
  ) { }

  ngOnInit() {
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
        console.log("data", data);
        this.agentService.setAccessToken(data.AccessToken);
        this.companiesStateService.getOnCompanies().subscribe((data) => {
          debugger;
          this.companies = this.getClientsList(data);
        });
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

  printPdf(){

  }

  downloadCsv(){

  }

  getDeviceSummaryReportList(companyId) {
    this.agentService
      .getDeviceSummaryByGuid(companyId)
      .subscribe((resp) => {
        debugger;
        this.deviceSummaryList = [];
        if(resp.length>0)
        {
          this.deviceSummaryList = resp;
        }
      })
  }



  getReportByDeviceSummary(){
    if (
      !this.validate.isValidateSoftwareSummary(
        this.deviceSummaryReport.companyId
      )
    )
      return;
      this.getDeviceSummaryReportList(this.deviceSummaryReport.companyId);
      this.loadingInProgress = true;
  }

  public getDevicesByCompany(companyId) {
    this.agentService.getAssetsByCompanyId(companyId).subscribe((resp) => {
      if (resp.length > 0) {
        this.devices = resp.filter((x) => x.Description != "");
      } else {
        this.devices = [];
      }
    });
  }

  onSelectDevice(data) {
    this.deviceSummaryReport.setDeviceName(data ? data.Description : null);
  }

  selectClient(selectClient) {
    if (selectClient) {
      this.clientName = selectClient.name;
      this.deviceSummaryReport.setCompanyId(selectClient.id);
      this.getDevicesByCompany(selectClient.id);
      this.validate.resetCompany();
    } else {
      this.deviceSummaryReport.setCompanyId(null);
      this.getDevicesByCompany(null);
    }
  }

  onFilter(field) {
    this.filter.onFilter(field, this.deviceSummaryList);
  }
}
