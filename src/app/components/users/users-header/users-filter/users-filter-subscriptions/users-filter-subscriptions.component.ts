import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { USER_SUBSCRIPTION_TYPE_CUSTOM, USER_SUBSCRIPTION_TYPE_DEFAULT } from 'src/app/const/user-subscription';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UserCustomSubscription } from '../../../class/user-custom-subscription';
import { UserDefaultSubscription } from '../../../class/user-default-subscription';
import { UsersFilterSubscriptionsItem } from './class/users-filter-subscriptions-item';

@Component({
  selector: 'users-filter-subscriptions',
  templateUrl: './users-filter-subscriptions.component.html',
  styleUrls: ['./users-filter-subscriptions.component.scss']
})
export class UsersFilterSubscriptionsComponent implements OnInit {
  defaultSubscriptions: UserDefaultSubscription = new UserDefaultSubscription();
  customSubscriptions: Array<UserCustomSubscription> = [];
  listCustomSubscriptions: Array<UserCustomSubscription> = [];
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
  constructor(private usersStateService: UsersStateService,) { }

  ngOnInit() {

    this.defaultSubscriptions.clearEnabledAll();
    let subscriptions = [];
    subscriptions.push(new UsersFilterSubscriptionsItem("invoiceSubscription", USER_SUBSCRIPTION_TYPE_DEFAULT, "Invoice Updates"));
    subscriptions.push(new UsersFilterSubscriptionsItem("ticketSubscription", USER_SUBSCRIPTION_TYPE_DEFAULT, "Ticket Updates"));
    subscriptions.push(new UsersFilterSubscriptionsItem("ticketManagerSubscription", USER_SUBSCRIPTION_TYPE_DEFAULT, "Ticket Manager"));
    this.listCustomSubscriptions = this.usersStateService.getListCustomSubscription();
    console.log("this.listCustomSubscriptions", this.listCustomSubscriptions);
    this.usersStateService.onGetListCustomSubscription.subscribe(data => {
      this.listCustomSubscriptions = data;
      this.listCustomSubscriptions.forEach(item => {
        subscriptions.push(new UsersFilterSubscriptionsItem(item.id, USER_SUBSCRIPTION_TYPE_CUSTOM, item.name));
      })
      subscriptions.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : (b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 0));
      this.subscriptions = subscriptions.map(item => new UsersFilterSubscriptionsItem(item.id, item.type, item.name));
      this.reqSubscriptions = subscriptions.map(item => new UsersFilterSubscriptionsItem(item.id, item.type, item.name));

    })
  }
  onSearch(event) {
    this.subscriptions = this.reqSubscriptions.filter(item => item.name.toLowerCase().includes(event.target.value.toLowerCase()));
  }
  public clearWithOutChanges() {
    this.selectedSubscriptions = [];
    this.defaultSubscriptions = new UserDefaultSubscription();
    this.defaultSubscriptions.clearEnabledAll();
    this.customSubscriptions = [];
  }
  updateDefault(field, subscription) {
    let index = this.selectedSubscriptions.findIndex(custom => custom.id === subscription.id);
    if (index > -1) this.selectedSubscriptions.splice(index, 1);
    if (index == -1) this.selectedSubscriptions.push(subscription);


    this.defaultSubscriptions[field].enabled = !this.defaultSubscriptions[field].enabled;
    console.log("this.defaultSubscriptions", this.defaultSubscriptions);
    if (!this.defaultSubscriptions.invoiceSubscription.enabled &&
      !this.defaultSubscriptions.ticketManagerSubscription.enabled &&
      !this.defaultSubscriptions.ticketSubscription.enabled) {
      this.onChangeDefault.emit(null);
    } else {
      this.onChangeDefault.emit(this.defaultSubscriptions);
    }

  }
  updateCustom(item, subscription) {
    console.log("updateCustom", item);

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

  }
  toggleSubscription(item) {
    if (item.type === USER_SUBSCRIPTION_TYPE_DEFAULT) this.updateDefault(item.id, item);
    if (item.type === USER_SUBSCRIPTION_TYPE_CUSTOM) this.updateCustom(this.listCustomSubscriptions.find(subscription => subscription.id === item.id), item);
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
}
