import { EventEmitter, Injectable } from '@angular/core';
import { PasswordRecord } from '../../components/password-manager/class/password-record';
import { PasswordRecordCategories } from '../../components/password-manager/class/password-record-categories';
import { ApiPasswordManagerService } from '../../services/password-manager/api-password-manager.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordManagerStateService {
  recordForRemove: PasswordRecord = null;
  onFilter: EventEmitter<any> = new EventEmitter();
  onGetCategories: EventEmitter<any> = new EventEmitter();
  categories: Array<PasswordRecordCategories> = [];
  constructor(private apiPasswordManagerService: ApiPasswordManagerService) { }

  public onInit() {
    this.apiPasswordManagerService.getCategories().subscribe((data: any) => {
      this.categories = data.map(item => new PasswordRecordCategories(item))
      this.onGetCategories.emit(this.categories);
    })
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
