import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Payment } from '../class/payment';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { PaymentsStateService } from 'src/ng2/app/states/payments/payments-state.service';
import { AppService } from 'src/ng2/app/states/app/app.service';
import { PaymentsService } from 'src/ng2/app/services/payments/payments.service';
import * as moment from "moment";
import { DELETE_PAYMENT } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';

@Component({
  selector: 'app-payment-item',
  templateUrl: './payment-item.component.html',
  styleUrls: ['./payment-item.component.scss']
})
export class PaymentItemComponent implements OnInit {
  @Input() payment: Payment;
  company: any;
  @Output() onDetailsPayment = new EventEmitter<any>();
  @Output() onRefundPayment = new EventEmitter<any>();
  @Output() onPreviewInvoice = new EventEmitter<any>();
  @Output() onEditPayment = new EventEmitter<any>();
  allPayments = [];
  paymentSum: number;
  allPaymentsSum: number = 0;
  constructor(private companiesStateService: CompaniesStateService,
    private modalService: NgbModal,
    private paymentsStateService: PaymentsStateService,
    private confirmStateService: ConfirmStateService,
    private appService: AppService,
    private paymentsService: PaymentsService,) { }

  ngOnInit() {

  }
  showEditPayment() {
    this.onEditPayment.emit(this.payment);
  }
  showDetailsPayment() {
    this.onDetailsPayment.emit(this.payment);
  }
  showRefundPayment() {
    this.onRefundPayment.emit(this.payment);
  }
  onShowPreviewInvoice(index) {
    this.onPreviewInvoice.emit(this.payment.paymentData[index].invoiceId);
  }
  getInvoices() {
    let invoices = [];
    invoices = this.payment.paymentData.map(item => {
      return item.invoiceNumber;
    })
    return (invoices) ? invoices.join("<br/>") : '';
  }
  parsePaymentMethod(method) {
    return method.split('_').map((el) => el[0].toUpperCase() + el.slice(1).toLowerCase()).join(' ');
  };

  deletePayment() {
    this.confirmStateService.setConfirmAction(DELETE_PAYMENT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to remove the payment?`;
    this.paymentsStateService.setPaymentForemove(this.payment);
  }
  /*
 deleteInvoice() {
   this.confirmStateService.setConfirmAction(DELETE_INVOICE);
   const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal'});
   modalRef.componentInstance.message = `Do you want to delete invoice #${this.invoice.number} ?`;
   this.invoiceStateService.setInvoiceForemove(this.invoice);
 }
 resendInvoices() {
   this.invoicesService.resendArchiveInvoices([this.invoice.id]).subscribe(data => {

   })
 }
 markAsRead() {
   this.invoicesService.markAsRead(this.invoice.id).subscribe(data => {

   })
 }
 onShowPreviewInvoice() {
   this.onPreviewInvoice.emit(this.invoice);
 }
 rollbackInvoice() {
   this.confirmStateService.setConfirmAction(ROLLBACK_INVOICE);
   const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
   modalRef.componentInstance.message = `Do you want to rollback invoice #${this.invoice.number}? 
   ${(this.invoice.ticketNumbers && this.invoice.ticketNumbers.length ? (this.invoice.ticketNumbers.length > 1 ? 'Tickets #' : 'Ticket #') +
       this.invoice.ticketNumbers.join(', #') + ' will be restored.' : '')}`;
   this.invoiceStateService.setInvoiceForRollback(this.invoice);
 }
 refundPayments() {
   this.confirmStateService.setConfirmAction(REFUND_PAYMENTS);
   const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
   modalRef.componentInstance.message = `Invoice will be marked as not paid.`;
   this.invoiceStateService.setInvoiceForRefund(this.invoice);
 }
 exportAsPDF() {
   let company = this.companiesStateService.getCompanies().find(item => item.id === this.invoice.companyId);
   this.appService.download(`/invoice/show/${this.invoice.id}/pdf`, `${company.name}-${this.invoice.number}.pdf`);
 }*/
}
