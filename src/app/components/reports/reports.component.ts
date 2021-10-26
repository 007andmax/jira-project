import { Component, OnInit } from '@angular/core';
import { PermissionsService } from '../../services/permissions/permissions.service';
import { LeftPanelStateService } from '../../states/left-panel/left-panel-state.service';
import { QuoteStateService } from '../../states/quote/quote-state.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  listSalesTitles: Array<string> = [];
  listSalesStates: Array<string> = [];
  title: string = 'Reports';
  constructor(private leftPanelStateService: LeftPanelStateService,
    private quoteStateService: QuoteStateService,
    private permissionsService: PermissionsService,) { }

  ngOnInit() {

  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  public goToState(state) {
    localStorage.setItem('report', state);
    this.leftPanelStateService.goToState(state);
  }
  public getListTitles(type) {
    if (type === 'SALES') return ['Product sales report', 'Customer sales report'];
    if (type === 'TAXES') return ['Tax report'];
    if (type === 'COMMISSIONS') return ['Common report', 'Detailed report'];
    if (type === 'FINANCIAL') return ['Accounts receivable report', 'Accounting report'];
    if (type === 'REMOTE_ACCESS') return ['Remote connection report'];
    if (type === 'DEVICES') return ['Device Summary report', 'Software Summary report', 'Hardware Summary reports', 'Device IP Summary report'];
    if (type === 'PERFORMANCE') return ['Tech sales report', 'Tech ticket report', 'Tech service report'];
    if (type === 'TICKETS') return ['Tickets report', 'Service report'];
    if (type === 'INCOME_ACCOUNTS') return ['Income account report'];
  }
  public getListStates(type) {
    if (type === 'SALES') return ['byProducts', 'byCustomers'];
    if (type === 'TAXES') return ['byTaxes'];
    if (type === 'COMMISSIONS') return ['common-commissions', 'detailed-commissions'];
    if (type === 'FINANCIAL') return ['accounts-receivable', 'accounting-report'];
    if (type === 'REMOTE_ACCESS') return ['remote-access'];
    if (type === 'DEVICES') return ['report-device-summary', 'software-summary', 'hardware-summary', 'device-ip-summary'];
    if (type === 'PERFORMANCE') return ['tech-sales', 'tech-ticket', 'tech-service'];
    if (type === 'TICKETS') return ['ticket-report', 'service-report'];
    if (type === 'INCOME_ACCOUNTS') return ['income-accounts'];
  }

  search(){

  }
}
