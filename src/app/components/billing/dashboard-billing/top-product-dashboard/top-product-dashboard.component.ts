import { Component, Input, OnInit } from '@angular/core';
import { TopDashboardProductSum } from '../class/top-dashboard-product-sum';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-top-product-dashboard',
    templateUrl: './top-product-dashboard.component.html',
    styleUrls: ['./top-product-dashboard.component.scss'],
    standalone: true,
    imports: [NgIf, NgbTooltipModule, NgFor, CurrencyPipe]
})
export class TopProductDashboardComponent implements OnInit {
  @Input() title: string;
  @Input() list: Array<TopDashboardProductSum> = [];
  @Input() tooltip: string;
  constructor() { }

  ngOnInit() {
  }

}
