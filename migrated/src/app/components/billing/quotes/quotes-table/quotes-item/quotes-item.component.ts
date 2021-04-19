import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Quote } from '../../class/quote';
import * as moment from "moment";
import { User } from 'src/app/components/users/class/user';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';

@Component({
  selector: 'app-quotes-item',
  templateUrl: './quotes-item.component.html',
  styleUrls: ['./quotes-item.component.scss'],
  providers: [TicketsListService]
})
export class QuotesItemComponent implements OnInit {
  createdUser: User;
  @Input() quote: Quote;
  @Output() onResend = new EventEmitter<any>();
  @Output() onConvertToBillable = new EventEmitter<any>();
  @Output() onConvertToInvoice = new EventEmitter<any>();
  @Output() onConvertToTicket = new EventEmitter<any>();
  @Output() onApproveQuote = new EventEmitter<any>();
  @Output() onMarkAsRead = new EventEmitter<any>();
  @Output() onCancelQuote = new EventEmitter<any>();
  @Output() onArchiveQuote = new EventEmitter<any>();
  @Output() onGoToQuoteEdit = new EventEmitter<any>();
  @Output() onDownloadPdf = new EventEmitter<any>();
  @Output() onPreview = new EventEmitter<any>();
  @Output() onCopy = new EventEmitter<any>();
  @Output() onTicket = new EventEmitter<any>();
  @Output() onInvoice = new EventEmitter<any>();
  constructor(private usersStateService: UsersStateService,
    public ticketsListService: TicketsListService,) { }

  ngOnInit() {
    this.createdUser = this.usersStateService.getAllUsers().find(item => item.id === this.quote.createdBy);
  }
  openInvoiceTikcet() {
    if (this.quote.status === "TICKETED") this.onTicket.emit(this.quote.ticketId);
    if (this.quote.status === "INVOICED") this.onInvoice.emit(this.quote.invoiceId);
  }
  getNameForAvatar() {
    if (!this.createdUser) return '';
    if (!this.createdUser.avatar) return `${(this.createdUser.firstName) ? this.createdUser.firstName[0].toUpperCase() : ''}${(this.createdUser.lastName) ? this.createdUser.lastName[0].toUpperCase() : ''}`;
    return '';
  }
  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  preview() {
    this.onPreview.emit(this.quote);
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
  convertToBillable() {
    this.onConvertToBillable.emit(this.quote);
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
  copy() {
    this.onCopy.emit(this.quote);
  }
  resend() {
    this.onResend.emit(this.quote);
  }
  public checkStatus(quote, statusForShowingArray) {
    const elems = statusForShowingArray.filter((item) => item.toLowerCase() === quote.status.toLowerCase());
    return elems.length > 0;
  }
  public getStatusText(status) {
    return status.toLowerCase()
  }
}
