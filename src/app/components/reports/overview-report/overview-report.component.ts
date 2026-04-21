import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
    selector: 'app-overview-report',
    templateUrl: './overview-report.component.html',
    styleUrls: ['./overview-report.component.scss'],
    standalone: true
})
export class OverviewReportComponent implements OnInit {
  @Input() classes = [];
  @Input() styles = [];
  @Input() headers = [];
  @Input() list = [];
  constructor() { }

  ngOnInit() {
  }
  public trackByIndex(index, item) {
    return index;
  }
}
