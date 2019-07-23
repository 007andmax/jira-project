import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntervalStateService {
  clearState: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public onInitClearState() {
    console.log('onInitClearState');
    this.clearState.emit(null);
  }
  public getClearState() {
    return this.clearState;
  }
}
