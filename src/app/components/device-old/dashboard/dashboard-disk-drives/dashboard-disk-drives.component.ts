import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'dashboard-disk-drives',
    templateUrl: './dashboard-disk-drives.component.html',
    styleUrls: ['./dashboard-disk-drives.component.scss'],
    standalone: true
})
export class DashboardDiskDrivesComponent implements OnInit {
  @Input() logicalDisk: any = [];
  @Input() convertToGB: Function;
  constructor() { }

  ngOnInit() {
  }
  diskSpaceDiff(v1, v2) {
    let val1 = (parseInt(v1) / 1024 / 1024 / 1024).toFixed(2)
    let val2 = (parseInt(v2) / 1024 / 1024 / 1024).toFixed(2)
    return (parseFloat(val1) - parseFloat(val2)).toFixed(2)
  }
}
