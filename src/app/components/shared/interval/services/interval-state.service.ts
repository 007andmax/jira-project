import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntervalStateService {
  clearState: EventEmitter<any> = new EventEmitter();
  onEditMode: EventEmitter<any> = new EventEmitter();
  constructor() { }

  /**
   * Initializes to subscribe for edit mode
   * @param data - data
   */
  public onInitEditMode(data) {
    this.onEditMode.emit(data);
  }

   /**
   * Get subscribe edit mode
   */
  public getEditMode() {
    return this.onEditMode;
  }

  /**
   * Initializes to subscribe for clear data
   */
  public onInitClearState() {
    this.clearState.emit(null);
  }

  /**
   * Get  subscribe for clear data
   */
  public getClearState() {
    return this.clearState;
  }

   /**
   * Get default date
   */
  public getDefaultDate() {
    return {year: 2019, month: 7,day: null};
  }
}
