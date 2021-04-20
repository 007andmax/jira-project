import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsersRealTimeService {

  public changeUsersArray: EventEmitter<any> = new EventEmitter();
  public changeSubmittedTicket: EventEmitter<any> = new EventEmitter();

  /**
   * Quote real time service constructor
   */
  constructor() { }

  /**
   * Handle quote real time changes
   * @newChange - new quotes array changes
   */
  public handleRealTimeChanges(newChange) {
    this.changeUsersArray.emit(newChange);
  }


  public handleRealTimeSubmittedTicket(newChange) {
    this.changeSubmittedTicket.emit(newChange);
  }
}
