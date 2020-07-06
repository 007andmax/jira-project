import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BillableRealTimeService {
  public changeBillable: EventEmitter<any> = new EventEmitter();
  public changeBillableCount: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public handleRealTimeChangesBillable(newChange) {
    this.changeBillable.emit(newChange);
  }
  public handleRealTimeChangesBillableCount(newChange) {
    this.changeBillableCount.emit(newChange);
  }
}
