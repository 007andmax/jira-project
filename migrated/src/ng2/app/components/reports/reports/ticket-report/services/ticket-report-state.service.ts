import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketReportStateService {
  onToggleDashboard: EventEmitter<any> = new EventEmitter();
  onToggleServices: EventEmitter<any> = new EventEmitter();
  onToggleProducts: EventEmitter<any> = new EventEmitter();
  onToggleResponseTime: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public toggleShowResponseTime (data) {
    this.onToggleResponseTime.emit(data);
  }

  public getOnShowResponseTime () {
    return this.onToggleResponseTime;
  }

  public toggleShowProducts (data) {
    this.onToggleProducts.emit(data);
  }

  public getOnShowProducts () {
    return this.onToggleProducts;
  }
  public toggleShowServices (data) {
    this.onToggleServices.emit(data);
  }

  public getOnShowServices () {
    return this.onToggleServices;
  }
  public toggleShowDashboard (data) {
    this.onToggleDashboard.emit(data);
  }

  public getOnShowDashboard () {
    return this.onToggleDashboard;
  }
}
