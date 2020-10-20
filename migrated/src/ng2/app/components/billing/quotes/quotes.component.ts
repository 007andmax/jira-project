import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { QuoteService } from '../../../services/quote/quote.service';
import { CompaniesService } from '../../../services/company/companies.service';
import { QUOTE_STATUS } from '../../../const/quote-status';
import { DateService } from "../../../services/date/date.service";
import { QuoteStateService } from "./quote-create/quote-state.service";
import { QuoteRealTimeService } from "./quote-realtime/quote-realtime.service";
import { ModalQuoteComponent } from "../../../services/modal/modal-quote/modal-quote.component";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from 'rxjs';
import { QuoteResult } from './class/quote-result';

import { NotificationStateService } from '../../shared/notification/services/notification-state.service';
import { LeftPanelStateService } from 'src/ng2/app/states/left-panel/left-panel-state.service';

/**
 * Password quotes component
 */
@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss'],
  
})
export class QuotesComponent implements OnInit, OnDestroy {


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
  public showPreloader: boolean = true;
  public quoteResultMessage: string = "";
  public infiniteScrollDisabled = false;
  public sub: Subscription = new Subscription();

  /**
   * Creates an instance of the QuoteCreateContentComponent with the injected services
   * @param {QuoteService} quoteServices to work with api
   * @param {DateService} dateService Service to work with date
   * @param {ChangeDetectorRef} cdRef Service to work with change detecto
   * @param {QuoteStateService} quoteStateService to work quote state
   * @param {QuoteRealTimeService} quoteRealTimeService to work quote state
   * @param {NgbModal} modalService to work quote state
   */
  constructor(
    private quoteServices: QuoteService,
    private dateService: DateService,
    private cdRef: ChangeDetectorRef,
    private quoteStateService: QuoteStateService,
    private quoteRealTimeService: QuoteRealTimeService,
    private modalService: NgbModal,
    private leftPanelStateService:LeftPanelStateService,
    private notificationStateService: NotificationStateService,
    config: NgbModalConfig,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  /**
   * Initializes quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    console.log("QuotesComponent");
    this.leftPanelStateService.setBillingpage('quotes-component');
 //   this.getQuotes();

    this.changeQuotesListItem();
    //this.onInitCheackQuoteSent();
  }

  ngOnDestroy(): void {
    this.quoteServices.setDefaultTypes();
    this.sub.unsubscribe();
  }

  /**
  * Subscribe to check quote has been sent
  */
  /*  public onInitCheackQuoteSent() {
      this.checkQuoteHasSent();
      let quoteStateService = this.quoteStateService.getHandleQuoteHasSent().subscribe(() => {
      //  this.quoteResultMessage = this.quoteStateService.getQuoteResult().getMessage();
        this.checkQuoteHasSent();
      });
      this.sub.add(quoteStateService);
    }*/

  /**
  * Check quote has been sent
  */
  /*private checkQuoteHasSent () {
    let result:QuoteResult =  this.quoteStateService.getQuoteResult();
    let successQuoteAdding = (result) ? result.getShow() : false;
    if (successQuoteAdding) {
    //  this.quoteResultMessage = this.quoteStateService.getQuoteResult().getMessage();
      this.alertState.oninitShowAlert(this.quoteStateService.getQuoteResult().getMessage());
     setTimeout(() => {
      result.setShow(false);
     }, 2000);
    }
  }*/

  /**
   * get quote list
   */
  public getQuotes() {
    this.quoteServices.getQuotes(this.dataToSend).subscribe((res: any) => {
      this.quotesList = [...this.quotesList, ...res];
      this.showPreloader = false;
      this.dataToSend.page += 1;
      this.infiniteScrollDisabled = false;
    })
  }

  /**
   * get formated date
   */
  public getDate(value) {
    return this.dateService.getFormatDate(new Date(value));
  }

  /**
   * Get quotes on scroll
   */
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getQuotes();
  }

  /**
   * sort by status
   */
  public sortBy(value) {
    this.refreshQuoteAndPage();
    this.quoteServices.getSortType(value);
    this.dataToSend.type = value;
    this.getQuotes()
  }

  /**
   * filter data by date
   */
  public filterByDate(value) {
    this.refreshQuoteAndPage();
    this.setDate(value);
    this.getQuotes()
  }

  /**
   * set data to send
   */
  private setDate(value) {
    this.dataToSend.startDate = value.start;
    this.dataToSend.endDate = value.end;
  }

  /**
   * refresh quote data and page
   */
  private refreshQuoteAndPage() {
    this.quotesList = [];
    this.showPreloader = true;
    this.dataToSend.page = 0;
  }

  /**
   * Select client
   */
  public selectClient(value) {
    this.refreshQuoteAndPage();
    this.dataToSend.company = (value && value.item) ? value.item.name : null;
    this.getQuotes();
  }

  /**
   * Set number on enter action
   */
  public setNumberEnter(event?) {
    if (event.key === "Enter") {
      this.dataToSend.number = this.searchNumber;
      this.refreshQuoteAndPage();
      this.getQuotes();
    }

  }

  /**
   * Set number on blur action
   */
  public setNumberOnBlur(event?) {
    this.dataToSend.number = this.searchNumber;
    this.refreshQuoteAndPage();
    this.getQuotes();
  }

  /**
   * Set input status
   */
  public setStatus(item) {
    this.selectedStatus = item.name;
    this.dataToSend.status = item.type;
    this.refreshQuoteAndPage();
    this.getQuotes();
  }

  /**
   * Clear input status
   */
  public clearStatus() {
    this.selectedStatus = null;
    this.dataToSend.status = null;
    this.refreshQuoteAndPage();
    this.getQuotes();
  }

  /**
   * add status class for quotes
   */
  public getClass(className) {
    return className === 'EXPIRED' || className === 'CANCELED' ? 'error-status' :
      className === 'READ' ? 'status-in-progress' :
        className === 'SAVED' ? 'changing-status' :
          className === 'UNREAD' ? 'status-warning' :
            'success-status'
  }

  /**
   * Go to create state
   */
  goToCreate() {
    this.quoteStateService.goToCreate();
  }

  /**
  * move to edit quote component
  * @param quote - quote
  */


  /**
   * Change state to preview
   */
  public goToPreview(quote) {
    this.quoteServices.getQuote(quote.id).subscribe((data) => {
      this.quoteStateService.goToPreview(data, false);
    })
    //   this.quoteStateService.goToPreview(quote, false);
  }

  /**
   * Check elem status
   */
  public checkStatus(quote, statusForShowingArray) {
    const elems = statusForShowingArray.filter((item) => item.toLowerCase() === quote.status.toLowerCase());
    return elems.length > 0;
  }

  /**
   * convert Quote to invoice
   */
 

  /**
   * convert Quote to ticket
   */
 

  /**
   * cancel quote
   */


  /**
   * archive quote
   */


 

  /**
   * archive quote
   */


  /**
   * Subscribe to real time quote
   */
  public changeQuotesListItem() {
    this.quoteRealTimeService.changeQuotesArray.subscribe((newChange) => {
      if (newChange.action === 'SALE_QUOTE_CREATED') {
        return this.quotesList.push(newChange.data);
      } else {
        const elemIndex = this.quotesList.findIndex((item) => item.id === newChange.data.id);
        if (newChange.data.status !== 'ARCHIVED') {
          return this.quotesList[elemIndex] = newChange.data;
        } else {
          this.quotesList.splice(elemIndex, 1);
        }

      }
    })
  }

  /**
   * open send modal for resend
   */
 

  public trackById(index, item) {
    return item.id;
  }

}
