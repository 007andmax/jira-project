import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { QuoteStateService } from 'src/ng2/app/states/quote/quote-state.service';
import { QuotesFilterComponent } from './quotes-filter/quotes-filter.component';
@Component({
  selector: 'app-quotes-header',
  templateUrl: './quotes-header.component.html',
  styleUrls: ['./quotes-header.component.scss']
})
export class QuotesHeaderComponent implements OnInit {

  @ViewChild('filter') filter: QuotesFilterComponent;
  countFilter: number = 0;
  toggleFilter: boolean = true;
  @Output() onCreatePayment = new EventEmitter<any>();
  @Output() onSortBy = new EventEmitter<any>();
  constructor(private quoteStateService: QuoteStateService) { }

  ngOnInit() {
  }
  sortBy(data) {
    this.onSortBy.emit(data);
  }
  clearAll() {
    this.filter.onClearAll();
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  onShowCreatePayment() {
    this.onCreatePayment.emit(null);
  }
  onShowCreateQuote() {
    this.quoteStateService.onInitAdd();
  }

}
