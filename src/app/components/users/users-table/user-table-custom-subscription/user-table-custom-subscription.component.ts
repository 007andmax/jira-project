import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserCustomSubscription } from '../../class/user-custom-subscription';
import { UserDefaultSubscription } from '../../class/user-default-subscription';

@Component({
  selector: 'user-table-custom-subscription',
  templateUrl: './user-table-custom-subscription.component.html',
  styleUrls: ['./user-table-custom-subscription.component.scss']
})
export class UserTableCustomSubscriptionComponent implements OnInit {
  @Input() customSubscriptions: Array<UserCustomSubscription> = [];
  @Output() onChangeCustom = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }


  updateCustom(i) {
    let subscription = JSON.parse(JSON.stringify(this.customSubscriptions));
    subscription[i].activated = !subscription[i].activated;
    this.onChangeCustom.emit(subscription);

  }
}
