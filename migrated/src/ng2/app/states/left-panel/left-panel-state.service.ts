import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeftPanelStateService {
  activePage:string = "new-billable";
  onFilter: EventEmitter<any> = new EventEmitter();
  onBillingPage: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public setBillingpage(data) {
    this.activePage = data;
    this.onBillingPage.emit(data);
  }
  public getOnBillingPage() {
    return this.onBillingPage;
  }
  public onInitFilter(data) {
    this.onFilter.emit(data);
  }
  public getOnFilter() {
    return this.onFilter;
  }
}
