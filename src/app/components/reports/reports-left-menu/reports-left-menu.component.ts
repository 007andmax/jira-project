import { Component, OnInit } from '@angular/core';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { ReportsStateService } from 'src/app/states/reports/reports-state.service';
import { ReportsLeftMenuItem } from './class/reports-left-menu-item';
import { ReportsLeftMenuItemReport } from './class/reports-left-menu-item-report';

@Component({
  selector: 'reports-left-menu',
  templateUrl: './reports-left-menu.component.html',
  styleUrls: ['./reports-left-menu.component.scss']
})
export class ReportsLeftMenuComponent implements OnInit {
  opened: boolean = false;
  list: Array<ReportsLeftMenuItem> = [];
  constructor(private reportsStateService: ReportsStateService,
    private leftPanelStateService: LeftPanelStateService) { }

  ngOnInit() {
    this.list.push(new ReportsLeftMenuItem("icon__sales", "SALES", [new ReportsLeftMenuItemReport('Product sales report', 'byProducts'),
    new ReportsLeftMenuItemReport('Customer sales report', 'byCustomers')]));
    this.list.push(new ReportsLeftMenuItem("icon__taxes", "TAXES", [new ReportsLeftMenuItemReport('Tax report', 'byTaxes')]));
    this.list.push(new ReportsLeftMenuItem("icon__commision", "COMMISSIONS", [new ReportsLeftMenuItemReport('Common report', 'common-commissions'),
    new ReportsLeftMenuItemReport('Detailed report', 'detailed-commissions')]));
    this.list.push(new ReportsLeftMenuItem("icon__financial", "FINANCIAL", [new ReportsLeftMenuItemReport('Accounts receivable report', 'accounts-receivable'),
    new ReportsLeftMenuItemReport('Accounting report', 'accounting-report'),
    new ReportsLeftMenuItemReport('Payments report', 'payments-report')]));
    this.list.push(new ReportsLeftMenuItem("icon__remote-access", "REMOTE_ACCESS", [new ReportsLeftMenuItemReport('Remote connection report', 'remote-access')]));
    this.list.push(new ReportsLeftMenuItem("icon__devices", "DEVICES", [new ReportsLeftMenuItemReport('Software Summary report', 'software-summary'),
    new ReportsLeftMenuItemReport('Hardware Summary reports', 'hardware-summary'),
    new ReportsLeftMenuItemReport('Device IP Summary report', 'device-ip-summary')]));
    this.list.push(new ReportsLeftMenuItem("icon__performance", "PERFORMANCE", [new ReportsLeftMenuItemReport('Tech sales report', 'tech-sales'),
    new ReportsLeftMenuItemReport('Tech ticket report', 'tech-ticket'),
    new ReportsLeftMenuItemReport('Tech service report', 'tech-service')]));
    this.list.push(new ReportsLeftMenuItem("icon__tickets", "TICKETS", [new ReportsLeftMenuItemReport('Tickets report', 'ticket-report'),
    new ReportsLeftMenuItemReport('Service report', 'service-report')]));
    this.list.push(new ReportsLeftMenuItem("icon__income", "INCOME_ACCOUNTS", [new ReportsLeftMenuItemReport('Income account report', 'income-accounts')]));

    this.reportsStateService.onToggleLeftMenu.subscribe(data => {
      this.opened = true;
    })
  }
  isActive(route) {
    return localStorage.report == route;
  }
  public goToState(state) {
    localStorage.setItem('report', state);
    this.leftPanelStateService.goToState(state);
  }
  public trackById(index, item) {
    return item.id;
  }
  close() {
    this.opened = false;
  }
}
