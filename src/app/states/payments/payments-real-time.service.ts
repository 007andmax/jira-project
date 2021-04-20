import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentsRealTimeService {
  public changePaymentsArray: EventEmitter<any> = new EventEmitter();
  constructor() { }

  /**
   * Handle quote real time changes
   * @newChange - new quotes array changes
   */
  public handleRealTimeChanges(newChange) {
    this.changePaymentsArray.emit(newChange);
  }
}
