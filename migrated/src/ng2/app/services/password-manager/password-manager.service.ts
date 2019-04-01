import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordManagerService {

  public filteredType: EventEmitter<any> = new EventEmitter();
  public selectedDeviceOrUser: EventEmitter<any> = new EventEmitter();
  public selectedDate: EventEmitter<any> = new EventEmitter();
  public emitSelectedCategory: EventEmitter<any> = new EventEmitter();
  public showAddForm: EventEmitter<any> = new EventEmitter();

  constructor() { }

  setFilteredType(type) {
    this.filteredType.emit({
      template: type.TITLE
    });
  }

  setSelectedDeviceOrUser(item) {
    this.selectedDeviceOrUser.emit(item)
  }

  setSelectedCategory(item) {
    this.getSelectedCategory(item)
  }

  getSelectedCategory(item) {
    console.log(item, '1111');
    this.emitSelectedCategory.emit(item)
  }

  setDate(item) {
    this.selectedDate.emit(item)
  }

  addRecord() {
    this.showAddForm.emit(true);

  }

}
