import { Component, OnInit } from '@angular/core';
import { UserSubscription } from '../../class/user-subscription';

@Component({
  selector: 'app-user-table-subscription',
  templateUrl: './user-table-subscription.component.html',
  styleUrls: ['./user-table-subscription.component.scss']
})
export class UserTableSubscriptionComponent implements OnInit {
  subscription: UserSubscription;
  constructor() { }

  ngOnInit() {
  }

}
