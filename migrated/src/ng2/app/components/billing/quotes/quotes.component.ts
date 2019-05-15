import {Component, OnInit} from '@angular/core';
import {QuoteService} from "../../../services/quote/quote.service";
import {map, tap} from "rxjs/operators";

/**
 * Password quotes component
 */
@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {

  public quotesList: any;
  public page = 0;
  public infiniteScrollDisabled = false;

  constructor(
    private quoteServices: QuoteService
  ) { }

  ngOnInit() {
    this.getQuotes();
  }

  getQuotes(data?) {
    const reqData = data ? data : {page: this.page};
    this.quoteServices.getQuotes(reqData).subscribe((res: any) => {
      this.quotesList = [...this.quotesList, ...res];
      this.page += 1;
      this.infiniteScrollDisabled = false;
    })

  }

  getDate(value) {
    return new Date(value);
  }

  onScroll() {
    this.infiniteScrollDisabled = true;
    this.getQuotes();
  }

  public sortBy(value) {
    this.refreshQuoteAndPage();
    this.getQuotes({
      page: this.page,
      type: value
    })
  }

  public filterByDate(value) {
    console.log(value, 'VALUe');
    this.refreshQuoteAndPage();
    this.getQuotes({
      page: this.page,
      date: value.start,
      endDate: value.end
    })
  }

  private refreshQuoteAndPage() {
    this.quotesList = null;
    this.page = 0;
  }

}
