import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsStateService {
  onShowNotifications: EventEmitter<any> = new EventEmitter();
  constructor() { }

  onInit() {

  }
  public showNotifications() {
    this.onShowNotifications.emit(null);
  }
}
