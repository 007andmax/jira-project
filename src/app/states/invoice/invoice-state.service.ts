import { Injectable, EventEmitter } from '@angular/core';
import { Invoice } from '../../components/billing/invoices/class/invoice';
import { InvoicesFilter } from 'src/app/components/billing/invoices/class/invoices-filter';

@Injectable({
  providedIn: 'root'
})
export class InvoiceStateService {
  invoiceForRemove: Invoice;
  invoiceForRollback: Invoice;
  invoiceForRefund: Invoice;
  openAside: EventEmitter<any> = new EventEmitter();
  closedAside: EventEmitter<any> = new EventEmitter();
  filter: EventEmitter<any> = new EventEmitter();
  openPreviewAside: EventEmitter<any> = new EventEmitter();
  invoices: Array<Invoice> = [];

  constructor() { }

  public getInvoices() {
    return this.invoices;
  }
  public setInvoices(data) {
    this.invoices = data;
  }
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
  public onOpenAsige(data) {
    this.openAside.emit(data);
  }
  public getOpenAside() {
    return this.openAside;
  }
  public onClosedAsige() {
    this.closedAside.emit(null);
  }
  public getClosedAside() {
    return this.closedAside;
  }
}
