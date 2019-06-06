import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuoteRealTimeService {

  public changeQuotesArray: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public handleRealTimeChanges(newChange) {
    console.log(newChange, 'newChange');
    this.changeQuotesArray.emit(newChange);
  }

}
