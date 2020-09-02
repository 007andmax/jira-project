import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContractsStateService {
  onFilter: EventEmitter<any> = new EventEmitter();
  onSort: EventEmitter<any> = new EventEmitter();
  onToggleCreate: EventEmitter<any> = new EventEmitter();
  onChangeType: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public setType(data) {
    this.onChangeType.emit(data);
  }
  public getOnChangeType () {
    return this.onChangeType;
  }
  public getOnToggleCreate() {
    return this.onToggleCreate;
  }
  public toggleCreate(data) {
    this.onToggleCreate.emit(data);
  }
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
