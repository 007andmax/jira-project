import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvoiceRealTimeService {
  public changeInvoice: EventEmitter<any> = new EventEmitter();
  public changeNumber: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public handleRealTimeChangesNumber(newChange) {
    this.changeNumber.emit(newChange);
  }
  public handleRealTimeChangesInvoice(newChange) {
    this.changeInvoice.emit(newChange);
  }
}
