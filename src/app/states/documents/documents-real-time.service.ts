import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DocumentsRealTimeService {

  public changeDocumentsArray: EventEmitter<any> = new EventEmitter();
  public changeCategoriesArray: EventEmitter<any> = new EventEmitter();


  /**
  * Quote real time service constructor
  */
  constructor() { }

  /**
   * Handle quote real time changes
   * @newChange - new quotes array changes
   */
  public handleRealTimeDocumentsChanges(newChange) {
    this.changeDocumentsArray.emit(newChange);
  }
  public handleRealTimeCategoriesChanges(newChange) {
    this.changeCategoriesArray.emit(newChange);
  }

}
