import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DraftEmailStateService {
  showAsideForAdd: EventEmitter<any> = new EventEmitter();
  clear: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public onClear() {
    this.clear.emit(null);
  }
  public getOnClear() {
    return this.clear;
  }
  public toggleAsideForAdd() {
    this.showAsideForAdd.emit();
  }
  public getShowAsideForAdd() {
    return this.showAsideForAdd;
  }
}
