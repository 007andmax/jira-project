import { Component, Input, OnInit } from '@angular/core';
import { TopDashboardSum } from '../class/top-dashboard-sum';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-top-dashboard',
    templateUrl: './top-dashboard.component.html',
    styleUrls: ['./top-dashboard.component.scss'],
    standalone: true,
    imports: [NgIf, NgbTooltipModule, NgFor, CurrencyPipe]
})
export class TopDashboardComponent implements OnInit {
  @Input() title: string;
  @Input() list: Array<TopDashboardSum> = [];
  @Input() tooltip: string;
  constructor() { }

  ngOnInit() {
  }

}
