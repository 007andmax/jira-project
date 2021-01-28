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
    this.quoteStateService.goToState(state);
  }
  public getListTitles(type) {
    if (type === 'Sales') return ['Product sales report', 'Customer sales report'];
    if (type === 'Taxes') return ['Tax report'];
    if (type === 'Commissions') return ['Common report', 'Detailed report'];
    if (type === 'Financial') return ['Accounts receivable report', 'Accounting report'];
    if (type === 'Remote Access') return ['Remote connection report'];
    if (type === 'Devices') return ['Software Summary report', 'Hardware Summary reports', 'Device IP Summary report'];
    if (type === 'Performance') return ['Tech sales report', 'Tech ticket report', 'Tech service report'];
    if (type === 'Tickets') return ['Tickets report', 'Service report'];
    if (type === 'Income accounts') return ['Income account report'];
  }
  public getListStates(type) {
    if (type === 'Sales') return ['byProducts', 'byCustomers'];
    if (type === 'Taxes') return ['byTaxes'];
    if (type === 'Commissions') return ['commissionsReport-common', 'commissionsReport-detailed'];
    if (type === 'Financial') return ['accounts-receivable', 'accounting-report'];
    if (type === 'Remote Access') return ['remoteAccess'];
    if (type === 'Devices') return ['software-summary', 'hardware-summary', 'device-ip-summary'];
    if (type === 'Performance') return ['techReport-ProductSales', 'techReport-TicketCreated', 'tech-service'];
    if (type === 'Tickets') return ['ticket-report', 'service-report'];
    if (type === 'Income accounts') return ['income-accounts'];
  }
}
