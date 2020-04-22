import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketsRealTimeService {

  public changeActualNumber: EventEmitter<any> = new EventEmitter();
  public changeTickets: EventEmitter<any> = new EventEmitter();

  /**
   * Quote real time service constructor
   */
  constructor() { }

  /**
   * Handle quote real time changes
   * @newChange - new quotes array changes
   */
  public handleRealTimeChangesActualNumber(newChange) {
    this.changeActualNumber.emit(newChange);
  }
  public handleRealTimeChangesTickets(newChange) {
    this.changeTickets.emit(newChange);
  }

   
}
