import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SupportStateService {
  public handleSendMode: EventEmitter<any> = new EventEmitter();
  public handFilter: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public getHandleSendMode() {
    return this.handleSendMode;
  }
  public onHandleSendMode(data) {
    this.handleSendMode.emit(data);
  }

  public getHandleFilter() {
    return this.handFilter;
  }
  public onHandleFilter(data) {
    this.handFilter.emit(data);
  }
}
