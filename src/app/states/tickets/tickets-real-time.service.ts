import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketsRealTimeService {

  public changeActualNumber: EventEmitter<any> = new EventEmitter();
  public changeTickets: EventEmitter<any> = new EventEmitter();
  public changeTicket: EventEmitter<any> = new EventEmitter();
  public changeTicketTasks: EventEmitter<any> = new EventEmitter();
  public changeTicketFilters: EventEmitter<any> = new EventEmitter();
  public ticketSubscription;
  public ticketTaskSubscription;
  public subsribeToTicketsCustomerUser;

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
  public handleRealTimeChangesTicket(newChange) {
    this.changeTicket.emit(newChange);
  }
  public handleRealTimeChangesTicketTasks(newChange) {
    this.changeTicketTasks.emit(newChange);
  }
  public handleRealTimeChangesTicketFilters(newChange) {
    this.changeTicketFilters.emit(newChange);
  }
  public unsubscribeTicket() {
    if (this.ticketSubscription) this.ticketSubscription.unsubscribe();
    if (this.ticketTaskSubscription) this.ticketTaskSubscription.unsubscribe();
  }

}
