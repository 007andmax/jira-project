import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketsStateService {
  filter: EventEmitter<any> = new EventEmitter();
  constructor() { }
  public onInitFilter(data) {
    this.filter.emit(data);
  }
  public getOnInitFilter() {
    return this.filter;
  }
}
