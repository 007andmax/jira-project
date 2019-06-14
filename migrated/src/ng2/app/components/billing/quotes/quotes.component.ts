import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { QuoteService } from '../../../services/quote/quote.service';
import { CompaniesService } from '../../../services/company/companies.service';
import { QUOTE_STATUS } from '../../../const/quote-status';
import { DateService } from "../../../services/date/date.service";
import { QuoteStateService } from "./quote-create/quote-state.service";
import { QuoteRealTimeService } from "./quote-realtime.service";
import {ModalQuoteComponent} from "../../../services/modal/modal-quote/modal-quote.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

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
   * @param {QuoteRealTimeService} quoteRealTimeService to work quote state
   * @param {NgbModal} modalService to work quote state
   */
  constructor(
    private quoteServices: QuoteService,
    private companiesService: CompaniesService,
    private dateService: DateService,
    private cdRef:ChangeDetectorRef,
    private quoteStateService: QuoteStateService,
    private quoteRealTimeService: QuoteRealTimeService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getQuotes();
    this.companiesService.getCompaniesList();
    this.changeQuotesListItem();
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

  goToPreview(quote) {
    this.quoteStateService.goToPreview(quote);
  }

  public checkStatus(quote, statusForShowingArray) {
    const elems = statusForShowingArray.filter((item) => item.toLowerCase() === quote.status.toLowerCase());
    return elems.length > 0;
  }

  /**
   * convert Quote to invoice
   */
  convertToInvoice(item) {
    this.quoteServices.convertToInvoice({companyInfo: item.company}, item.id).subscribe((res) => {
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
   * archive quote
   */
  archiveQuote(item) {
    this.quoteServices.archiveQuote(item.company, item.id).subscribe((res) => {
      console.log(res, 'RES');
    });
  }

  /**
   * archive quote
   */
  approveQuote(item) {
    this.quoteServices.approveQuote(item.company, item.id).subscribe((res) => {
      console.log(res, 'RES');
    });
  }

  public changeQuotesListItem() {
    this.quoteRealTimeService.changeQuotesArray.subscribe((newChange) => {
      if (newChange.action === 'SALE_QUOTE_CREATED') {
        return this.quotesList.push(newChange.data);
      } else {
        const elemIndex = this.quotesList.findIndex((item) => item.id === newChange.data.id);
        return this.quotesList[elemIndex] = newChange.data;
      }
    })
  }

  /**
   * open send modal for resend
   */
  public resend(item) {
    console.log(item, 'item');
    if (item.status === 'DRAFT' || item.status === 'INVOICED') {
      this.quoteServices.repeatSend(item.id).subscribe((res) => {
        console.log(res, '99999');
      });
    } else {
      const modalRef = this.modalService.open(ModalQuoteComponent,  item);
      modalRef.componentInstance.data = item;
    }

  }

}
