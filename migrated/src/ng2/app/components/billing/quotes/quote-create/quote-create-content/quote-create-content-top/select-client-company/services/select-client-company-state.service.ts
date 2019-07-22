import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectClientCompanyStateService {
  clearState = new EventEmitter<any>();
  companyFromEdit: EventEmitter<any> = new EventEmitter();
  constructor() { }
  public onInitClear() {
    this.clearState.emit(null);
  }
  public getClearState () {
    return this.clearState
  }
  public setCompanyFromtEdit(data) {
    this.companyFromEdit.emit(data);

  }
  public getCompanyFromEdit () {
    return this.companyFromEdit;
  }
}
