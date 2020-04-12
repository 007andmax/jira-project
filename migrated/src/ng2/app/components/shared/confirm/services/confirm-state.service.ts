import { Injectable, EventEmitter } from '@angular/core';
import { ConfrmData } from '../class/confirm-data';

@Injectable({
  providedIn: 'root'
})
export class ConfirmStateService {
  action: string;
  onConfirm: EventEmitter<any> = new EventEmitter();
  constructor() { }
  public setConfirmAction(action) {
    this.action = action;
  }
  public getConfirmAction() {
    return this.action;
  }
  public setConfirm(data) {
    this.onConfirm.emit(data);
  }
  public getConfirm() {
    return this.onConfirm;
  }

}
