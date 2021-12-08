import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { User } from 'src/app/components/users/class/user';
import { UserListService } from 'src/app/components/users/services/user-list.service';
import { DELETE_SUBSCRIPTION_USER } from 'src/app/const/confirm';
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
export class MarketingEmailUsersComponent implements OnInit, OnDestroy {
  opened: boolean = false;
  users: Array<MarketingEmailUsers> = [];
  marketingSubscription: MarketingSubscriptionType;
  sub: Subscription = new Subscription();
  constructor(private marketingEmailStateService: MarketingEmailStateService,
    private marketingEmailService: MarketingEmailService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public cd: ChangeDetectorRef,

  ) { }

  ngOnInit() {
    let openAside = this.marketingEmailStateService.openAside.subscribe(data => {
      this.marketingSubscription = data;
      this.opened = true;
      this.marketingEmailService.getUsersList(data.id, data.getSubscribed()).subscribe((res: any) => {
        console.log("res", res);
        this.users = res.map(item => new MarketingEmailUsers(item));
      })
    })
    this.sub.add(openAside);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_SUBSCRIPTION_USER) {
          this.onRemove(this.marketingEmailStateService.getSubscriptionUserForRemove().id);
        }
      }
    })
    this.sub.add(getConfirm);

  }
  parseNameAside() {
    return `${this.marketingSubscription.name} - ${this.marketingSubscription.getSubscribed() ? 'Subscribed  Users' : 'Unsubscribed  Users'}`;
  }
  onRemove(id) {
    this.marketingEmailService.removeUser(id, this.marketingSubscription.id).subscribe(data => {

    })
  }
  remove(user) {
    this.confirmStateService.setConfirmAction(DELETE_SUBSCRIPTION_USER);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Remove user`;
    this.marketingEmailStateService.setSubscriptionUserForRemove(user);


  }
  close() {
    this.opened = false;
    this.marketingSubscription = null;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
