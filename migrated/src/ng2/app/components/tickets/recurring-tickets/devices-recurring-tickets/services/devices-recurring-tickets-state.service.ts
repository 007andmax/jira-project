import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevicesRecurringTicketsStateService {

  clearState = new EventEmitter<any>();
  public devicesCompany = new Subject<any>();
  constructor() { }

   /**
   * Set clear state 
   */
  public onInitClear() {
    this.clearState.emit(null);
  }
  public onInitHangle(companyId){
    // this.getCompanyDevices(companyId).subscribe((response)=> {
     //  let devices = response[companyId];
         this.devicesCompany.next(companyId);
    //   })
   }
   /**
   * Get for subscribe clear state 
   */
  public getClearState () {
    return this.clearState
  }
}
