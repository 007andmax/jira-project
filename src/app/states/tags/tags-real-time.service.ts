import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TagsRealTimeService {
  public changeTagsArray: EventEmitter<any> = new EventEmitter();


  /**
  * Quote real time service constructor
  */
  constructor() { }

  /**
   * Handle quote real time changes
   * @newChange - new quotes array changes
   */
  public handleRealTimeChanges(newChange) {
    this.changeTagsArray.emit(newChange);
  }



}
