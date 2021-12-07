import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MODE_HIDE_ACTIVE } from 'src/app/const/users';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { UserCustomSubscription } from '../../class/user-custom-subscription';

@Component({
  selector: 'user-custom-subscription',
  templateUrl: './user-custom-subscription.component.html',
  styleUrls: ['./user-custom-subscription.component.scss']
})
export class UserCustomSubscriptionComponent implements OnInit {
  MODE_HIDE_ACTIVE = MODE_HIDE_ACTIVE;
  @Input() mode: string;
  @Input() customSubscriptions: Array<UserCustomSubscription> = [];
  @Input() classDropDown: string;
  @Output() onChange = new EventEmitter();
  list: Array<UserCustomSubscription> = [];
  constructor(private marketingEmailService: MarketingEmailService) { }

  ngOnInit() {
    this.marketingEmailService.getList().subscribe((data: any) => {
      this.list = data.map(item => new UserCustomSubscription(item));
    });
  }
  selected(item) {
    let index = this.customSubscriptions.findIndex(custom => custom.id === item.id);
    if (index > -1) this.customSubscriptions.splice(index, 1);
    if (index == -1) {
      item.isExist = false;
      this.customSubscriptions.push(item);
    }
    this.onChange.emit(this.customSubscriptions);
  }

}
