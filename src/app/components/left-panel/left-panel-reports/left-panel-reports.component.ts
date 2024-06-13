import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { UsersRealTimeService } from 'src/app/states/users/users-real-time.service';
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
    private usersRealTimeService: UsersRealTimeService,
    private permissionsService: PermissionsService) { }

  ngOnInit() {
    this.list.push(new ReportsLeftMenuItem("", "SALES", [new ReportsLeftMenuItemReport('Product sales report', 'byProducts'),
    new ReportsLeftMenuItemReport('Customer sales report', 'byCustomers')], 'VIEW_SALES_REPORT'));
    this.list.push(new ReportsLeftMenuItem("", "TAXES", [new ReportsLeftMenuItemReport('Tax report', 'byTaxes')], 'VIEW_TAXES_REPORT'));
    this.list.push(new ReportsLeftMenuItem("", "COMMISSIONS", [new ReportsLeftMenuItemReport('Common report', 'common-commissions'),
    new ReportsLeftMenuItemReport('Detailed report', 'detailed-commissions')], 'VIEW_SALES_REPORT'));
    this.list.push(new ReportsLeftMenuItem("icon__financial", "FINANCIAL", [new ReportsLeftMenuItemReport('Accounts receivable report', 'accounts-receivable'),
    new ReportsLeftMenuItemReport('Customer Transaction History', 'customer-transaction-history'),
    new ReportsLeftMenuItemReport('Payments report', 'payments-report')], 'VIEW_FINANCIAL_REPORT'));
    this.list.push(new ReportsLeftMenuItem("qt-icon icon__connect", "REMOTE ACCESS", [new ReportsLeftMenuItemReport('Remote connection report', 'remote-access')], 'VIEW_REMOTE_ACCESS_REPORT'));
    this.list.push(new ReportsLeftMenuItem("icon__devices", "DEVICES", [new ReportsLeftMenuItemReport('Software Summary report', 'software-summary'),
    new ReportsLeftMenuItemReport('Hardware Summary reports', 'hardware-summary'),
    new ReportsLeftMenuItemReport('Device IP Summary report', 'device-ip-summary')], 'VIEW_DEVICES_REPORTS'));
    this.list.push(new ReportsLeftMenuItem("icon__performance", "PERFORMANCE", [new ReportsLeftMenuItemReport('Tech sales report', 'tech-sales'),
    new ReportsLeftMenuItemReport('Tech ticket report', 'tech-ticket'),
    new ReportsLeftMenuItemReport('Tech service report', 'tech-service')], 'VIEW_PERFORMANCE_REPORT'));
    this.list.push(new ReportsLeftMenuItem("icon__tickets", "TICKETS", [new ReportsLeftMenuItemReport('Tickets report', 'ticket-report'),
    new ReportsLeftMenuItemReport('Service report', 'service-report'),
    new ReportsLeftMenuItemReport('Block time report', 'block-time-report')], 'VIEW_TICKET_REPORT'));
    this.list.push(new ReportsLeftMenuItem("icon__income", "INCOME ACCOUNTS", [new ReportsLeftMenuItemReport('Income account report', 'income-accounts')], 'VIEW_SALES_REPORT'));

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
