import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-total-quotes',
  templateUrl: './dashboard-total-quotes.component.html',
  styleUrls: ['./dashboard-total-quotes.component.scss']
})
export class DashboardTotalQuotesComponent implements OnInit {
 @Input() saleQuotesPossibleRevenue:number;
  constructor() { }

  ngOnInit() {
  }

}
