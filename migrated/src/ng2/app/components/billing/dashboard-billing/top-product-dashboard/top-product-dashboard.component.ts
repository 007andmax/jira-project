import { Component, Input, OnInit } from '@angular/core';
import { TopDashboardProductSum } from '../class/top-dashboard-product-sum';
import { TopDashboardSum } from '../class/top-dashboard-sum';

@Component({
  selector: 'app-top-product-dashboard',
  templateUrl: './top-product-dashboard.component.html',
  styleUrls: ['./top-product-dashboard.component.scss']
})
export class TopProductDashboardComponent implements OnInit {
  @Input() title: string;
  @Input() list: Array<TopDashboardProductSum> = [];
  constructor() { }

  ngOnInit() {
  }

}
