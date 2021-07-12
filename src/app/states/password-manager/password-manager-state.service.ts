import { EventEmitter, Injectable } from '@angular/core';
import { PasswordRecord } from '../../components/password-manager/class/password-record';
import { PasswordRecordCategories } from '../../components/password-manager/class/password-record-categories';
import { PASSWORD_RECORD_TYPES } from '../../const/password-record-types';
import { PasswordManagerService } from '../../services/password-manager/password-manager.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordManagerStateService {
  recordForRemove: PasswordRecord = null;
  onFilter: EventEmitter<any> = new EventEmitter();
  onGetCategories: EventEmitter<any> = new EventEmitter();
  categories: Array<PasswordRecordCategories> = [];
  public onChangeRealTime: EventEmitter<any> = new EventEmitter();

  constructor(private passwordManagerService: PasswordManagerService) { }

  public onInit() {
    this.passwordManagerService.getCategories().subscribe((data: any) => {
      this.categories = data.map(item => new PasswordRecordCategories(item))
      this.onGetCategories.emit(this.categories);
    })
    this.onChangeRealTime.subscribe(newChange => {
      if (newChange.action === 'PASSWORD_CATEGORY_DELETED') console.log("newChange", newChange);
      if (newChange.action === 'PASSWORD_CATEGORY_CREATED') newChange.data.forEach(element => this.categories.push(new PasswordRecordCategories(element)));
      if (newChange.action === 'PASSWORD_CATEGORY_UPDATED') console.log("newChange", newChange);
      this.onGetCategories.emit(this.categories);
    })
  }
  public handleRealTimeChanges(data) {
    this.onChangeRealTime.emit(data)
  }
  public getCategories() {
    return this.categories;
  }
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
