import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MODE_EDIT_SUBSCRIPTION, MODE_EDIT_USER_SUBSCRIPTION, MODE_HIDE_ACTIVE } from 'src/app/const/users';
import { UserDefaultSubscription } from '../../class/user-default-subscription';

@Component({
  selector: 'user-default-subscription',
  templateUrl: './user-default-subscription.component.html',
  styleUrls: ['./user-default-subscription.component.scss']
})
export class UserDefaultSubscriptionComponent implements OnInit {
  MODE_HIDE_ACTIVE = MODE_HIDE_ACTIVE;
  MODE_EDIT_SUBSCRIPTION = MODE_EDIT_SUBSCRIPTION;
  @Input() defaultSubscriptions: UserDefaultSubscription;
  @Input() mode: string;
  @Input() isDisabled: boolean = false;
  @Output() onChange = new EventEmitter();
  constructor() { }

  ngOnInit() {
    console.log("defaultSubscriptions", this.defaultSubscriptions);
  }
  public showPlaceholder() {
    return this.defaultSubscriptions.invoiceSubscription.enabled ||
      this.defaultSubscriptions.ticketSubscription.enabled ||
      this.defaultSubscriptions.ticketManagerSubscription.enabled
  }
  selected(field) {
    let subscription = JSON.parse(JSON.stringify(this.defaultSubscriptions));
    subscription[field].enabled = !subscription[field].enabled;
    subscription[field].isExist = false;
    if (this.mode == MODE_EDIT_USER_SUBSCRIPTION) subscription[field].activated = true;
    this.onChange.emit(subscription);
  }
  isSeleted(field) {
    return this.defaultSubscriptions[field].enabled;
  }
}
