import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectClientCompanyStateService {
  clearState = new EventEmitter<any>();
  constructor() { }
  public onInitClear() {
    this.clearState.emit(null);
  }
  public getClearState () {
    return this.clearState
  }
}
