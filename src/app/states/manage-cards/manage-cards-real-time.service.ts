import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManageCardsRealTimeService {
  public changeCardsArray: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public handleRealTimeChanges(newChange) {
    this.changeCardsArray.emit(newChange);
  }
}
