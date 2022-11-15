import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { Payment } from '../class/payment';
import { RefundPayment } from '../class/refund-payment';
import { PaymentsService } from 'src/app/services/payments/payments.service';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';

@Component({
  selector: 'app-refund-payment',
  templateUrl: './refund-payment.component.html',
  styleUrls: ['./refund-payment.component.scss']
})
export class RefundPaymentComponent implements OnInit {
  @Input() payment: Payment;
  @Output() onClose = new EventEmitter<any>();
  refundPayment: RefundPayment;
  @ViewChild('refundPaymentBtn') refundPaymentBtn: DisabledBtnDirective;
  constructor(private paymentsService: PaymentsService,) { }

  ngOnInit() {
    this.refundPayment = new RefundPayment(this.payment.id, this.payment.note);
  }
  close() {
    this.onClose.emit(null);
  }
  parsePaymentMethod(method) {
    return method.split('_').map((el) => el[0].toUpperCase() + el.slice(1).toLowerCase()).join(' ');
  };
  create() {
    this.refundPaymentBtn.setDisabled(true);
    this.paymentsService.refundPayments(this.refundPayment).subscribe(data => {
      this.refundPaymentBtn.setDisabled(false);
      this.onClose.emit(null);
    }, err => {
      this.refundPaymentBtn.setDisabled(false);
    })
  }
}
