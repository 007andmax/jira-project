import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserCustomSubscription } from '../../class/user-custom-subscription';
import { UserDefaultSubscription } from '../../class/user-default-subscription';
import { UserSubscription } from '../../class/user-subscription';

@Component({
  selector: 'app-user-table-subscription',
  templateUrl: './user-table-subscription.component.html',
  styleUrls: ['./user-table-subscription.component.scss']
})
export class UserTableSubscriptionComponent implements OnInit {
  @Input() defaultSubscriptions: UserDefaultSubscription;
  @Input() customSubscriptions: Array<UserCustomSubscription> = [];
  @Output() onChangeDefault = new EventEmitter();
  @Output() onChangeCustom = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  updateDefault(field) {
    let subscription = JSON.parse(JSON.stringify(this.defaultSubscriptions));
    subscription[field].activated = !subscription[field].activated;
    this.onChangeDefault.emit(subscription);

  }
  updateCustom(i) {
    let subscription = JSON.parse(JSON.stringify(this.customSubscriptions));
    subscription[i].activated = !subscription[i].activated;
    this.onChangeCustom.emit(subscription);

  }

  public trackById(index, item) {
    return item.id;
  }
}
