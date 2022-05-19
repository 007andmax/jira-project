import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SupportPageCategoriesRealTimeService {

  public changeCategoryArray: EventEmitter<any> = new EventEmitter();



  /**
   * Quote real time service constructor
   */
  constructor() { }

  /**
   * Handle quote real time changes
   * @newChange - new quotes array changes
   */
  public handleRealTimeChanges(newChange) {
    this.changeCategoryArray.emit(newChange);
  }



}
