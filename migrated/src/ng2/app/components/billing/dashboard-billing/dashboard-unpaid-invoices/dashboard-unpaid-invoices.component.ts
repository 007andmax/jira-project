import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-unpaid-invoices',
  templateUrl: './dashboard-unpaid-invoices.component.html',
  styleUrls: ['./dashboard-unpaid-invoices.component.scss']
})
export class DashboardUnpaidInvoicesComponent implements OnInit {
  @Input() totalReceivableUnpaid:number;
  constructor() { }

  ngOnInit() {
  }

}
