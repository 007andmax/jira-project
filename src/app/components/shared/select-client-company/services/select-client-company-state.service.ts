import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectClientCompanyStateService {
  clearState = new EventEmitter<any>();
  companyFromEdit: EventEmitter<any> = new EventEmitter();
  constructor() { }

  /**
  * Initializes to subscribe for clear data
  */
  public onInitClear() {
    this.clearState.emit(null);
  }

  /**
  * Get subscribe for clear data
  */
  public getClearState () {
    return this.clearState
  }

   /**
  * Initializes to subscribe for edit mode
  *  @param data company
  */
  public setCompanyFromtEdit(data) {
    this.companyFromEdit.emit(data);
  }

   /**
  * Get subscribe for edit mode
  */
  public getCompanyFromEdit () {
    return this.companyFromEdit;
  }
}
