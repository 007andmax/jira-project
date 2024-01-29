import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { UserListService } from 'src/app/components/users/services/user-list.service';
import { DELETE_SUBSCRIPTION_USER } from 'src/app/const/confirm';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';
import { MarketingSubscriptionType } from '../marketing-subscription-type/class/marketing-subscription-type';
import { MarketingEmailUsers } from './class/marketing-email-user';
import { MarketingEmailUsersAddComponent } from './marketing-email-users-add/marketing-email-users-add.component';

@Component({
  selector: 'marketing-email-users',
  templateUrl: './marketing-email-users.component.html',
  styleUrls: ['./marketing-email-users.component.scss'],
  providers: [UserListService]
})
export class MarketingEmailUsersComponent implements OnInit, OnDestroy {
  opened: boolean = false;
  users: Array<MarketingEmailUsers> = [];
  reqUsers: Array<MarketingEmailUsers> = [];
  marketingSubscription: MarketingSubscriptionType;
  sub: Subscription = new Subscription();
  toggleShowAddUser = false;
  word: string = "";
  @ViewChild('addUserDP', { static: false }) addUserDP: MarketingEmailUsersAddComponent;
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
        this.users = res.map(item => new MarketingEmailUsers(item));
        this.reqUsers = res.map(item => new MarketingEmailUsers(item));
        this.users.sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
          1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
        this.reqUsers.sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
          1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
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
    let onUpdateUsersListInAside = this.marketingEmailStateService.onUpdateUsersListInAside.subscribe(res => {
      if (this.opened && this.marketingSubscription.id === res.subscription.id) {
        this.reqUsers = res.users.map(item => new MarketingEmailUsers(item));
        this.reqUsers.sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
          1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
        this.users = this.reqUsers.filter(item => `${item.firstName} ${item.lastName}`.toLowerCase().includes(this.word));
        this.cd.detectChanges();
      }
    })
    this.sub.add(onUpdateUsersListInAside);
  }
  clearWord() {
    this.word = "";
    this.users = this.reqUsers.filter(item => `${item.firstName} ${item.lastName}`.toLowerCase().includes(""));

  }
  onSearch(event) {
    this.users = this.reqUsers.filter(item => `${item.firstName} ${item.lastName}`.toLowerCase().includes(event.target.value));
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
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Remove user from the subscription`;
    this.marketingEmailStateService.setSubscriptionUserForRemove(user);
  }
  onOpenChange(data) {
    this.addUserDP.checkClearSelectedUsers(data);
    this.cd.detectChanges();
  }
  close() {
    this.users = [];
    this.reqUsers = [];
    this.opened = false;
    this.marketingSubscription = null;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackByIndex(index, item) {
    return index;
  }
}
