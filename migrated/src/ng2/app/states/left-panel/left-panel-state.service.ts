import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeftPanelStateService {
  activePage: string = "new-billable";
  onFilter: EventEmitter<any> = new EventEmitter();
  onBillingPage: EventEmitter<any> = new EventEmitter();
  onCompanyPage: EventEmitter<any> = new EventEmitter();
  onToggleLeftPanel: EventEmitter<any> = new EventEmitter();

  constructor() { }


  public setBillingPage(data) {
    this.activePage = data;
    this.onBillingPage.emit(data);
  }
  public toggleLeftPanel(data) {
    this.onToggleLeftPanel.emit(data);
  }
  public setCompanyPage(data) {
    this.activePage = data;
    this.onCompanyPage.emit(data);
  }
  public getOnCompanyPage() {
    return this.onCompanyPage;
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
