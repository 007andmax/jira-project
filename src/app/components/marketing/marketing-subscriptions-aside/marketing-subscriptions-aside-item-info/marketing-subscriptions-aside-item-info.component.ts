import { Component, Input, OnInit } from '@angular/core';
import { MarketingSubscriptionType } from 'src/app/components/setting/marketing-email/marketing-subscription-type/class/marketing-subscription-type';


@Component({
  selector: 'app-marketing-subscriptions-aside-item-info',
  templateUrl: './marketing-subscriptions-aside-item-info.component.html',
  styleUrls: ['./marketing-subscriptions-aside-item-info.component.scss']
})
export class MarketingSubscriptionsAsideItemInfoComponent implements OnInit {

  @Input() subscription: MarketingSubscriptionType;

  constructor() { }

  ngOnInit() {
  }

}
