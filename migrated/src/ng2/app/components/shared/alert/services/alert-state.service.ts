import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertStateService {
  showAlert: EventEmitter<string> = new EventEmitter();
  constructor() { }

  /**
  * Initializes to subscribe for show alert
  * @param message message
  */
  public oninitShowAlert(message: string) {
    this.showAlert.emit(message);

  }

  /**
  * Get to subscribe for show alert
  */
  public getShowAlert() {
    return this.showAlert;
  }
}
