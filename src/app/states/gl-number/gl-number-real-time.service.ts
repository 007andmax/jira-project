import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlNumberRealTimeService {

  public changeGlNumberArray: EventEmitter<any> = new EventEmitter();

  /**
   * Quote real time service constructor
   */
  constructor() { }

  /**
   * Handle quote real time changes
   * @newChange - new quotes array changes
   */
  public handleRealTimeChanges(newChange) {
    this.changeGlNumberArray.emit(newChange);
  }
}
