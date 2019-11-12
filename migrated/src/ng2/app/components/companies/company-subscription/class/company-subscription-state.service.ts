import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompanySubscriptionStateService {
  editMode:EventEmitter<any> = new EventEmitter();
  constructor() { }

  public getOnEditMode() {
    return this.editMode;
  }
  public onEditMode(data) {
    this.editMode.emit(data);
  }
}
