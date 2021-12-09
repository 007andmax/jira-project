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
  @Output() onAddCustom = new EventEmitter();
  @Output() onRemoveCustom = new EventEmitter();
  @Input() listCustomSubscription: Array<UserCustomSubscription> = [];
  constructor() { }

  ngOnInit() {

  }

  selected(item) {
    let index = this.customSubscriptions.findIndex(custom => custom.id === item.id);
    if (index > -1) {
      this.onRemoveCustom.emit(item);
    }
    if (index == -1) {

      this.onAddCustom.emit(item);
    }

  }
  isSeleted(subscription) {
    return this.customSubscriptions.find(item => item.id === subscription.id);
  }
}
