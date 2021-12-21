import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { MarketingEmailRealTimeService } from 'src/app/states/marketing-email/marketing-email-real-time.service';
import { MarketingSubscriptionType } from '../../setting/marketing-email/marketing-subscription-type/class/marketing-subscription-type';
import { User } from '../class/user';

@Component({
  selector: 'add-user-to-subscribe',
  templateUrl: './add-user-to-subscribe.component.html',
  styleUrls: ['./add-user-to-subscribe.component.scss']
})
export class AddUserToSubscribeComponent implements OnInit {
  marketingSubscriptionList: Array<MarketingSubscriptionType> = [];
  selectedSubscriptions: Array<MarketingSubscriptionType> = [];
  isEditMode: boolean = false;
  @Input() users: Array<User> = [];
  sub: Subscription = new Subscription();
  constructor(private marketingEmailService: MarketingEmailService,
    private marketingEmailRealTimeService: MarketingEmailRealTimeService,
    public activeModal: NgbActiveModal,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.marketingEmailService.getList().subscribe((data: any) => {
      this.marketingSubscriptionList = data.map(item => new MarketingSubscriptionType(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));

      this.cd.detectChanges();
    })
    let changeCrmArray = this.marketingEmailRealTimeService.changeCrmArray.subscribe(data => {
      console.log("data", data);
      if (data.action === "CUSTOM_SUBSCRIPTION_CREATED") this.marketingSubscriptionList.push(new MarketingSubscriptionType(data.data));
      if (data.action === "CUSTOM_SUBSCRIPTION_DELETED") {
        let index = this.marketingSubscriptionList.findIndex(item => item.id === data.data);
        if (index > -1) this.marketingSubscriptionList.splice(index, 1);
      }
      if (data.action === "CUSTOM_SUBSCRIPTION_EDITED") {
        let index = this.marketingSubscriptionList.findIndex(item => item.id === data.data.id);
        if (index > -1) this.marketingSubscriptionList[index].onUpdate(data.data);
      }
      if (data.action === "MODIFIED_USERS_LIST") {
        let index = this.marketingSubscriptionList.findIndex(item => item.id === data.data.subscription.id);
        if (index > -1) this.marketingSubscriptionList[index].onUpdate(data.data.subscription);
        console.log("this.marketingSubscriptionList[index]", this.marketingSubscriptionList[index]);
      }
      this.marketingSubscriptionList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.cd.detectChanges();

    })
    this.sub.add(changeCrmArray);
  }
  onSelectSubscription(item) {
    let index = this.selectedSubscriptions.findIndex(subscription => subscription.id === item.id);
    if (index > -1) this.selectedSubscriptions.splice(index, 1);
    if (index === -1) this.selectedSubscriptions.push(item);
    console.log("this.selectedSubscriptions", this.selectedSubscriptions);
  }
  close() {
    this.activeModal.close();

  }
  save() {
    let subscriptions = [];
    this.selectedSubscriptions.forEach(subscription => {
      let users = this.users.filter(user => !user.customSubscriptions.find(customSubscription => customSubscription.id === subscription.id))
      if (users.length > 0) subscriptions.push({ id: subscription.id, users: users.map(user => user.id) })
    })
    if (subscriptions.length > 0) {
      forkJoin(subscriptions.map(item => this.marketingEmailService.addUsers(item.id, item.users).pipe(map((res) => res),
        catchError(error => of(undefined)))))
        .subscribe(
          () => {
            this.close();
          },
          error => {
          }
        );
    }
  }

}
