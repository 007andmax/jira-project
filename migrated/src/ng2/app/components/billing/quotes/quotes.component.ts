import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { QuoteService } from '../../../services/quote/quote.service';
import { CompaniesService } from '../../../services/company/companies.service';
import { QUOTE_STATUS } from '../../../const/quote-status';
import { DateService } from "../../../services/date/date.service";
import { Router } from "@angular/router";
import {QuoteStateService} from "./quote-create/quote-state.service";

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

  getQuotes() {
    this.quoteServices.getQuotes(this.dataToSend).subscribe((res: any) => {
      this.quotesList = [...this.quotesList, ...res];
      this.dataToSend.page += 1;
      this.infiniteScrollDisabled = false;
    })
  }

  getDate(value) {
    return this.dateService.getFormatDate(new Date(value));
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

  public setNumberEnter(event?) {
    if (event.key === "Enter") {
      this.dataToSend.number = this.searchNumber;
      this.refreshQuoteAndPage();
      this.getQuotes();
    }

  }

  public setNumberOnBlur(event?) {
    this.dataToSend.number = this.searchNumber;
    this.refreshQuoteAndPage();
    this.getQuotes();
  }

  public setStatus(item) {
    this.selectedStatus = item.name;
    this.dataToSend.status = item.type;
    this.refreshQuoteAndPage();
    this.getQuotes();
  }

  public getClass(className) {
    return className === 'EXPIRED' || className === 'REFUSED' ? 'error-status' :
      className === 'READ' ? 'status-in-progress' :
        className === 'DRAFT' ? 'changing-status' :
          className === 'UNREAD' ? 'status-warning' :
            'success-status'
  }

  goToCreate(){
    console.log('test');
    this.quoteStateService.goToCreate();
  }

}
