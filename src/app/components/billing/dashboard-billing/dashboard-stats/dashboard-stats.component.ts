import { Component, Input, OnInit } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'app-dashboard-stats',
    templateUrl: './dashboard-stats.component.html',
    styleUrls: ['./dashboard-stats.component.scss'],
    standalone: true,
    imports: [NgIf, NgbTooltipModule, NgClass]
})
export class DashboardStatsComponent implements OnInit {
  @Input() class: string;
  @Input() total;
  @Input() title: string;
  @Input() tooltip: string;
  @Input() customTooltipClass: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
