import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Quote } from '../../class/quote';
import * as moment from "moment";
import { QUOTE_STATUS } from 'src/ng2/app/const/quote-status';
import { User } from 'src/ng2/app/components/users/class/user';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { TicketsListService } from 'src/ng2/app/components/tickets/tickets/services/tickets-list.service';

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
  @Output() onConvertToInvoice = new EventEmitter<any>();
  @Output() onConvertToTicket = new EventEmitter<any>();
  @Output() onApproveQuote = new EventEmitter<any>();
  @Output() onMarkAsRead = new EventEmitter<any>();
  @Output() onCancelQuote = new EventEmitter<any>();
  @Output() onArchiveQuote = new EventEmitter<any>();
  @Output() onGoToQuoteEdit = new EventEmitter<any>();
  @Output() onDownloadPdf = new EventEmitter<any>();
  @Output() onPreview = new EventEmitter<any>();
  constructor(private usersStateService: UsersStateService,
    public ticketsListService: TicketsListService,) { }

  ngOnInit() {
    this.createdUser = this.usersStateService.getAllUsers().find(item => item.id === this.quote.createdBy);
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
  public getStatusText(status) {
    return status.toLowerCase()
  }
}
