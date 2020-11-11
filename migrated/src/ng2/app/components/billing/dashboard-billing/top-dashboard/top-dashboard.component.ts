import { Component, Input, OnInit } from '@angular/core';
import { TopDashboardSum } from '../class/top-dashboard-sum';

@Component({
  selector: 'app-top-dashboard',
  templateUrl: './top-dashboard.component.html',
  styleUrls: ['./top-dashboard.component.scss']
})
export class TopDashboardComponent implements OnInit {
  @Input() title: string;
  @Input() list: Array<TopDashboardSum> = [];
  constructor() { }

  ngOnInit() {
  }

}
