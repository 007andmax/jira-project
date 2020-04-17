import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketsStateService {
  filter: EventEmitter<any> = new EventEmitter();
  colorStatus: EventEmitter<any> = new EventEmitter();
  status: EventEmitter<any> = new EventEmitter();
  count: EventEmitter<number> = new EventEmitter();
  toggleAddTicket: EventEmitter<any> = new EventEmitter();
  constructor() { }
  public onInitFilter(data) {
    this.filter.emit(data);
  }
  public onColorStatus(data) {
    this.colorStatus.emit(data);
  }
  public onInitStatus(data) {
    this.status.emit(data);
  }
  public onToggleAddTicket() {
this.toggleAddTicket.emit(null);
  }
  public onInitCount(data) {
    this.count.emit(data);
  }
  public getOnInitFilter() {
    return this.filter;
  }
  public getOnInitColor() {
    return this.colorStatus;
  }
  public getOnInitStatus() {
    return this.status;
  }
  public getOnInitCount() {
    return this.count;
  }
  public getToggleAddTicket() {
    return this.toggleAddTicket;
  }
}
