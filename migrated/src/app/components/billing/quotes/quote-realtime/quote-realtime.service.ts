import { EventEmitter, Injectable } from '@angular/core';

/**
 * Quote real time service
 */
@Injectable({
  providedIn: 'root'
})
export class QuoteRealTimeService {

  public changeQuotesArray: EventEmitter<any> = new EventEmitter();

  /**
   * Quote real time service constructor
   */
  constructor() { }

  /**
   * Handle quote real time changes
   * @newChange - new quotes array changes
   */
  public handleRealTimeChanges(newChange) {
    this.changeQuotesArray.emit(newChange);
  }

}
