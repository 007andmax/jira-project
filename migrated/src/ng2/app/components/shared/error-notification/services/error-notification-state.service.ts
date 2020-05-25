import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorNotificationStateService {

  showAlert: EventEmitter<string> = new EventEmitter();
  constructor() { }

  /**
  * Initializes to subscribe for show alert
  * @param message message
  */
  public oninitShowNotification(message: string) {
    this.showAlert.emit(message);

  }

  /**
  * Get to subscribe for show alert
  */
  public getShowNotification() {
    return this.showAlert;
  }
}
