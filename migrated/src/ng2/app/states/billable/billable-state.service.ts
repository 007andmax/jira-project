import { Injectable, EventEmitter } from '@angular/core';
import { BillableProfile } from '../../components/billing/billable/class/billable-profile';

@Injectable({
  providedIn: 'root'
})
export class BillableStateService {
  billableProfile: BillableProfile;
  lockedTicketForRemove: string = null;
  create: EventEmitter<any> = new EventEmitter();
  preview: EventEmitter<any> = new EventEmitter();
  editCustomer: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public getLockedTicketForRemove() {
    return this.lockedTicketForRemove;
  }
  public setLockedTicketForRemove(data) {
    this.lockedTicketForRemove = data;
  }
  public getOnEditCustomer() {
    return this.editCustomer;
  }
  public onEditCustomer(data) {
    this.editCustomer.emit(data);
  }
  public onCreate(ticketsIds) {
    this.create.emit(ticketsIds);
  }
  public onPreview() {
    this.preview.emit(null);
  }
  public getOnPreview() {
    return this.preview;
  }
  public getOnCreate() {
    return this.create;
  }
  public getBillableProfile() {
    return this.billableProfile;
  }
  public setBillableProfile(data) {
    this.billableProfile = data;
  }
}
