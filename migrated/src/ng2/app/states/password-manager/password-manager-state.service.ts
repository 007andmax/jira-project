import { Injectable } from '@angular/core';
import { PasswordRecord } from '../../components/password-manager/class/password-record';

@Injectable({
  providedIn: 'root'
})
export class PasswordManagerStateService {
  recordForRemove: PasswordRecord = null;
  constructor() { }

  public setRecordForRemove(data) {
    this.recordForRemove = data;
  }
  public getRecordForRemove() {
    return this.recordForRemove;
  }
}
