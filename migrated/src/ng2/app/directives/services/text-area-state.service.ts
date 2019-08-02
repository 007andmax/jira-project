import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextAreaStateService {
  resetState = new EventEmitter<any>();
  constructor() { }
  public onInitReset() {
    this.resetState.emit(null);
  }
  public getResetState () {
    return this.resetState
  }
}
