import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TehUsersSateService {

  clearState = new EventEmitter<any>();
  usersFromEdit: EventEmitter<any> = new EventEmitter();
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

  /**
  * Initializes to subscribe for edit mode
  */
  public setUsersFromtEdit(data) {
    this.usersFromEdit.emit(data);

  }

  /**
  * Get  subscribe for edit mode
  */
  public getUsersFromEdit () {
    return this.usersFromEdit;
  }
}
