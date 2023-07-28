import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomerRoleRealTimeService {
  public changeRoleArray: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public handleRealTimeChanges(newChange) {
    this.changeRoleArray.emit(newChange);
  }
}
