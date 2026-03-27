import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Quote } from '../../class/quote';
import * as moment from "moment";
import { User } from 'src/app/components/users/class/user';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { ToastrProgressStateService } from 'src/app/states/toastr-progress/toastr-progress-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';

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
  @Output() onSelected = new EventEmitter<any>();
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
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  constructor(public usersStateService: UsersStateService,
    private permissionsService: PermissionsService,
    public ticketsListService: TicketsListService,
    public customerPortalStateService: CustomerPortalStateService,
    private toastrProgressStateService: ToastrProgressStateService) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
    this.createdUser = this.usersStateService.getAllUsers().find(item => item.id === this.quote.createdBy);
  }
  openInvoiceTikcet() {
    if (this.quote.status === "TICKETED" && !this.customerPortalStateService.isCustomerPortal) this.onTicket.emit(this.quote.ticketId);
    if (this.quote.status === "INVOICED") this.onInvoice.emit(this.quote.invoiceId);
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
    if (this.toastrProgressStateService.check(this.quote.id)) return;
    this.onDownloadPdf.emit(this.quote);
  }
  goToQuoteEdit() {
    if (this.toastrProgressStateService.check(this.quote.id)) return;
    this.onGoToQuoteEdit.emit(this.quote);
  }
  archiveQuote() {
    if (this.toastrProgressStateService.check(this.quote.id)) return;
    this.onArchiveQuote.emit(this.quote);
  }
  cancelQuote() {
    if (this.toastrProgressStateService.check(this.quote.id)) return;
    this.onCancelQuote.emit(this.quote);
  }
  markAsRead() {
    if (this.toastrProgressStateService.check(this.quote.id)) return;
    this.onMarkAsRead.emit(this.quote);
  }
  convertToBillable() {
    if (this.toastrProgressStateService.check(this.quote.id)) return;
    this.toastrProgressStateService.onInit(this.quote.id);
    this.onConvertToBillable.emit(this.quote);
  }
  approveQuote() {
    if (this.toastrProgressStateService.check(this.quote.id)) return;
    this.onApproveQuote.emit(this.quote);
  }
  convertToTicket() {
    if (this.toastrProgressStateService.check(this.quote.id)) return;
    this.toastrProgressStateService.onInit(this.quote.id);
    this.onConvertToTicket.emit(this.quote);
  }
  convertToInvoice() {
    if (this.toastrProgressStateService.check(this.quote.id)) return;
    this.toastrProgressStateService.onInit(this.quote.id);
    this.onConvertToInvoice.emit(this.quote);
  }
  copy() {
    if (this.toastrProgressStateService.check(this.quote.id)) return;
    this.onCopy.emit(this.quote);
  }
  resend() {
    if (this.toastrProgressStateService.check(this.quote.id)) return;
    this.onResend.emit(this.quote);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  selectQuote(event) {
    this.onSelected.emit(this.quote);
  }
  public getStatusText(status) {
    return status.toLowerCase()
  }
}
