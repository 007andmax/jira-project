import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuoteRealTimeService {

  public changeQuotesArray: EventEmitter<any> = new EventEmitter();
  constructor() { }

  /**
   * set handle for change in real time
   * @param newChange - item
   */
  public handleRealTimeChanges(newChange) {
    this.changeQuotesArray.emit(newChange);
  }

}
