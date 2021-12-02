import { EventEmitter, Injectable } from '@angular/core';
import { MarketingEmailRealTimeService } from './marketing-email-real-time.service';

@Injectable({
  providedIn: 'root',
})
export class MarketingEmailStateService {

  subscriptionTypeForRemove;
  listSubscriptionTypeForRemove = [];
  openAside: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public onOpenAsige(data) {
    this.openAside.emit(data);
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
