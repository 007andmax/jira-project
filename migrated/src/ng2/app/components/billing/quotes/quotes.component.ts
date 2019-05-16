import { Component, OnInit } from '@angular/core';
import { QuoteService } from "../../../services/quote/quote.service";
import { CompaniesService } from "../../../services/company/companies.service";

/**
 * Password quotes component
 */
@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {

  public quotesList = [];
  public page = 0;
  public dataToSend = {
    startDate: null,
    endDate: null,
    company: null,
    page: 0,
    type: null
  };
  public infiniteScrollDisabled = false;

  constructor(
    private quoteServices: QuoteService,
    private companiesService: CompaniesService
  ) { }

  ngOnInit() {
    this.getQuotes();
    this.companiesService.getCompaniesList();
  }

  getQuotes() {
    this.quoteServices.getQuotes(this.dataToSend).subscribe((res: any) => {
      this.quotesList = [...this.quotesList, ...res];
      this.dataToSend.page += 1;
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
    this.dataToSend.type = value;
    this.getQuotes()
  }

  public filterByDate(value) {
    this.refreshQuoteAndPage();
    this.setDate(value);
    this.getQuotes()
  }

  private setDate(value) {
    this.dataToSend.startDate = value.start;
    this.dataToSend.endDate = value.end;
  }

  private refreshQuoteAndPage() {
    this.quotesList = [];
    this.dataToSend.page = 0;
  }

  public selectClient(value) {
    this.refreshQuoteAndPage();
    this.dataToSend.company = (value && value.item) ? value.item.id : null;
    this.getQuotes();
  }

}
