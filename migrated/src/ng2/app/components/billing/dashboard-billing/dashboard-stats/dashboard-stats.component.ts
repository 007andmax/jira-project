import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-stats',
  templateUrl: './dashboard-stats.component.html',
  styleUrls: ['./dashboard-stats.component.scss']
})
export class DashboardStatsComponent implements OnInit {
  @Input() class: string;
  @Input() total: number;
  @Input() title: string;
  constructor() { }

  ngOnInit() {
  }

}
