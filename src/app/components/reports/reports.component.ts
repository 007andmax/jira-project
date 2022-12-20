import { Component, OnInit } from "@angular/core";
import { values } from "d3";
import { CompaniesStateService } from "src/app/states/company/companies-state.service";
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
      type: "FINANCIAL",
      name: "Payments report",
      address: "payments-report",
    },
    {
      type: "REMOTE_ACCESS",
      name: "Remote connection report",
      address: "remote-access",
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
    { type: "DEVICES", name: "Software Summary report", address: "software-summary" },
    { type: "DEVICES", name: "Hardware Summary reports", address: "hardware-summary" },
    { type: "DEVICES", name: "Device IP Summary report", address: "device-ip-summary" },
  ];
  searchText: string = "";
  title: string = "Reports";
  constructor(
    private leftPanelStateService: LeftPanelStateService,
    private quoteStateService: QuoteStateService,
    private permissionsService: PermissionsService,
    public companiesStateService: CompaniesStateService,
  ) { }

  ngOnInit() { }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action);
  }
  public goToState(state) {
    localStorage.setItem("report", state);
    this.leftPanelStateService.goToState(state);
  }
  public getListTitles(type, searchs) {
    if (type === "SALES") {
      return searchs !== ""
        ? this.reportList
          .filter(
            (x) =>
              x.type === "SALES" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.name)
        : this.reportList.filter((x) => x.type === "SALES").map((x) => x.name);
    }
    if (type === "DEVICES") {
      return searchs !== ""
        ? this.reportList
          .filter(
            (x) =>
              x.type === "DEVICES" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.name)
        : this.reportList.filter((x) => x.type === "DEVICES").map((x) => x.name);
    }
    if (type === "TAXES") {
      return searchs !== ""
        ? this.reportList
          .filter(
            (x) =>
              x.type === "TAXES" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.name)
        : this.reportList.filter((x) => x.type === "TAXES").map((x) => x.name);
    }
    if (type === "COMMISSIONS") {
      return searchs !== ""
        ? this.reportList
          .filter(
            (x) =>
              x.type === "COMMISSIONS" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.name)
        : this.reportList
          .filter((x) => x.type === "COMMISSIONS")
          .map((x) => x.name);
    }
    if (type === "FINANCIAL") {
      return searchs !== ""
        ? this.reportList
          .filter(
            (x) =>
              x.type === "FINANCIAL" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.name)
        : this.reportList
          .filter((x) => x.type === "FINANCIAL")
          .map((x) => x.name);
    }

    if (type === "REMOTE_ACCESS") {
      return searchs !== ""
        ? this.reportList
          .filter(
            (x) =>
              x.type === "REMOTE_ACCESS" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.name)
        : this.reportList
          .filter((x) => x.type === "REMOTE_ACCESS")
          .map((x) => x.name);
    }

    if (type === "PERFORMANCE") {
      return searchs !== ""
        ? this.reportList
          .filter(
            (x) =>
              x.type === "PERFORMANCE" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.name)
        : this.reportList
          .filter((x) => x.type === "PERFORMANCE")
          .map((x) => x.name);
    }

    if (type === "TICKETS") {
      return searchs !== ""
        ? this.reportList
          .filter(
            (x) =>
              x.type === "TICKETS" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.name)
        : this.reportList
          .filter((x) => x.type === "TICKETS")
          .map((x) => x.name);
    }

    if (type === "INCOME_ACCOUNTS") {
      return searchs !== ""
        ? this.reportList
          .filter(
            (x) =>
              x.type === "INCOME_ACCOUNTS" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.name)
        : this.reportList
          .filter((x) => x.type === "INCOME_ACCOUNTS")
          .map((x) => x.name);
    }
  }
  public getListStates(type, searchs) {
    if (type === "SALES") {
      return searchs !== ""
        ? this.reportList
          .filter(
            (x) =>
              x.type === "SALES" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.address)
        : this.reportList
          .filter((x) => x.type === "SALES")
          .map((x) => x.address);
    }
    if (type === "DEVICES") {
      return searchs !== ""
        ? this.reportList
          .filter(
            (x) =>
              x.type === "DEVICES" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.address)
        : this.reportList
          .filter((x) => x.type === "DEVICES")
          .map((x) => x.address);
    }
    if (type === "TAXES") {
      return searchs !== ""
        ? this.reportList
          .filter(
            (x) =>
              x.type === "TAXES" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.address)
        : this.reportList
          .filter((x) => x.type === "TAXES")
          .map((x) => x.address);
    }
    if (type === "COMMISSIONS") {
      return searchs !== ""
        ? this.reportList
          .filter(
            (x) =>
              x.type === "COMMISSIONS" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.address)
        : this.reportList
          .filter((x) => x.type === "COMMISSIONS")
          .map((x) => x.address);
    }
    if (type === "FINANCIAL") {
      return searchs !== ""
        ? this.reportList
          .filter(
            (x) =>
              x.type === "FINANCIAL" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.address)
        : this.reportList
          .filter((x) => x.type === "FINANCIAL")
          .map((x) => x.address);
    }

    if (type === "REMOTE_ACCESS") {
      return searchs !== ""
        ? this.reportList
          .filter(
            (x) =>
              x.type === "REMOTE_ACCESS" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.address)
        : this.reportList
          .filter((x) => x.type === "REMOTE_ACCESS")
          .map((x) => x.address);
    }

    if (type === "PERFORMANCE") {
      return searchs !== ""
        ? this.reportList
          .filter(
            (x) =>
              x.type === "PERFORMANCE" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.address)
        : this.reportList
          .filter((x) => x.type === "PERFORMANCE")
          .map((x) => x.address);
    }

    if (type === "TICKETS") {
      return searchs !== ""
        ? this.reportList
          .filter(
            (x) =>
              x.type === "TICKETS" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.address)
        : this.reportList
          .filter((x) => x.type === "TICKETS")
          .map((x) => x.address);
    }

    if (type === "INCOME_ACCOUNTS") {
      return searchs !== ""
        ? this.reportList
          .filter(
            (x) =>
              x.type === "INCOME_ACCOUNTS" &&
              x.name.toLowerCase().indexOf(searchs.toLowerCase()) > -1
          )
          .map((x) => x.address)
        : this.reportList
          .filter((x) => x.type === "INCOME_ACCOUNTS")
          .map((x) => x.address);
    }
  }

  search(event) {
    this.searchText = event.target.value.toLowerCase();
  }
}
