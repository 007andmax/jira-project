import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecurringTicketsRealTimeService {


  public changeQuotesArray: EventEmitter<any> = new EventEmitter();

  /**
   * Recurring Tickets time service constructor
   */
  constructor() { }

    /**
  * Handle ticket real time changes
  * @param newChange - new ticket array changes
  */
  public handleRealTimeChanges(newChange) {
    this.changeQuotesArray.emit(newChange);
  }
}
