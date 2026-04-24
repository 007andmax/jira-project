import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-overview-report',
  templateUrl: './overview-report.component.html',
  styleUrls: ['./overview-report.component.scss']
})
export class OverviewReportComponent implements OnInit {
  @Input() classes = [];
  @Input() styles = [];
  @Input() headers = [];
  @Input() list = [];
  constructor(public cd: ChangeDetectorRef) { }

  ngOnInit() {
  }
  public trackByIndex(index, item) {
    return index;
  }
}
