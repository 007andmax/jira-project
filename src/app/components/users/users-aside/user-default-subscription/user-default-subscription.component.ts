import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserDefaultSubscription } from '../../class/user-default-subscription';


@Component({
  selector: 'user-default-subscription',
  templateUrl: './user-default-subscription.component.html',
  styleUrls: ['./user-default-subscription.component.scss']
})
export class UserDefaultSubscriptionComponent implements OnInit {
  @Input() defaultSubscriptions: UserDefaultSubscription;
  @Output() onChange = new EventEmitter();
  constructor() { }

  ngOnInit() {
    console.log("defaultSubscriptions", this.defaultSubscriptions);
  }
  selected(field) {
    let subscription = JSON.parse(JSON.stringify(this.defaultSubscriptions));
    subscription[field].enabled = !subscription[field].enabled;
    this.onChange.emit(subscription);
  }
}
