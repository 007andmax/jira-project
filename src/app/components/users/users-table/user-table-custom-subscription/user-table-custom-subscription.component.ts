import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserCustomSubscription } from '../../class/user-custom-subscription';
import { UserDefaultSubscription } from '../../class/user-default-subscription';

@Component({
  selector: 'user-table-custom-subscription',
  templateUrl: './user-table-custom-subscription.component.html',
  styleUrls: ['./user-table-custom-subscription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTableCustomSubscriptionComponent implements OnInit {
  @Input() customSubscriptions: Array<UserCustomSubscription> = [];
  @Output() onChangeCustom = new EventEmitter();
  @Input() listCustomSubscription: Array<UserCustomSubscription> = [];
  isUpdate: boolean = false;
  constructor(private ref: ChangeDetectorRef,) { }

  ngOnInit() {

  }
  getListHiveSubscribes() {
    return this.customSubscriptions.slice(2).map(item => item.name).join(",");
  }
  toggleIsUpdate(data) {
    this.isUpdate = data;
    this.ref.markForCheck();
  }
  selected(item) {
    if (this.isUpdate) return;
    let index = this.customSubscriptions.findIndex(custom => custom.id === item.id);
    let customSubscriptions = JSON.parse(JSON.stringify(this.customSubscriptions));
    if (index > -1) {
      customSubscriptions.splice(index, 1);
      this.onChangeCustom.emit(customSubscriptions);
    }
    if (index == -1) {
      customSubscriptions.push(item);
      this.onChangeCustom.emit(customSubscriptions);
    }
    this.isUpdate = true;
    this.ref.detectChanges();
  }
  isSeleted(subscription) {
    return this.customSubscriptions.find(item => item.id === subscription.id);
  }
  public trackById(index, item) {
    return item.id;
  }
}
