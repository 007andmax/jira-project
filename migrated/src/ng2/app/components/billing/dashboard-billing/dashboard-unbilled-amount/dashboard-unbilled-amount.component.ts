import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-unbilled-amount',
  templateUrl: './dashboard-unbilled-amount.component.html',
  styleUrls: ['./dashboard-unbilled-amount.component.scss']
})
export class DashboardUnbilledAmountComponent implements OnInit {
  @Input() totalBillable:number;
  constructor() { }

  ngOnInit() {
  }

}
