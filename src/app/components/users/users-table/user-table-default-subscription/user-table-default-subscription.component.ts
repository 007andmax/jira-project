import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() isDisabled: boolean = false;
  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {

  }

  updateDefault(field) {
    this.defaultSubscriptions[field].enabled = !this.defaultSubscriptions[field].enabled;
    this.onChangeDefault.emit(this.defaultSubscriptions);
    this.ref.detectChanges();
  }

  isSeleted(field) {
    return this.defaultSubscriptions[field].enabled;
  }
}
