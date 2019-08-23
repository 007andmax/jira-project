import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertStateService {
   showAlert: EventEmitter<string> = new EventEmitter();
  constructor() { }
  public oninitShowAlert( message:string) {
    this.showAlert.emit(message);

  }
  public getShowAlert() {
    return this.showAlert;
  }
}
