import { EventEmitter, Injectable } from '@angular/core';
import { MarketingEmailRealTimeService } from './marketing-email-real-time.service';

@Injectable({
  providedIn: 'root',
})
export class MarketingEmailStateService {

  subscriptionTypeForRemove;
  subscriptionUserForRemove;
  listSubscriptionTypeForRemove = [];
  openAside: EventEmitter<any> = new EventEmitter();
  onUpdateUsersListInAside: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public updateUsersListInAside(data) {
    this.onUpdateUsersListInAside.emit(data);
  }
  public onOpenAsige(data) {
    this.openAside.emit(data);
  }
  public setSubscriptionUserForRemove(data) {
    this.subscriptionUserForRemove = data;
  }
  public getSubscriptionUserForRemove() {
    return this.subscriptionUserForRemove;
  }
  public setListSubscriptionTypeForRemove(data) {
    this.listSubscriptionTypeForRemove = data;
  }
  public getListSubscriptionTypeForRemove() {
    return this.listSubscriptionTypeForRemove;
  }
  public setSubscriptionTypeForRemove(data) {
    this.subscriptionTypeForRemove = data;
  }
  public getSubscriptionTypeForRemove() {
    return this.subscriptionTypeForRemove;
  }
}
