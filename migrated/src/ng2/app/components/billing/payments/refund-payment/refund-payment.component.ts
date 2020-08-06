import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Payment } from '../class/payment';

@Component({
  selector: 'app-refund-payment',
  templateUrl: './refund-payment.component.html',
  styleUrls: ['./refund-payment.component.scss']
})
export class RefundPaymentComponent implements OnInit {
  @Input() payment: Payment;
  @Output() onClose = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  close() {
    this.onClose.emit(null);
  }
}
