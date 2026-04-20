import { Component, Input, OnInit } from '@angular/core';
import { DashboardSaleQuoteCounters } from '../class/dashboard-sale-quote-counters';
import { NgIf, NgStyle } from '@angular/common';

@Component({
    selector: 'app-dashboard-quotes',
    templateUrl: './dashboard-quotes.component.html',
    styleUrls: ['./dashboard-quotes.component.scss'],
    standalone: true,
    imports: [NgIf, NgStyle]
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
