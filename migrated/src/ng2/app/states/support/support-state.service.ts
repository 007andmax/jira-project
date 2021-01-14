import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SupportStateService {
  public handleSendMode: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public getHandleSendMode() {
    return this.handleSendMode;
  }
  public onHandleSendMode(data) {
    this.handleSendMode.emit(data);
  }
}
