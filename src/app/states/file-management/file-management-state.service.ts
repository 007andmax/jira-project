import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileManagementStateService {
  onShowAsideForAdd: EventEmitter<any> = new EventEmitter();
  constructor() { }
  public showAsideForAdd() {
    this.onShowAsideForAdd.emit(null);
  }
}
