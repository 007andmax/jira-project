import { Injectable, EventEmitter } from '@angular/core';
import { Payment } from '../../components/billing/payments/class/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsStateService {

  paymentForRemove: Payment;
  paymentForRollback: Payment;
  paymentForRefund: Payment;
  filter: EventEmitter<any> = new EventEmitter();
  payments: Array<Payment> = [];

  constructor() { }
  public setPayments(data) {
    this.payments = data;
  }
  public getPayments() {
    return this.payments;
  }
  public setPaymentForRefund(data) {
    this.paymentForRefund = data;
  }
  public getPaymentForRefund() {
    return this.paymentForRefund;
  }


  public setPaymentForRollback(data) {
    this.paymentForRollback = data;
  }
  public getPaymentForRollback() {
    return this.paymentForRollback;
  }
  public setPaymentForemove(data) {
    this.paymentForRemove = data;
  }
  public getPaymentForRemove() {
    return this.paymentForRemove;
  }
  public onInitFilter(data) {
    this.filter.emit(data);
  }
  public getOnInitFilter() {
    return this.filter;
  }
}
