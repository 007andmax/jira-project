import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContractsStateService {
  onFilter: EventEmitter<any> = new EventEmitter();
  onSort: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public setFilter(name) {
    this.onFilter.emit(name);
  }
  public getFilter() {
    return this.onFilter;
  }
  public setSort(name) {
    this.onSort.emit(name);
  }
  public getSort() {
    return this.onSort;
  }
}
