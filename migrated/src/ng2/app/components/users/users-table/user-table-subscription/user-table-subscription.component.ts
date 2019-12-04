import { Component, OnInit, Input } from '@angular/core';
import { UserSubscription } from '../../class/user-subscription';

@Component({
  selector: 'app-user-table-subscription',
  templateUrl: './user-table-subscription.component.html',
  styleUrls: ['./user-table-subscription.component.scss']
})
export class UserTableSubscriptionComponent implements OnInit {
  @Input() subscription: UserSubscription;
  list = [];
  title:string = '';
  constructor() { }

  ngOnInit() {
    if (this.subscription.ticket) this.list.push('Updates');
    if (this.subscription.invoice) this.list.push('Invoice');
    if (this.subscription.ticketManager) this.list.push('Manager');
this.title = this.list.join(', ')

  }
  

}
