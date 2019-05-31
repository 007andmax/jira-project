import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { QuoteService } from '../../../services/quote/quote.service';
import { CompaniesService } from '../../../services/company/companies.service';
import { QUOTE_STATUS } from '../../../const/quote-status';
import { DateService } from "../../../services/date/date.service";
import { QuoteStateService } from "./quote-create/quote-state.service";

/**
 * Password quotes component
 */
@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
})
export class QuotesComponent implements OnInit {

  public quotesList = [];
  public page = 0;
  public searchNumber: number;
  public quoteStatuses = QUOTE_STATUS;
  public selectedStatus = '';
  public dataToSend = {
    startDate: null,
    endDate: null,
    company: null,
    page: 0,
    type: null,
    number: undefined,
    status: undefined
  };
  public infiniteScrollDisabled = false;

  /**
   * Creates an instance of the QuoteCreateContentComponent with the injected services
   * @param {QuoteService} quoteServices to work with api
   * @param {CompaniesService} companiesService Service to work with companies api
   * @param {DateService} dateService Service to work with date
   * @param {ChangeDetectorRef} cdRef Service to work with date
   * @param {QuoteStateService} quoteStateService to work quote state
   */
  constructor(
    private quoteServices: QuoteService,
    private companiesService: CompaniesService,
    private dateService: DateService,
    private cdRef:ChangeDetectorRef,
    private quoteStateService: QuoteStateService
  ) { }

  ngOnInit() {
    this.getQuotes();
    this.companiesService.getCompaniesList();
    if (!this.cdRef['destroyed']) {
      this.cdRef.detectChanges();
    }
  }

  /**
   *
   */
  public getQuotes() {
    this.quoteServices.getQuotes(this.dataToSend).subscribe((res: any) => {
      this.quotesList = [...this.quotesList, ...res];
      this.dataToSend.page += 1;
      this.infiniteScrollDisabled = false;
    })
  }

  /**
   *
   */
  public getDate(value) {
    return this.dateService.getFormatDate(new Date(value));
  }

  /**
   *
   */
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getQuotes();
  }

  /**
   *
   */
  public sortBy(value) {
    this.refreshQuoteAndPage();
    this.dataToSend.type = value;
    this.getQuotes()
  }

  /**
   *
   */
  public filterByDate(value) {
    this.refreshQuoteAndPage();
    this.setDate(value);
    this.getQuotes()
  }

  /**
   *
   */
  private setDate(value) {
    this.dataToSend.startDate = value.start;
    this.dataToSend.endDate = value.end;
  }

  /**
   *
   */
  private refreshQuoteAndPage() {
    this.quotesList = [];
    this.dataToSend.page = 0;
  }

  /**
   *
   */
  public selectClient(value) {
    this.refreshQuoteAndPage();
    this.dataToSend.company = (value && value.item) ? value.item.name : null;
    this.getQuotes();
  }

  /**
   *
   */
  public setNumberEnter(event?) {
    if (event.key === "Enter") {
      this.dataToSend.number = this.searchNumber;
      this.refreshQuoteAndPage();
      this.getQuotes();
    }

  }

  /**
   *
   */
  public setNumberOnBlur(event?) {
    this.dataToSend.number = this.searchNumber;
    this.refreshQuoteAndPage();
    this.getQuotes();
  }

  /**
   *
   */
  public setStatus(item) {
    this.selectedStatus = item.name;
    this.dataToSend.status = item.type;
    this.refreshQuoteAndPage();
    this.getQuotes();
  }

  /**
   * add status class for quotes
   */
  public getClass(className) {
    return className === 'EXPIRED' || className === 'REFUSED' ? 'error-status' :
      className === 'READ' ? 'status-in-progress' :
        className === 'DRAFT' ? 'changing-status' :
          className === 'UNREAD' ? 'status-warning' :
            'success-status'
  }

  /**
   * Go to create state
   */
  goToCreate() {
    this.quoteStateService.goToCreate();
  }

  goToQuoteEdit(quote) {
    this.quoteStateService.setEditQuote(quote);
  }

  public checkStatus(quote, statusForShowingArray) {
    const elems = statusForShowingArray.filter((item) => item.toLowerCase() === quote.status.toLowerCase());
    return elems.length > 0;
  }

  /**
   * convert Quote to invoice
   */
  convertToInvoice(item) {
    console.log(item, 'ITEM');
    this.quoteServices.convertToInvoice(item.company, item.id).subscribe((res) => {
      console.log(res, 'RES');
    });
  }

  /**
   * convert Quote to ticket
   */
  convertToTicket(item) {
    this.quoteServices.convertToTicket(item.company, item.id).subscribe((res) => {
      console.log(res, 'RES');
    });
  }

  /**
   * refuse quote
   */
  refuseQuote(item) {
    this.quoteServices.refuseQuote(item.company, item.id).subscribe((res) => {
      console.log(res, 'RES');
    });
  }

  /**
   * refuse quote
   */
  archiveQuote(item) {
    this.quoteServices.archiveQuote(item.company, item.id).subscribe((res) => {
      console.log(res, 'RES');
    });
  }

  public changeQuotesListItem(quote) {
    this.quotesList.map((item) => {
      // item.id === quote.id ? quote
    })
  }

}
