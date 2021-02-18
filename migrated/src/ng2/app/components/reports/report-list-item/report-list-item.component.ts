import { Component, Input, OnInit } from '@angular/core';
import { QuoteStateService } from 'src/ng2/app/states/quote/quote-state.service';

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
  constructor(private quoteStateService: QuoteStateService,) { }

  ngOnInit() {
  }
  public goToState(state) {
    localStorage.setItem('report', state);
    this.quoteStateService.goToState(state);
  }
  public trackByIndex(index, item) {
    return index;
  }
}
