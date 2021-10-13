import { Component, OnInit } from "@angular/core";
import { element } from "@angular/core/src/render3";
import { AgentService } from "src/app/services/agent/agent.service";
import { CompaniesStateService } from "src/app/states/company/companies-state.service";
import { ReportValidate1 } from "../../class/report-validate1";
import { SoftwareSummaryReport1 } from "../../class/software-summary-report1";

@Component({
  selector: "software-summary-report1",
  templateUrl: "./software-summary-report1.component.html",
  styleUrls: ["./software-summary-report1.component.scss"],
})
export class SoftwareSummaryReport1Component implements OnInit {
  softwareReportList: any = [];
  report: any;
  companies = [];
  devices = [];
  software = [];
  tempSoftware = [];
  company: any;
  validate: ReportValidate1 = new ReportValidate1();
  softwareSummaryReport: SoftwareSummaryReport1 = new SoftwareSummaryReport1();
  constructor(
    private agentService: AgentService,
    private companiesStateService: CompaniesStateService,
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
        this.softwareReportList = resp;
        if (resp.length > 0) {
          this.report = this.softwareSummaryReport.softwareSummarySoft != null ? this.softwareReportList.find(x=>x.DisplayName == this.softwareSummaryReport.softwareSummarySoft):resp;
          this.softwareReportList = [];
          if(this.softwareSummaryReport.softwareSummarySoft!=null)
          {
            this.softwareReportList.push(this.report);
          }
          else
          {
            this.softwareReportList = this.report;
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
  }

  onSelectSoftware(data) {
    this.softwareSummaryReport.setSoftwareSoft(data);
  }

  getSoftwareList(data) {
    return data.sort((a, b) =>
      a.DisplayName.toLowerCase() > b.DisplayName.toLowerCase()
        ? 1
        : b.DisplayName.toLowerCase() > a.DisplayName.toLowerCase()
        ? -1
        : 0
    );
  }

  onSelectDevice(data) {
    this.softwareSummaryReport.setDeviceId((data) ? data.ID : null);
    this.agentService.getSoftwareListByAssetId(data.ID).subscribe((resp) => {
      this.software = this.getSoftwareList(resp);
    });
  }

  getDeviceList(data) {
    return data.sort((a, b) =>
      a.Description.toLowerCase() > b.Description.toLowerCase()
        ? 1
        : b.Description.toLowerCase() > a.Description.toLowerCase()
        ? -1
        : 0
    );
  }

  public getDevicesByCompany(companyId) {
    // this.agentService.getAssetsByCompanyId(companyId).subscribe((resp) => {
    //   if (resp.length > 0) {
    //     this.devices = this.getDeviceList(
    //       resp.filter((x) => x.Description != "")
    //     );
    //   } else {
    //     this.devices = [];
    //   }
    // });
  }

  selectClient(selectClient) {
    if (selectClient) {
      this.softwareSummaryReport.setCompanyId(selectClient.id);
      this.getDevicesByCompany(selectClient.id);
      this.validate.resetCompany();
      this.agentService
      .getCompanyApplicationByGuid(selectClient.id)
      .subscribe((resp) => {
        debugger;
        if (resp.length > 0) {
          this.tempSoftware = resp;
          this.software = this.tempSoftware.map(item => item.DisplayName)
          .filter((value, index, self) => self.indexOf(value) === index)
        }
      });
    } else {
      this.softwareSummaryReport.setCompanyId(null);
      this.getDevicesByCompany(null);
    }
  }
}
