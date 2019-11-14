import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeftPanelStateService {
  onFilter: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public onInitFilter(data) {
    this.onFilter.emit(data);
  }
  public getOnFilter() {
    return this.onFilter;
  }
}
