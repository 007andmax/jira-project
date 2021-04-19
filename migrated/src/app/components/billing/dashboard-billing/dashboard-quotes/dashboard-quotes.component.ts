import { Component, Input, OnInit } from '@angular/core';
import { DashboardSaleQuoteCounters } from '../class/dashboard-sale-quote-counters';

@Component({
  selector: 'app-dashboard-quotes',
  templateUrl: './dashboard-quotes.component.html',
  styleUrls: ['./dashboard-quotes.component.scss']
})
export class DashboardQuotesComponent implements OnInit {
  @Input() stats: DashboardSaleQuoteCounters;
  constructor() { }

  ngOnInit() {

  }
  public getProcent(value) {
    return value /  this.stats.getTotal() * 100;
  }
}
