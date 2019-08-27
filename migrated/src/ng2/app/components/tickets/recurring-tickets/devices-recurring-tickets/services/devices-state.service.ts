import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DevicesStateService {

  clearState = new EventEmitter<any>();
  
  constructor() { }

   /**
   * Set clear state 
   */
  public onInitClear() {
    this.clearState.emit(null);
  }

   /**
   * Get for subscribe clear state 
   */
  public getClearState () {
    return this.clearState
  }
}
