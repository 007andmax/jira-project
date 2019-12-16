import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DraftEmailStateService {
  showAsideForAdd: EventEmitter<any> = new EventEmitter();
  clear: EventEmitter<any> = new EventEmitter();
  action:string = null;
  constructor() { }

  public setAction(data) {
    this.action = data;
  }
  public getAction() {
    return this.action;
  }
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
