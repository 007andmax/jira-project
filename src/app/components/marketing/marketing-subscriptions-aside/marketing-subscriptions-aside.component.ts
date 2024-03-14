import { Component, OnInit } from '@angular/core';
import { MarketingSubscriptionType } from '../../setting/marketing-email/marketing-subscription-type/class/marketing-subscription-type';
import { Subscription } from 'rxjs';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { DELETE_SUBSCRIPTION_TYPE } from 'src/app/const/confirm';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';

@Component({
  selector: 'app-marketing-subscriptions-aside',
  templateUrl: './marketing-subscriptions-aside.component.html',
  styleUrls: ['./marketing-subscriptions-aside.component.scss']
})
export class MarketingSubscriptionsAsideComponent implements OnInit {
  listCustomSubscription: Array<MarketingSubscriptionType> = [];
  editMode: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private marketingEmailStateService: MarketingEmailStateService,
    private marketingEmailService: MarketingEmailService,
    private confirmStateService: ConfirmStateService,) { }

  ngOnInit() {
    this.listCustomSubscription = this.marketingEmailStateService.getListCustomSubscription();
    let onGetListCustomSubscription = this.marketingEmailStateService.onGetListCustomSubscription.subscribe(data => {
      this.listCustomSubscription = data;
    })
    this.sub.add(onGetListCustomSubscription);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_SUBSCRIPTION_TYPE) {
          this.onRemoveSubscription(this.marketingEmailStateService.getSubscriptionTypeForRemove().id);
        }
        /* if (this.confirmStateService.getConfirmAction() === DELETE_SUBSCRIPTION_TYPIES) {
           this.onRemoveSubscriptions();
         }*/
      }
    })
    this.sub.add(getConfirm);
  }
  edit() {
    this.editMode = !this.editMode;
  }
  onRemoveSubscription(id) {
    this.marketingEmailService.removeSubscriptionType(id).subscribe(data => {
      this.marketingEmailStateService.setListSubscriptionTypeForRemove([]);
    })
  }
}
