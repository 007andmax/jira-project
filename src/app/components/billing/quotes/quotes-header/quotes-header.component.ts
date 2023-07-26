import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AppService } from 'src/app/states/app/app.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { QuotesFilterComponent } from './quotes-filter/quotes-filter.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
@Component({
  selector: 'app-quotes-header',
  templateUrl: './quotes-header.component.html',
  styleUrls: ['./quotes-header.component.scss']
})
export class QuotesHeaderComponent implements OnInit {
  @ViewChild('filter', { static: true }) filter: QuotesFilterComponent;
  countFilter: number = 0;
  toggleFilter: boolean = false;
  @Output() onCreatePayment = new EventEmitter<any>();
  @Output() onSortBy = new EventEmitter<any>();
  constructor(private quoteStateService: QuoteStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public appService: AppService,) { }

  ngOnInit() {
    if (this.appService.checkMobile()) this.toggleFilter = true;
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
