import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserCustomSubscription } from '../../class/user-custom-subscription';
import { UserDefaultSubscription } from '../../class/user-default-subscription';

@Component({
  selector: 'user-table-default-subscription',
  templateUrl: './user-table-default-subscription.component.html',
  styleUrls: ['./user-table-default-subscription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTableDefaultSubscriptionComponent implements OnInit {
  @Input() defaultSubscriptions: UserDefaultSubscription;
  @Output() onChangeDefault = new EventEmitter();

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {

  }

  updateDefault(field) {
    let subscription = JSON.parse(JSON.stringify(this.defaultSubscriptions));
    subscription[field].enabled = !subscription[field].enabled;
    this.onChangeDefault.emit(subscription);
    this.ref.detectChanges();
  }

  isSeleted(field) {
    return this.defaultSubscriptions[field].enabled;
  }
}
