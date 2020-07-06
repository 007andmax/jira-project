import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvoiceRealTimeService {
  public changeNumber: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public handleRealTimeChangesNumber(newChange) {
    this.changeNumber.emit(newChange);
  }
   
}
