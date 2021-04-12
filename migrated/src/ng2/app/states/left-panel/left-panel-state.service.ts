import { Injectable, EventEmitter } from '@angular/core';
import { LeftPanelCompaniesFilter } from '../../components/left-panel/left-panel-companies/class/left-panel-companies-filter';

@Injectable({
  providedIn: 'root'
})
export class LeftPanelStateService {
  activePage: string = "";
  filter: LeftPanelCompaniesFilter = new LeftPanelCompaniesFilter();
  onFilter: EventEmitter<any> = new EventEmitter();
  onBillingPage: EventEmitter<any> = new EventEmitter();
  onCompanyPage: EventEmitter<any> = new EventEmitter();
  onOpenCompanyPage: EventEmitter<any> = new EventEmitter();
  onToggleLeftPanel: EventEmitter<any> = new EventEmitter();
  onGoToState: EventEmitter<any> = new EventEmitter();
  onChangeState: EventEmitter<any> = new EventEmitter();
  onFirstOpen: EventEmitter<any> = new EventEmitter();

  constructor() { }

  public getFilter() {
    return this.filter;
  }
  public firstOpen(data) {
    this.activePage = data;
    this.onFirstOpen.emit(data);
  }
  public openCompanPage() {
    this.onOpenCompanyPage.emit(null);
  }
  public changeState(data) {
    this.onChangeState.emit(data);
  }
  public goToState(data) {
    this.onGoToState.emit(data);
  }
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
    this.filter = data;
    this.onFilter.emit(data);
  }
  public getOnFilter() {
    return this.onFilter;
  }
}
