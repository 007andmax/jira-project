import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MarketingSubscriptionType } from 'src/app/components/setting/marketing-email/marketing-subscription-type/class/marketing-subscription-type';
import { USER_SUBSCRIPTION_TYPE_CUSTOM, USER_SUBSCRIPTION_TYPE_DEFAULT } from 'src/app/const/user-subscription';
import { MODE_MARKETING_USERS_LIST, MODE_USERS_LIST } from 'src/app/const/users';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UserCustomSubscription } from '../../../class/user-custom-subscription';
import { UserDefaultSubscription } from '../../../class/user-default-subscription';
import { UsersFilterSubscriptionsItem } from './class/users-filter-subscriptions-item';

@Component({
  selector: 'users-filter-subscriptions',
  templateUrl: './users-filter-subscriptions.component.html',
  styleUrls: ['./users-filter-subscriptions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersFilterSubscriptionsComponent implements OnInit {
  defaultSubscriptions: UserDefaultSubscription = new UserDefaultSubscription();
  customSubscriptions: Array<UserCustomSubscription> = [];
  listCustomSubscriptions: Array<MarketingSubscriptionType> = [];
  subscriptions: Array<UsersFilterSubscriptionsItem> = [];
  reqSubscriptions: Array<UsersFilterSubscriptionsItem> = [];
  selectedSubscriptions: Array<UsersFilterSubscriptionsItem> = [];
  @Output() onChangeDefault = new EventEmitter();
  @Output() onChangeCustom = new EventEmitter();
  searchName: string = "";
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('dp') dp: any;
  @Output() tagsChange = new EventEmitter();
  sub: Subscription = new Subscription();
  constructor(private marketingEmailStateService: MarketingEmailStateService,
    private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.listCustomSubscriptions = this.marketingEmailStateService.getListCustomSubscription();
    this.setSubscriptions();
    let onGetListCustomSubscription = this.marketingEmailStateService.onGetListCustomSubscription.subscribe(data => {
      this.listCustomSubscriptions = data;
      this.setSubscriptions();
    })
    this.sub.add(onGetListCustomSubscription);
  }
  setSubscriptions() {
    this.defaultSubscriptions.clearEnabledAll();
    let subscriptions = [];
    subscriptions.push(new UsersFilterSubscriptionsItem("invoiceSubscription", USER_SUBSCRIPTION_TYPE_DEFAULT, "Invoice Updates"));
    subscriptions.push(new UsersFilterSubscriptionsItem("ticketSubscription", USER_SUBSCRIPTION_TYPE_DEFAULT, "Ticket Updates"));
    subscriptions.push(new UsersFilterSubscriptionsItem("ticketManagerSubscription", USER_SUBSCRIPTION_TYPE_DEFAULT, "Ticket Manager"));
    this.listCustomSubscriptions.forEach(item => {
      subscriptions.push(new UsersFilterSubscriptionsItem(item.id, USER_SUBSCRIPTION_TYPE_CUSTOM, item.name));
    })
    subscriptions.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : (b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 0));
    this.subscriptions = subscriptions.map(item => new UsersFilterSubscriptionsItem(item.id, item.type, item.name));
    this.reqSubscriptions = subscriptions.map(item => new UsersFilterSubscriptionsItem(item.id, item.type, item.name));
    this.ref.markForCheck();
  }
  onSearch(event) {
    this.subscriptions = this.reqSubscriptions.filter(item => item.name.toLowerCase().includes(event.target.value.toLowerCase()));
    this.ref.markForCheck();
  }
  public clearWithOutChanges() {
    this.tagCtrl.setValue(null);
    this.selectedSubscriptions = [];
    this.defaultSubscriptions = new UserDefaultSubscription();
    this.defaultSubscriptions.clearEnabledAll();
    this.customSubscriptions = [];
    this.subscriptions = this.reqSubscriptions.filter(item => item.name.toLowerCase().includes(""));
    this.ref.markForCheck();
  }
  public clearCustomSubscription() {
    this.tagCtrl.setValue(null);
    this.selectedSubscriptions = this.selectedSubscriptions.filter(item => item.type === USER_SUBSCRIPTION_TYPE_DEFAULT);
    this.customSubscriptions = [];
    this.subscriptions = this.reqSubscriptions.filter(item => item.name.toLowerCase().includes(""));
    this.ref.markForCheck();
  }
  updateDefault(field, subscription) {
    let index = this.selectedSubscriptions.findIndex(custom => custom.id === subscription.id);
    if (index > -1) this.selectedSubscriptions.splice(index, 1);
    if (index == -1) this.selectedSubscriptions.push(subscription);
    this.defaultSubscriptions[field].enabled = !this.defaultSubscriptions[field].enabled;
    if (!this.defaultSubscriptions.invoiceSubscription.enabled &&
      !this.defaultSubscriptions.ticketManagerSubscription.enabled &&
      !this.defaultSubscriptions.ticketSubscription.enabled) {
      this.onChangeDefault.emit(null);
    } else {
      this.onChangeDefault.emit(this.defaultSubscriptions);
    }
    this.ref.detectChanges();
  }
  updateCustom(item, subscription) {
    let indexSubscription = this.selectedSubscriptions.findIndex(custom => custom.id === subscription.id);
    if (indexSubscription > -1) this.selectedSubscriptions.splice(indexSubscription, 1);
    if (indexSubscription == -1) this.selectedSubscriptions.push(subscription);
    let index = this.customSubscriptions.findIndex(custom => custom.id === item.id);
    if (index > -1) {
      this.customSubscriptions.splice(index, 1);
      this.onChangeCustom.emit(this.customSubscriptions);
    }
    if (index == -1) {
      this.customSubscriptions.push(item);
      this.onChangeCustom.emit(this.customSubscriptions);
    }
    this.ref.detectChanges();
  }
  toggleSubscription(item) {
    this.tagCtrl.setValue(null);
    this.subscriptions = this.reqSubscriptions.filter(item => item.name.toLowerCase().includes(""));
    if (item.type === USER_SUBSCRIPTION_TYPE_DEFAULT) this.updateDefault(item.id, item);
    if (item.type === USER_SUBSCRIPTION_TYPE_CUSTOM) this.updateCustom(this.listCustomSubscriptions.find(subscription => subscription.id === item.id), item);
    this.ref.markForCheck();
  }
  isSelected(subscription) {
    return this.selectedSubscriptions.find(item => item.id === subscription.id);
  }
  isSeletedDefault(field) {
    return this.defaultSubscriptions[field].enabled;
  }
  isSeletedCustom(subscription) {
    return this.customSubscriptions.find(item => item.id === subscription.id);
  }
  openChange(data) {
    this.ref.markForCheck();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackById(index, item) {
    return item.id;
  }
}
