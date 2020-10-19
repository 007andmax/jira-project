import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { QuoteService } from 'src/ng2/app/services/quote/quote.service';
import { Quote } from '../class/quote';
import { QuoteFilter } from '../class/quote-filter';
import { QuotesListService } from './services/quotes-list.service';

@Component({
  selector: 'app-quotes-table',
  templateUrl: './quotes-table.component.html',
  styleUrls: ['./quotes-table.component.scss'],
  providers: [QuotesListService]
})
export class QuotesTableComponent implements OnInit {
  filter: QuoteFilter = new QuoteFilter();
  quotes:Array<Quote> = [];
  showPendingPreloader: boolean = false;
  showPreloader: boolean = true;
  public page_number: number = 0;
  public infiniteScrollDisabled = true;
  constructor(private quotesListService:QuotesListService,
    public cd: ChangeDetectorRef,
    private quoteServices: QuoteService,) { }

  ngOnInit() {
  //  window.scrollTo(0, 0);
    this.onScroll();
  }
  getQuotes() {
    if (this.quotesListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    console.log("this.quotesListService.getBlockList()",this.quotesListService.getBlockList());
    
    console.log("this.page_number * this.filter.limit",this.page_number * this.filter.limit);
    console.log('this.filter.limit',this.filter.limit);
    console.log("this.filter.getFIlter()",this.filter.getFIlter());
    this.filter.setOffset(this.page_number * this.filter.limit);
    if (this.page_number > 0) this.showPendingPreloader = true;
    this.quoteServices.getQuotes(this.filter.getFIlter()).subscribe((data: any) => {
      this.quotes = [...this.quotes, ...data];
      console.log("this.quotes",this.quotes);
      this.infiniteScrollDisabled = false;
      if (data.length < this.filter.limit)    this.quotesListService.setBlockList(true);
      this.page_number += 1;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.cd.detectChanges();
    })
  }
  public onScroll() {
    console.log("onScroll");
    this.infiniteScrollDisabled = true;
    this.getQuotes();
  }

}
