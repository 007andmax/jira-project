import { Component, OnInit } from "@angular/core";
import { values } from "d3";
import { PermissionsService } from "../../services/permissions/permissions.service";
import { LeftPanelStateService } from "../../states/left-panel/left-panel-state.service";
import { QuoteStateService } from "../../states/quote/quote-state.service";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit {
  listSalesTitles: Array<string> = [];
  listSalesStates: Array<string> = [];
  salesarray: any = [];
  taxarray: any = [];
  commissionsarray: any = [];
  financialarray: any = [];
  remotearray: any = [];
  devicearray: any = [];
  performancearray: any = [];
  ticketarray: any = [];
  incomearray: any = [];
  salesStatearray: any = [];
  taxStateArray: any = [];
  commissionStateArray: any[];
  financialStateArray: any[];
  remoteStateArray: any[];
  deviceStateArray: any[];
  performanceStateArray: any[];
  ticketStateArray: any[];
  incomeStateArray: any[];
  reportList: Array<{ type: string; name: string; address: string }> = [
    { type: "SALES", name: "Product sales report", address: "byProducts" },
    { type: "SALES", name: "Customer sales report", address: "byCustomers" },
    { type: "TAXES", name: "Tax report", address: "byTaxes" },
    {
      type: "COMMISSIONS",
      name: "Common report",
      address: "common-commissions",
    },
    {
      type: "COMMISSIONS",
      name: "Detailed report",
      address: "detailed-commissions",
    },
    {
      type: "FINANCIAL",
      name: "Accounts receivable report",
      address: "accounts-receivable",
    },
    {
      type: "FINANCIAL",
      name: "Accounting report",
      address: "accounting-report",
    },
    {
      type: "REMOTE_ACCESS",
      name: "Remote connection report",
      address: "remote-access",
    },
    {
      type: "DEVICES",
      name: "Device Summary report",
      address: "report-device-summary",
    },
    {
      type: "DEVICES",
      name: "Software Summary report",
      address: "software-summary",
    },
    {
      type: "DEVICES",
      name: "Hardware Summary reports",
      address: "hardware-summary",
    },
    {
      type: "DEVICES",
      name: "Device IP Summary report",
      address: "device-ip-summary",
    },
    {
      type: "DEVICES",
      name: "Device Warranty report",
      address: "report-device-warranty",
    },
    {
      type: "DEVICES",
      name: "Device Antivirus report",
      address: "report-device-antivirus",
    },
    {
      type: "DEVICES",
      name: "Network IP report",
      address: "network-ip-report",
    },
    {
      type: "DEVICES",
      name: "Network Detail report",
      address: "network-detail-report",
    },
    {
      type: "DEVICES",
      name: "Network Adapter report",
      address: "network-adapter-report",
    },
    {
      type: "DEVICES",
      name: "Device Deployment Warranty report",
      address: "report-device-deploymentwarranty",
    },
    {
      type: "DEVICES",
      name: "Device Processor Ram report",
      address: "report-device-processorram",
    },
    {
      type: "DEVICES",
      name: "Device Disk Space report",
      address: "report-device-diskspace",
    },
    {
      type: "DEVICES",
      name: "Application By Company report",
      address: "applicationbycompany-report",
    },
    { type: "PERFORMANCE", name: "Tech sales report", address: "tech-sales" },
    { type: "PERFORMANCE", name: "Tech ticket report", address: "tech-ticket" },
    {
      type: "PERFORMANCE",
      name: "Tech service report",
      address: "tech-service",
    },
    { type: "TICKETS", name: "Tickets report", address: "ticket-report" },
    { type: "TICKETS", name: "Service report", address: "service-report" },
    {
      type: "INCOME_ACCOUNTS",
      name: "Income account report",
      address: "income-accounts",
    },
  ];
  searchText: string = "";
  title: string = "Reports";
  constructor(
    private leftPanelStateService: LeftPanelStateService,
    private quoteStateService: QuoteStateService,
    private permissionsService: PermissionsService
  ) {}

  ngOnInit() {}
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action);
  }
  public goToState(state) {
    localStorage.setItem("report", state);
    this.leftPanelStateService.goToState(state);
  }
  public getListTitles(type, searchs) {
    if (type === "SALES") {
      if (searchs !== "") {
        this.salesarray = this.reportList.filter(
          (x) =>
            x.type === "SALES" &&
            x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
        );
      } else {
        this.salesarray = this.reportList.filter((x) => x.type === "SALES");
      }
      return this.salesarray.map((x) => x.name);
    }

    if (type === "TAXES") {
      if (searchs !== "") {
        this.taxarray = this.reportList.filter(
          (x) =>
            x.type === "TAXES" &&
            x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
        );
      } else {
        this.taxarray = this.reportList.filter((x) => x.type === "TAXES");
      }
      return this.taxarray.map((x) => x.name);
    }
    if (type === "COMMISSIONS") {
      if (searchs !== "") {
        this.commissionsarray = this.reportList.filter(
          (x) =>
            x.type === "COMMISSIONS" &&
            x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
        );
      } else {
        this.commissionsarray = this.reportList.filter(
          (x) => x.type === "COMMISSIONS"
        );
      }
      return this.commissionsarray.map((x) => x.name);
    }
    if (type === "FINANCIAL") {
      if (searchs !== "") {
        this.financialarray = this.reportList.filter(
          (x) =>
            x.type === "FINANCIAL" &&
            x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
        );
      } else {
        this.financialarray = this.reportList.filter(
          (x) => x.type === "FINANCIAL"
        );
      }
      return this.financialarray.map((x) => x.name);
    }

    if (type === "REMOTE_ACCESS") {
      if (searchs !== "") {
        this.remotearray = this.reportList.filter(
          (x) =>
            x.type === "REMOTE_ACCESS" &&
            x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
        );
      } else {
        this.remotearray = this.reportList.filter(
          (x) => x.type === "REMOTE_ACCESS"
        );
      }
      return this.remotearray.map((x) => x.name);
    }

    if (type === "DEVICES") {
      if (searchs !== "") {
        this.devicearray = this.reportList.filter(
          (x) =>
            x.type === "DEVICES" &&
            x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
        );
      } else {
        this.devicearray = this.reportList.filter((x) => x.type === "DEVICES");
      }
      return this.devicearray.map((x) => x.name);
    }

    if (type === "PERFORMANCE") {
      if (searchs !== "") {
        this.performancearray = this.reportList.filter(
          (x) =>
            x.type === "PERFORMANCE" &&
            x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
        );
      } else {
        this.performancearray = this.reportList.filter(
          (x) => x.type === "PERFORMANCE"
        );
      }
      return this.performancearray.map((x) => x.name);
    }

    if (type === "TICKETS") {
      if (searchs !== "") {
        this.ticketarray = this.reportList.filter(
          (x) =>
            x.type === "TICKETS" &&
            x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
        );
      } else {
        this.ticketarray = this.reportList.filter((x) => x.type === "TICKETS");
      }
      return this.ticketarray.map((x) => x.name);
    }

    if (type === "INCOME_ACCOUNTS") {
      if (searchs !== "") {
        this.incomearray = this.reportList.filter(
          (x) =>
            x.type === "INCOME_ACCOUNTS" &&
            x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
        );
      } else {
        this.incomearray = this.reportList.filter(
          (x) => x.type === "INCOME_ACCOUNTS"
        );
      }
      return this.incomearray.map((x) => x.name);
    }
  }
  public getListStates(type, searchs) {
    if (type === "SALES") {
      if (searchs !== "") {
        this.salesStatearray = this.reportList.filter(
          (x) =>
            x.type === "SALES" &&
            x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
        );
      } else {
        this.salesStatearray = this.reportList.filter(
          (x) => x.type === "SALES"
        );
      }
      return this.salesStatearray.map((x) => x.address);
    }

    if (type === "TAXES") {
      if (searchs !== "") {
        this.taxStateArray = this.reportList.filter(
          (x) =>
            x.type === "TAXES" &&
            x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
        );
      } else {
        this.taxStateArray = this.reportList.filter((x) => x.type === "TAXES");
      }
      return this.taxStateArray.map((x) => x.address);
    }
    if (type === "COMMISSIONS") {
      if (searchs !== "") {
        this.commissionStateArray = this.reportList.filter(
          (x) =>
            x.type === "COMMISSIONS" &&
            x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
        );
      } else {
        this.commissionStateArray = this.reportList.filter(
          (x) => x.type === "COMMISSIONS"
        );
      }
      return this.commissionStateArray.map((x) => x.address);
    }
    if (type === "FINANCIAL") {
      if (searchs !== "") {
        this.financialStateArray = this.reportList.filter(
          (x) =>
            x.type === "FINANCIAL" &&
            x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
        );
      } else {
        this.financialStateArray = this.reportList.filter(
          (x) => x.type === "FINANCIAL"
        );
      }
      return this.financialStateArray.map((x) => x.address);
    }

    if (type === "REMOTE_ACCESS") {
      if (searchs !== "") {
        this.remoteStateArray = this.reportList.filter(
          (x) =>
            x.type === "REMOTE_ACCESS" &&
            x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
        );
      } else {
        this.remoteStateArray = this.reportList.filter(
          (x) => x.type === "REMOTE_ACCESS"
        );
      }
      return this.remoteStateArray.map((x) => x.address);
    }

    if (type === "DEVICES") {
      if (searchs !== "") {
        this.deviceStateArray = this.reportList.filter(
          (x) =>
            x.type === "DEVICES" &&
            x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
        );
      } else {
        this.deviceStateArray = this.reportList.filter(
          (x) => x.type === "DEVICES"
        );
      }
      return this.deviceStateArray.map((x) => x.address);
    }

    if (type === "PERFORMANCE") {
      if (searchs !== "") {
        this.performanceStateArray = this.reportList.filter(
          (x) =>
            x.type === "PERFORMANCE" &&
            x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
        );
      } else {
        this.performanceStateArray = this.reportList.filter(
          (x) => x.type === "PERFORMANCE"
        );
      }
      return this.performanceStateArray.map((x) => x.address);
    }

    if (type === "TICKETS") {
      if (searchs !== "") {
        this.ticketStateArray = this.reportList.filter(
          (x) =>
            x.type === "TICKETS" &&
            x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
        );
      } else {
        this.ticketStateArray = this.reportList.filter(
          (x) => x.type === "TICKETS"
        );
      }
      return this.ticketStateArray.map((x) => x.address);
    }

    if (type === "INCOME_ACCOUNTS") {
      if (searchs !== "") {
        this.incomeStateArray = this.reportList.filter(
          (x) =>
            x.type === "INCOME_ACCOUNTS" &&
            x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
        );
      } else {
        this.incomeStateArray = this.reportList.filter(
          (x) => x.type === "INCOME_ACCOUNTS"
        );
      }
      return this.incomeStateArray.map((x) => x.address);
    }
  }

  search(event) {
    this.searchText = event.target.value.toLowerCase();
  }
}
