import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContractsStateService {
  defaultServices: any = [];
  onFilter: EventEmitter<any> = new EventEmitter();
  onSort: EventEmitter<any> = new EventEmitter();
  onPreview: EventEmitter<any> = new EventEmitter();
  onEdit: EventEmitter<any> = new EventEmitter();
  onToggleCreate: EventEmitter<any> = new EventEmitter();
  onTogglePreview: EventEmitter<any> = new EventEmitter();
  onToggleEdit: EventEmitter<any> = new EventEmitter();
  onChangeType: EventEmitter<any> = new EventEmitter();
  onDefaultServices: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public setEdit(data) {
    this.onEdit.emit(data);
  }
  public getOnEdit() {
    return this.onEdit;
  }
  public getOnToggleEdit() {
    return this.onToggleEdit;
  }
  public toggleEdit(data) {
    this.onToggleEdit.emit(data);
  }
  public getOnTogglePreview() {
    return this.onTogglePreview;
  }
  public togglePreview(data) {
    this.onTogglePreview.emit(data);
  }
  public getOnPreview() {
    return this.onPreview;
  }
  public setPreview(data) {
    this.onPreview.emit(data);
  }
  public getDefaultService() {
    return this.defaultServices;
  }
  public setDefaultService(data) {
    this.defaultServices = data;
    this.onDefaultServices.emit(data);
  }
  public getOnDefaultServices() {
    return this.onDefaultServices;
  }
  public setType(data) {
    this.onChangeType.emit(data);
  }
  public getOnChangeType() {
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
