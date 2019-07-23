import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TehUsersSateService {

  clearState = new EventEmitter<any>();
  usersFromEdit: EventEmitter<any> = new EventEmitter();
  constructor() { }
  public onInitClear() {
    this.clearState.emit(null);
  }
  public getClearState () {
    return this.clearState
  }
  public setUsersFromtEdit(data) {
    this.usersFromEdit.emit(data);

  }
  public getUsersFromEdit () {
    return this.usersFromEdit;
  }
}
