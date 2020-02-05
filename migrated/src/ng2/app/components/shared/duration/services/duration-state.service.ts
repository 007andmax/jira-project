import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DurationStateService {
  clearState = new EventEmitter<any>();
  
  constructor() { }

   /**
  * Initializes to subscribe for clear data
  */
  public onInitClear() {
    this.clearState.emit(null);
  }

   /**
  * Get to subscribe for clear data
  */
  public getClearState () {
    return this.clearState
  }

  
}
