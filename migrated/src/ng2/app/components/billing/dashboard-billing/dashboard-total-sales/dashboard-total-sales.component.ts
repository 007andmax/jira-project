import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-total-sales',
  templateUrl: './dashboard-total-sales.component.html',
  styleUrls: ['./dashboard-total-sales.component.scss']
})
export class DashboardTotalSalesComponent implements OnInit {
  
  @Input() totalSales:number;
  constructor() { }

  ngOnInit() {
  }

}
