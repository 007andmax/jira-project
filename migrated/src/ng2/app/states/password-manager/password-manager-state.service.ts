import { EventEmitter, Injectable } from '@angular/core';
import { PasswordRecord } from '../../components/password-manager/class/password-record';

@Injectable({
  providedIn: 'root'
})
export class PasswordManagerStateService {
  recordForRemove: PasswordRecord = null;
  onFilter: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public setRecordForRemove(data) {
    this.recordForRemove = data;
  }
  public getRecordForRemove() {
    return this.recordForRemove;
  }
  public onInitFilter(data) {
    this.onFilter.emit(data);
  }
  public getOnFilter() {
    return this.onFilter;
  }
}
