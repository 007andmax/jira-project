import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { UsersRealTimeService } from 'src/app/states/users/users-real-time.service';
import { ReportsLeftMenuItem } from './class/reports-left-menu-item';
import { ReportsLeftMenuItemReport } from './class/reports-left-menu-item-report';
import { RightClickBlankDirective } from '../../../directives/right-click-blank/right-click-blank.directive';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-left-panel-reports',
    templateUrl: './left-panel-reports.component.html',
    styleUrls: ['./left-panel-reports.component.scss'],
    standalone: true,
    imports: [NgClass, RightClickBlankDirective, NgFor, NgIf]
})
export class LeftPanelReportsComponent implements OnInit {
  @Output() onChangeState = new EventEmitter();
  @Input() activePage: string = "";
  list: Array<ReportsLeftMenuItem> = [];
  constructor(private leftPanelStateService: LeftPanelStateService,
    public companiesStateService: CompaniesStateService,
    private permissionsService: PermissionsService) { }

  ngOnInit() {
    this.list.push(new ReportsLeftMenuItem("Sales", [new ReportsLeftMenuItemReport('Product Sales Report', 'byProducts'),
    new ReportsLeftMenuItemReport('Customer Sales Report', 'byCustomers')], 'VIEW_SALES_REPORT'));
    this.list.push(new ReportsLeftMenuItem("Taxes", [new ReportsLeftMenuItemReport('Tax Report', 'byTaxes')], 'VIEW_TAXES_REPORT'));
    this.list.push(new ReportsLeftMenuItem("Commissions", [new ReportsLeftMenuItemReport('Common Report', 'common-commissions'),
    new ReportsLeftMenuItemReport('Detailed Report', 'detailed-commissions')], 'VIEW_SALES_REPORT'));
    this.list.push(new ReportsLeftMenuItem("Financial", [new ReportsLeftMenuItemReport('Accounts Receivable Report', 'accounts-receivable'),
    new ReportsLeftMenuItemReport('Customer Transaction History', 'customer-transaction-history'),
    new ReportsLeftMenuItemReport('Payments Report', 'payments-report')], 'VIEW_FINANCIAL_REPORT'));
    this.list.push(new ReportsLeftMenuItem("Remote Access", [new ReportsLeftMenuItemReport('Remote Connection Report', 'remote-access')], 'VIEW_REMOTE_ACCESS_REPORT'));
    this.list.push(new ReportsLeftMenuItem("Devices", [new ReportsLeftMenuItemReport('Software Summary Report', 'software-summary'),
    new ReportsLeftMenuItemReport('Hardware Summary Reports', 'hardware-summary'),
    new ReportsLeftMenuItemReport('Device IP Summary Report', 'device-ip-summary')], 'VIEW_DEVICES_REPORTS'));
    this.list.push(new ReportsLeftMenuItem("Performance", [new ReportsLeftMenuItemReport('Tech Sales Report', 'tech-sales'),
    new ReportsLeftMenuItemReport('Tech Ticket Report', 'tech-ticket'),
    new ReportsLeftMenuItemReport('Tech Service Report', 'tech-service')], 'VIEW_PERFORMANCE_REPORT'));
    this.list.push(new ReportsLeftMenuItem("Tickets", [new ReportsLeftMenuItemReport('Tickets Report', 'ticket-report'),
    new ReportsLeftMenuItemReport('Service Report', 'service-report'),
    new ReportsLeftMenuItemReport('Block Time Report', 'block-time-report')], 'VIEW_TICKET_REPORT'));
    this.list.push(new ReportsLeftMenuItem("Income Accounts", [new ReportsLeftMenuItemReport('Income Account Report', 'income-accounts')], 'VIEW_SALES_REPORT'));

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
