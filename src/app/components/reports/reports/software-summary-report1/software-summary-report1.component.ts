import { Component, OnInit } from "@angular/core";
import { AgentService } from "src/app/services/agent/agent.service";
import { CompaniesService } from "src/app/services/company/companies.service";
import { CompaniesStateService } from "src/app/states/company/companies-state.service";

@Component({
  selector: "software-summary-report1",
  templateUrl: "./software-summary-report1.component.html",
  styleUrls: ["./software-summary-report1.component.scss"],
})
export class SoftwareSummaryReport1Component implements OnInit {
  softwareReportList: any[];
  companies = [];
  devices = [];
  software = [];
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
    this.agentService.getCompanyApplicationByGuid('490d865a-131b-4d57-9d3d-d62bd0d8c6b7').subscribe((resp)=>{
      this.softwareReportList = resp;
    })
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

  getReportBySoftwareSummary() {}

  onSelectSoftware() {}

  getSoftwareList(data){
    return data.sort((a, b) =>
      a.DisplayName.toLowerCase() > b.DisplayName.toLowerCase()
        ? 1
        : b.DisplayName.toLowerCase() > a.DisplayName.toLowerCase()
        ? -1
        : 0
    );
  }

  onSelectDevice(Device) {
    this.agentService.getSoftwareListByAssetId(Device.ID).subscribe((resp) => {
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

  selectClient(Client) {
    this.agentService.getAssetsByCompanyId(Client.id).subscribe((resp) => {
      this.devices = this.getDeviceList(resp.filter((x) => x.Description != ""));
    });
  }
}
