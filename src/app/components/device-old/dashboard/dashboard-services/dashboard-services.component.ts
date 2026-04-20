import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'dashboard-services',
    templateUrl: './dashboard-services.component.html',
    styleUrls: ['./dashboard-services.component.scss'],
    standalone: true
})
export class DashboardServicesComponent implements OnInit {
  @Input() virusInfo: any = [];
  constructor() { }

  ngOnInit() {
  }

}
