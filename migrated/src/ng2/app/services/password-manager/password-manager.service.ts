import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordManagerService {

  public filteredType: EventEmitter<any> = new EventEmitter();
  public selectedDeviceOrUser: EventEmitter<any> = new EventEmitter();

  constructor() { }

  setFilteredType(type) {
    this.filteredType.emit({
      template: type.TITLE
    });
  }

  setSelectedDeviceOrUser(item) {
    console.log(item, 'item');
    this.selectedDeviceOrUser.emit(item)
  }

}
