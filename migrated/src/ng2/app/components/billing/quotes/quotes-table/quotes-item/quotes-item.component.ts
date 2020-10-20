import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Quote } from '../../class/quote';
import * as moment from "moment";
import { QUOTE_STATUS } from 'src/ng2/app/const/quote-status';

@Component({
  selector: 'app-quotes-item',
  templateUrl: './quotes-item.component.html',
  styleUrls: ['./quotes-item.component.scss']
})
export class QuotesItemComponent implements OnInit {

  @Input() quote: Quote;
  @Output() onResend = new EventEmitter<any>();
  @Output() onConvertToInvoice = new EventEmitter<any>();
  @Output() onConvertToTicket = new EventEmitter<any>();
  @Output() onApproveQuote = new EventEmitter<any>();
  @Output() onMarkAsRead = new EventEmitter<any>();
  @Output() onCancelQuote = new EventEmitter<any>();
  @Output() onArchiveQuote = new EventEmitter<any>();
  @Output() onGoToQuoteEdit = new EventEmitter<any>();
  @Output() onDownloadPdf = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  getStatusClass(status) {
    return status.toLowerCase();
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
  downloadPdf() {
    this.onDownloadPdf.emit(this.quote);
  }
  goToQuoteEdit() {
    this.onGoToQuoteEdit.emit(this.quote);
  }
  archiveQuote() {
    this.onArchiveQuote.emit(this.quote);
  }
  cancelQuote() {
    this.onCancelQuote.emit(this.quote);
  }
  markAsRead() {
    this.onMarkAsRead.emit(this.quote);
  }
  approveQuote() {
    this.onApproveQuote.emit(this.quote);
  }
  convertToTicket() {
    this.onConvertToTicket.emit(this.quote);
  }
  convertToInvoice() {
    this.onConvertToInvoice.emit(this.quote);
  }
  resend() {
    this.onResend.emit(this.quote);
  }
  public checkStatus(quote, statusForShowingArray) {
    const elems = statusForShowingArray.filter((item) => item.toLowerCase() === quote.status.toLowerCase());
    return elems.length > 0;
  }
}
