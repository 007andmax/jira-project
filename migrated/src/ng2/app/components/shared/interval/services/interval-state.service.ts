import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntervalStateService {
  clearState: EventEmitter<any> = new EventEmitter();
  onEditMode: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public onInitEditMode(data) {
   
    this.onEditMode.emit(data);
  }
  public getEditMode() {
    return this.onEditMode;
  }
  public onInitClearState() {
  
    this.clearState.emit(null);
  }
  public getClearState() {
    return this.clearState;
  }
}
