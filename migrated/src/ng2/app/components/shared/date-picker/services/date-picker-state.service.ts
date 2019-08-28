import { Injectable, EventEmitter } from '@angular/core';
import { ChangeDatePicker } from '../class/change-date-picker';

@Injectable({
  providedIn: 'root'
})
export class DatePickerStateService {

  onReset: EventEmitter<any> = new EventEmitter();
  onEditMode: EventEmitter<any> = new EventEmitter();
  onClear: EventEmitter<any> = new EventEmitter();
  constructor() { }

  /**
  * Initializes to subscribe for reset data
  */
  public onInitReset() {
    this.onReset.emit(null);
  }

  /**
 * Get  subscribe for reset data
 */
  public getOnReset() {
    return this.onReset;
  }

  /**
 * Initializes to subscribe for edit mode
 * @param data val date picker
 */
  public onInitEditMode(data) {
    this.onEditMode.emit(data);
  }

  /**
 * Get subscribe for edit mode
 */
  public getOnEditMode() {
    return this.onEditMode;
  }

  /**
 * Initializes subscribe for clear data
 */
  public onInitClear() {
    this.onClear.emit(null);
  }

  /**
  * Get subscribe for clear data
  */
  public getOnClear() {
    return this.onClear;
  }
}
