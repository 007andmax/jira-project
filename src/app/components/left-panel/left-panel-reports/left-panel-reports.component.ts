import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { ReportsLeftMenuItem } from './class/reports-left-menu-item';
import { ReportsLeftMenuItemReport } from './class/reports-left-menu-item-report';

@Component({
  selector: 'app-left-panel-reports',
  templateUrl: './left-panel-reports.component.html',
  styleUrls: ['./left-panel-reports.component.scss']
})
export class LeftPanelReportsComponent implements OnInit {
  @Output() onChangeState = new EventEmitter();
  @Input() activePage: string = "";
  list: Array<ReportsLeftMenuItem> = [];
  constructor(private leftPanelStateService: LeftPanelStateService,
    public companiesStateService: CompaniesStateService,
    private permissionsService: PermissionsService) { }

  ngOnInit() {
    this.list.push(new ReportsLeftMenuItem("icon__sales", "SALES", [new ReportsLeftMenuItemReport('Product sales report', 'byProducts'),
    new ReportsLeftMenuItemReport('Customer sales report', 'byCustomers')], this.getPermissions('VIEW_SALES_REPORT')));
    this.list.push(new ReportsLeftMenuItem("icon__taxes", "TAXES", [new ReportsLeftMenuItemReport('Tax report', 'byTaxes')], this.getPermissions('VIEW_TAXES_REPORT')));
    this.list.push(new ReportsLeftMenuItem("icon__commision", "COMMISSIONS", [new ReportsLeftMenuItemReport('Common report', 'common-commissions'),
    new ReportsLeftMenuItemReport('Detailed report', 'detailed-commissions')], this.getPermissions('VIEW_SALES_REPORT')));
    this.list.push(new ReportsLeftMenuItem("icon__financial", "FINANCIAL", [new ReportsLeftMenuItemReport('Accounts receivable report', 'accounts-receivable'),
    new ReportsLeftMenuItemReport('Accounting report', 'accounting-report'),
    new ReportsLeftMenuItemReport('Payments report', 'payments-report')], this.getPermissions('VIEW_FINANCIAL_REPORT')));
    this.list.push(new ReportsLeftMenuItem("icon__remote-access", "REMOTE ACCESS", [new ReportsLeftMenuItemReport('Remote connection report', 'remote-access')], this.getPermissions('VIEW_REMOTE_ACCESS_REPORT')));
    if (this.companiesStateService.getCurrentCompany() && (this.companiesStateService.getCurrentCompany().id === '73221c72-f87c-4519-8235-c4b57ad1cc19' || this.companiesStateService.getCurrentCompany().id === '72381bff-127c-4a63-9d2e-6e952350dcbd')) this.list.push(new ReportsLeftMenuItem("icon__devices", "DEVICES", [new ReportsLeftMenuItemReport('Software Summary report', 'software-summary'),
    new ReportsLeftMenuItemReport('Hardware Summary reports', 'hardware-summary'),
    new ReportsLeftMenuItemReport('Device IP Summary report', 'device-ip-summary')], this.getPermissions('VIEW_DEVICES_REPORTS')));
    this.list.push(new ReportsLeftMenuItem("icon__performance", "PERFORMANCE", [new ReportsLeftMenuItemReport('Tech sales report', 'tech-sales'),
    new ReportsLeftMenuItemReport('Tech ticket report', 'tech-ticket'),
    new ReportsLeftMenuItemReport('Tech service report', 'tech-service')], this.getPermissions('VIEW_PERFORMANCE_REPORT')));
    this.list.push(new ReportsLeftMenuItem("icon__tickets", "TICKETS", [new ReportsLeftMenuItemReport('Tickets report', 'ticket-report'),
    new ReportsLeftMenuItemReport('Service report', 'service-report')], this.getPermissions('VIEW_PERFORMANCE_REPORT')));
    this.list.push(new ReportsLeftMenuItem("icon__income", "INCOME ACCOUNTS", [new ReportsLeftMenuItemReport('Income account report', 'income-accounts')], this.getPermissions('VIEW_PERFORMANCE_REPORT')));
  }
  isActive(route) {
    return localStorage.report == route;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  public goToState(state) {
    localStorage.setItem('report', state);
    this.leftPanelStateService.goToState(state);
  }
  public trackById(index, item) {
    return item.id;
  }
}
