import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MarketingSubscriptionType } from '../../setting/marketing-email/marketing-subscription-type/class/marketing-subscription-type';
import { Subscription, forkJoin, of } from 'rxjs';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { DELETE_SUBSCRIPTION_TYPE } from 'src/app/const/confirm';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MarketingSubscriptionsAddComponent } from './marketing-subscriptions-add/marketing-subscriptions-add.component';
import { User } from '../../users/class/user';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';

@Component({
  selector: 'app-marketing-subscriptions-aside',
  templateUrl: './marketing-subscriptions-aside.component.html',
  styleUrls: ['./marketing-subscriptions-aside.component.scss']
})
export class MarketingSubscriptionsAsideComponent implements OnInit, OnDestroy {
  opened: boolean = false;
  listCustomSubscription: Array<MarketingSubscriptionType> = [];
  users: Array<User> = [];
  editMode: boolean = false;
  sub: Subscription = new Subscription();
  @ViewChild('addBtn', { static: false }) addBtn: DisabledBtnDirective;
  constructor(private marketingEmailStateService: MarketingEmailStateService,
    private marketingEmailService: MarketingEmailService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
    private confirmStateService: ConfirmStateService,) { }


  ngOnInit() {
    this.listCustomSubscription = this.marketingEmailStateService.getListCustomSubscription();
    let onGetListCustomSubscription = this.marketingEmailStateService.onGetListCustomSubscription.subscribe(data => {
      this.listCustomSubscription = data;
    })
    this.sub.add(onGetListCustomSubscription);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data && this.opened) {
        if (this.confirmStateService.getConfirmAction() === DELETE_SUBSCRIPTION_TYPE) {
          this.onRemoveSubscription(this.marketingEmailStateService.getSubscriptionTypeForRemove().id);
        }
        /* if (this.confirmStateService.getConfirmAction() === DELETE_SUBSCRIPTION_TYPIES) {
           this.onRemoveSubscriptions();
         }*/
      }
    })
    this.sub.add(getConfirm);
    let openAside = this.marketingEmailStateService.openAside.subscribe(data => {
      this.users = this.marketingEmailStateService.getUsersForAddSubscriptions();
      this.opened = true;
    })
    this.sub.add(openAside);
  }
  toggleEdit() {
    this.editMode = !this.editMode;
  }
  add() {
    const modalRef = this.modalService.open(MarketingSubscriptionsAddComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
  }
  save() {
    let subscriptions = [];
    this.listCustomSubscription.filter(item => item.selected).forEach(subscription => {
      let users = this.users.filter(user => !user.customSubscriptions.find(customSubscription => customSubscription.id === subscription.id))
      if (users.length > 0) subscriptions.push({ id: subscription.id, users: users.map(user => user.id) })
    })
    let checkEdit = this.listCustomSubscription.find(item => item.isInitEdit);
    if (checkEdit) return;
    this.addBtn.setDisabled(true);
    if (subscriptions.length > 0) {
      forkJoin(subscriptions.map(item => this.marketingEmailService.addUsers(item.id, item.users).pipe(map((res) => res),
        catchError(error => of(undefined)))))
        .subscribe(
          () => {
            this.toastrService.success("The subscription has been successfully added");
            this.appStateService.changeDetectorRef();
            this.addBtn.setDisabled(false);
            this.close();
          },
          error => {
          }
        );
    } else {
      this.addBtn.setDisabled(false);
      this.close();
    }
  }
  close() {
    this.opened = false;
    this.listCustomSubscription.forEach(item => item.selected = false);
  }
  onRemoveSubscription(id) {
    this.marketingEmailService.removeSubscriptionType(id).subscribe(data => {
      this.marketingEmailStateService.setListSubscriptionTypeForRemove([]);
    })
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
