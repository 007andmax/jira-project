import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserCustomSubscription } from '../../class/user-custom-subscription';
import { UserDefaultSubscription } from '../../class/user-default-subscription';

@Component({
  selector: 'user-table-default-subscription',
  templateUrl: './user-table-default-subscription.component.html',
  styleUrls: ['./user-table-default-subscription.component.scss']
})
export class UserTableDefaultSubscriptionComponent implements OnInit {
  @Input() defaultSubscriptions: UserDefaultSubscription;
  @Output() onChangeDefault = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  updateDefault(field) {
    let subscription = JSON.parse(JSON.stringify(this.defaultSubscriptions));
    subscription[field].activated = !subscription[field].activated;
    this.onChangeDefault.emit(subscription);

  }


}
