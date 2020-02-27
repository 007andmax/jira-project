import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-overview-report',
  templateUrl: './overview-report.component.html',
  styleUrls: ['./overview-report.component.scss']
})
export class OverviewReportComponent implements OnInit {
  @Input() headers = [];
  @Input() list = [];
  constructor() { }

  ngOnInit() {
  }
  public trackByIndex(index, item) {
    return index;
  }
}
