import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MarketingSubscriptionType } from 'src/app/components/setting/marketing-email/marketing-subscription-type/class/marketing-subscription-type';
import { MODE_HIDE_ACTIVE } from 'src/app/const/users';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';
import { UserCustomSubscription } from '../../class/user-custom-subscription';

@Component({
  selector: 'user-custom-subscription',
  templateUrl: './user-custom-subscription.component.html',
  styleUrls: ['./user-custom-subscription.component.scss']
})
export class UserCustomSubscriptionComponent implements OnInit {
  MODE_HIDE_ACTIVE = MODE_HIDE_ACTIVE;
  @Input() mode: string;
  @Input() customSubscriptions: Array<UserCustomSubscription> = [];
  @Input() classDropDown: string;
  @Output() onChange = new EventEmitter();
  list: Array<MarketingSubscriptionType> = [];
  sub: Subscription = new Subscription();
  constructor(private marketingEmailStateService: MarketingEmailStateService) { }

  ngOnInit() {
    this.list = this.marketingEmailStateService.getListCustomSubscription();
    let onGetListCustomSubscription = this.marketingEmailStateService.onGetListCustomSubscription.subscribe(data => {
      this.list = data;
    })
    this.sub.add(onGetListCustomSubscription);
  }
  selected(item) {
    let index = this.customSubscriptions.findIndex(custom => custom.id === item.id);
    if (index > -1) this.customSubscriptions.splice(index, 1);
    if (index == -1) {
      item.isExist = false;
      this.customSubscriptions.push(item);
    }
    this.onChange.emit(this.customSubscriptions);
  }
  isSeleted(subscription) {
    return this.customSubscriptions.find(item => item.id === subscription.id);
  }
  public showPlaceholder() {
    return this.customSubscriptions.length > 0
  }
  public trackById(index, item) {
    return item.id;
  }
}
