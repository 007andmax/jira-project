import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InventoryRealTimeService {

  public changeCompaniesArray: EventEmitter<any> = new EventEmitter();
  public changeProductsArray: EventEmitter<any> = new EventEmitter();

  /**
   * Quote real time service constructor
   */
  constructor() { }

  /**
   * Handle quote real time changes
   * @newChange - new quotes array changes
   */
  public handleRealTimeChangesCategories(newChange) {
    this.changeCompaniesArray.emit(newChange);
  }

   /**
   * Handle quote real time changes
   * @newChange - new quotes array changes
   */
  public handleRealTimeChangesProducts(newChange) {
    this.changeProductsArray.emit(newChange);
  }
}
