import { Injectable, EventEmitter } from '@angular/core';
import { Invoice } from '../../components/billing/invoices/class/invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceStateService {
  invoiceForRemove: Invoice;
  filter: EventEmitter<any> = new EventEmitter();
  constructor() { }
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
