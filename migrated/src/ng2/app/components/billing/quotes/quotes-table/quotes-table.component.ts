import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuoteService } from 'src/ng2/app/services/quote/quote.service';
import { Quote } from '../class/quote';
import { QuoteFilter } from '../class/quote-filter';
import { QuoteStateService } from '../quote-create/quote-state.service';
import { QuotesListService } from './services/quotes-list.service';

@Component({
  selector: 'app-quotes-table',
  templateUrl: './quotes-table.component.html',
  styleUrls: ['./quotes-table.component.scss'],
  providers: [QuotesListService]
})
export class QuotesTableComponent implements OnInit {
  filter: QuoteFilter = new QuoteFilter();
  quotes: Array<Quote> = [];
  showPendingPreloader: boolean = false;
  showPreloader: boolean = true;
  public page_number: number = 0;
  public infiniteScrollDisabled = true;
  sub: Subscription = new Subscription();
  constructor(private quotesListService: QuotesListService,
    public cd: ChangeDetectorRef,
    private quoteStateService: QuoteStateService,
    private quoteServices: QuoteService,) { }

  ngOnInit() {
    console.log("QuotesTableComponent");
    window.scrollTo(0, 0);
    this.onScroll();
    let getOnInitFilter = this.quoteStateService.getOnInitFilter().subscribe(data => {
    //  this.selectedPayments = [];
    //  this.selectedCompanyId = null;
      this.filter = data;
      this.showPreloader = true;
      window.scrollTo(0, 0);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(getOnInitFilter);
  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.quotesListService.setBlockList(false);
    this.quotes = [];
  }
  getQuotes() {
    if (this.quotesListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.filter.setOffset(this.page_number * this.filter.limit);
    if (this.page_number > 0) this.showPendingPreloader = true;
    this.quoteServices.getQuotes(this.filter.getFIlter()).subscribe((data: any) => {
      this.quotes = [...this.quotes, ...data];
      this.infiniteScrollDisabled = false;
      if (data.length < this.filter.limit) this.quotesListService.setBlockList(true);
      this.page_number += 1;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.cd.detectChanges();
    })
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getQuotes();
  }

}
