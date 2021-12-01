import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MarketingEmailStateService {

  subscriptionTypeForRemove;
  listSubscriptionTypeForRemove = [];
  constructor() { }

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
