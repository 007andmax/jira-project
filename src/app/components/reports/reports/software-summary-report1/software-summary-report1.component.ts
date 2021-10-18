import { Component, OnInit } from "@angular/core";
import { CONFIGCONSTANTS } from "src/app/components/device/config/app-constants";
import { AgentService } from "src/app/services/agent/agent.service";
import { CompaniesStateService } from "src/app/states/company/companies-state.service";
import { ReportValidate1 } from "../../class/report-validate1";
import { SoftwareSummaryReport1 } from "../../class/software-summary-report1";
import { SoftwareSummaryReportFilter } from "./Class/software-summary-report1-filter";

@Component({
  selector: "software-summary-report1",
  templateUrl: "./software-summary-report1.component.html",
  styleUrls: ["./software-summary-report1.component.scss"],
})
export class SoftwareSummaryReport1Component implements OnInit {
  softwareReportList: any = [];
  tempReport: any = [];
  tempDevice: any = [];
  report: any;
  companies = [];
  devices = [];
  software = [];
  tempSoftware = [];
  publisher = [];
  company: any;
  clientName: string;
  validate: ReportValidate1 = new ReportValidate1();
  softwareSummaryReport: SoftwareSummaryReport1 = new SoftwareSummaryReport1();
  filter: SoftwareSummaryReportFilter = new SoftwareSummaryReportFilter();
  date = new Date();
  DateFormat = CONFIGCONSTANTS.DateFormat1;
  loadingInProgress: boolean = false;
  constructor(
    private agentService: AgentService,
    private companiesStateService: CompaniesStateService
  ) {}

  ngOnInit() {
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

  getCompanySoftwareList(companyId) {
    this.agentService
      .getCompanyApplicationByGuid(companyId)
      .subscribe((resp) => {
        this.tempReport = [];
        if (resp.length > 0) {
          for (let i = 0; i < resp.length; i++) {
            if (resp[i].DisplayName != "") {
              let data = {
                DisplayName: resp[i].DisplayName,
              };
              this.tempSoftware.push(data);
            }
            if (resp[i].Publisher != "") {
              let data = {
                DisplayName: resp[i].Publisher,
              };
              this.tempSoftware.push(data);
            }
            this.software = this.tempSoftware
              .map((item) => item.DisplayName)
              .filter((value, index, self) => self.indexOf(value) === index);

            if (resp[i].AssetCount > 1) {
              let Name = resp[i].AssetNames;
              for (let j = 0; j < Name.length; j++) {
                let data = {
                  DisplayName: resp[i].DisplayName,
                  DisplayVersion: resp[i].DisplayVersion,
                  Publisher: resp[i].Publisher,
                  AssetCount: resp[i].AssetCount,
                  AssetNames: Name[j],
                };
                this.tempReport.push(data);
              }
            } else {
              let data = {
                DisplayName: resp[i].DisplayName,
                DisplayVersion: resp[i].DisplayVersion,
                Publisher: resp[i].Publisher,
                AssetCount: resp[i].AssetCount,
                AssetNames: resp[i].AssetNames[0],
              };
              this.tempReport.push(data);
            }
          }
        }
      });
  }

  getReportBySoftwareSummary() {
    if (
      !this.validate.isValidateSoftwareSummary(
        this.softwareSummaryReport.companyId
      )
    )
      return;
    this.getCompanySoftwareList(this.softwareSummaryReport.companyId);
    this.loadingInProgress = true;
    if (
      this.softwareSummaryReport.deviceName &&
      this.softwareSummaryReport.softwareSummarySoft
    ) {
      this.softwareReportList = this.tempReport.filter(
        ((x) => x.AssetNames == this.softwareSummaryReport.deviceName) ||
          ((x) =>
            x.DispalyName == this.softwareSummaryReport.softwareSummarySoft)
      );
    } else if (
      this.softwareSummaryReport.deviceName &&
      !this.softwareSummaryReport.softwareSummarySoft
    ) {
      this.softwareReportList = this.tempReport.filter(
        (x) => x.AssetNames == this.softwareSummaryReport.deviceName
      );
    } else if (
      this.softwareSummaryReport.softwareSummarySoft &&
      !this.softwareSummaryReport.deviceName
    ) {
      this.softwareReportList = this.tempReport.filter(
        (x) => x.DisplayName == this.softwareSummaryReport.softwareSummarySoft
      );
    } else {
      this.softwareReportList = this.tempReport;
    }
  }

  onSelectSoftware(data) {
    this.softwareSummaryReport.setSoftwareSoft(data);
  }

  onSelectDevice(data) {
    this.softwareSummaryReport.setDeviceName(data ? data.Description : null);
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

  selectClient(selectClient) {
    if (selectClient) {
      this.clientName = selectClient.name;
      this.softwareSummaryReport.setCompanyId(selectClient.id);
      this.getDevicesByCompany(selectClient.id);
      this.validate.resetCompany();
      this.getCompanySoftwareList(selectClient.id);
    } else {
      this.softwareSummaryReport.setCompanyId(null);
      this.getDevicesByCompany(null);
    }
  }

  onFilter(field) {
    this.filter.onFilter(field, this.softwareReportList);
  }
}
