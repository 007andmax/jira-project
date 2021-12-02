import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/components/users/class/user';
import { UserListService } from 'src/app/components/users/services/user-list.service';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { MarketingSubscriptionType } from '../marketing-subscription-type/class/marketing-subscription-type';
import { MarketingEmailUsers } from './class/marketing-email-user';

@Component({
  selector: 'marketing-email-users',
  templateUrl: './marketing-email-users.component.html',
  styleUrls: ['./marketing-email-users.component.scss'],
  providers: [UserListService]
})
export class MarketingEmailUsersComponent implements OnInit {
  opened: boolean = false;
  users: Array<MarketingEmailUsers> = [];
  marketingSubscription: MarketingSubscriptionType;
  constructor(private marketingEmailStateService: MarketingEmailStateService,
    private marketingEmailService: MarketingEmailService,
  ) { }

  ngOnInit() {
    this.marketingEmailStateService.openAside.subscribe(data => {
      this.marketingSubscription = data;
      this.opened = true;
      this.marketingEmailService.getUsersList(data.id).subscribe((res: any) => {
        console.log("res", res);
        this.users = res.map(item => new MarketingEmailUsers(item));
      })
    })


  }
  remove(user) {
    this.marketingEmailService.removeUser(user.id, this.marketingSubscription.id).subscribe(data => {

    })
  }
  close() {
    this.opened = false;
  }
}
