import { Component, Input, OnInit } from '@angular/core';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';

@Component({
  selector: 'app-report-list-item',
  templateUrl: './report-list-item.component.html',
  styleUrls: ['./report-list-item.component.scss']
})
export class ReportListItemComponent implements OnInit {
  @Input() title: string;
  @Input() img: string;
  @Input() listTitles: Array<string> = [];
  @Input() listStates: Array<string> = [];
  constructor(private leftPanelStateService: LeftPanelStateService,) { }

  ngOnInit() {
  }
  public goToState(state) {
    localStorage.setItem('report', state);
    this.leftPanelStateService.goToState(state);
  }
  public trackByIndex(index, item) {
    return index;
  }
}
