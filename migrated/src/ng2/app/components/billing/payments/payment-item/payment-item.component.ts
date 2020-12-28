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
    private confirmStateService: ConfirmStateService,) { }

  ngOnInit() {

  }
  public getDate() {
    return moment(this.payment.createdAt).format('YYYY/MM/DD');
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
  public trackById(index, item) {
    return item.id;
  }
}
