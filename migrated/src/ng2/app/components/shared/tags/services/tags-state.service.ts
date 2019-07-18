import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TagsStateService {

  clearState = new EventEmitter<any>();
  constructor() { }
  public onInitClear() {
    this.clearState.emit(null);
  }
  public getClearState () {
    return this.clearState
  }
}
