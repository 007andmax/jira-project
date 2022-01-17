import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddUsersNotifyStateService {
  action: string;
  onChangeAssignedUser: EventEmitter<any> = new EventEmitter();
  constructor() { }
  public setAssignUser(data) {
    this.onChangeAssignedUser.emit(data);
  }
  public setAction(data) {
    this.action = data;
  }
  public getAction() {
    return this.action;
  }
}
