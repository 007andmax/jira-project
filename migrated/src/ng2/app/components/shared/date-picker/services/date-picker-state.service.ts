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
 /* public onInitChange(data:ChangeDatePicker) {
    this.onChange.emit(data);
  }
  public getOnChange() {
    return this.onChange;
  }*/
  public onInitReset() {
    this.onReset.emit(null);
  }
  public getOnReset () {
    return this.onReset;
  }
  public onInitEditMode(data) {
    this.onEditMode.emit(data);
  }
  public getOnEditMode() {
    return this.onEditMode;
  }
  public onInitClear() {
    this.onClear.emit(null);
  }
  public getOnClear() {
    return this.onClear;
  }
}
