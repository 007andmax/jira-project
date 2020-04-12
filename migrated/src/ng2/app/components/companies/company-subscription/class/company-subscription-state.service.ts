import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompanySubscriptionStateService {
  editMode:EventEmitter<any> = new EventEmitter();
  clearState = new EventEmitter<any>();
  constructor() { }
 /**
  * Initializes to subscribe for clear data
  */
 public onInitClear() {
  this.clearState.emit(null);
}

/**
* Get subscribe for clear data
*/
public getClearState () {
  return this.clearState
}

  public getOnEditMode() {
    return this.editMode;
  }
  public onEditMode(data) {
    this.editMode.emit(data);
  }
}
