import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompaniesStateService {
   showAsideForAdd: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public toggleAsideForAdd() {
    this.showAsideForAdd.emit();
  } 
  public getShowAsideForAdd () {
    return this.showAsideForAdd;
  }
}
