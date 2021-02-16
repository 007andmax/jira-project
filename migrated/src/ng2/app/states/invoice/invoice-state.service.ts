import { Injectable, EventEmitter } from '@angular/core';
import { Invoice } from '../../components/billing/invoices/class/invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceStateService {
  invoiceForRemove: Invoice;
  invoiceForRollback: Invoice;
  invoiceForRefund: Invoice;
  filter: EventEmitter<any> = new EventEmitter();
  openPreviewAside: EventEmitter<any> = new EventEmitter();
  constructor() { }
  public setInvoiceForRefund(data) {
    this.invoiceForRefund = data;
  }
  public getInvoiceForRefund() {
    return this.invoiceForRefund;
  }

  public togglePreview(data) {
    this.openPreviewAside.emit(data);
  }
  public setInvoiceForRollback(data) {
    this.invoiceForRollback = data;
  }
  public getInvoiceForRollback() {
    return this.invoiceForRollback;
  }
  public setInvoiceForemove(data) {
    this.invoiceForRemove = data;
  }
  public getInvoiceForRemove() {
    return this.invoiceForRemove;
  }
  public onInitFilter(data) {
    this.filter.emit(data);
  }
  public getOnInitFilter() {
    return this.filter;
  }
}
