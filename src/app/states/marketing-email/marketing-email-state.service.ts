import { EventEmitter, Injectable } from '@angular/core';
import { MarketingSubscriptionType } from 'src/app/components/setting/marketing-email/marketing-subscription-type/class/marketing-subscription-type';
import { UserCustomSubscription } from 'src/app/components/users/class/user-custom-subscription';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { MarketingEmailRealTimeService } from './marketing-email-real-time.service';

@Injectable({
  providedIn: 'root',
})
export class MarketingEmailStateService {

  subscriptionTypeForRemove;
  subscriptionUserForRemove;
  listSubscriptionTypeForRemove = [];
  listCustomSubscription: Array<MarketingSubscriptionType> = [];
  openAside: EventEmitter<any> = new EventEmitter();
  onUpdateUsersListInAside: EventEmitter<any> = new EventEmitter();
  onGetListCustomSubscription: EventEmitter<any> = new EventEmitter();
  constructor(private marketingEmailService: MarketingEmailService,
    private marketingEmailRealTimeService: MarketingEmailRealTimeService,) { }

  public onInit() {
    this.marketingEmailService.getList().subscribe((data: any) => {
      this.listCustomSubscription = data.map(item => new MarketingSubscriptionType(item));
      this.listCustomSubscription.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : (b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 0));
      this.onGetListCustomSubscription.emit(this.listCustomSubscription);
    });
    this.marketingEmailRealTimeService.changeCrmArray.subscribe(data => {
      if (data.action === "CUSTOM_SUBSCRIPTION_CREATED") this.listCustomSubscription.push(new MarketingSubscriptionType(data.data));
      if (data.action === "CUSTOM_SUBSCRIPTION_DELETED") {
        let index = this.listCustomSubscription.findIndex(item => item.id === data.data);
        if (index > -1) this.listCustomSubscription.splice(index, 1);
      }
      if (data.action === "CUSTOM_SUBSCRIPTION_EDITED") {
        let index = this.listCustomSubscription.findIndex(item => item.id === data.data.id);
        if (index > -1) this.listCustomSubscription[index].onUpdate(data.data);
      }
      if (data.action === "MODIFIED_USERS_LIST") {
        let index = this.listCustomSubscription.findIndex(item => item.id === data.data.subscription.id);
        if (index > -1) this.listCustomSubscription[index].onUpdate(data.data.subscription);
      }
      this.listCustomSubscription.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.onGetListCustomSubscription.emit(this.listCustomSubscription);
    })

  }
  public getListCustomSubscription() {
    return this.listCustomSubscription;
  }
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
