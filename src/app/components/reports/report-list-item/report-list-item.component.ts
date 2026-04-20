import { Component, Input, OnInit } from '@angular/core';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-report-list-item',
    templateUrl: './report-list-item.component.html',
    styleUrls: ['./report-list-item.component.scss'],
    standalone: true,
    imports: [NgFor]
})
export class ReportListItemComponent implements OnInit {
  @Input() title: string;
  @Input() img: string;
  @Input() listTitles: Array<string> = [];
  @Input() listStates: Array<string> = [];
  @Input() class: string;
  constructor(private leftPanelStateService: LeftPanelStateService,) { }

  ngOnInit() {
  }
  public goToState(state) {
    localStorage.setItem('report', state);
    this.leftPanelStateService.goToState(state);
    this.leftPanelStateService.onActivePageReport(state);
  }
  public trackByIndex(index, item) {
    return index;
  }
}
