import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DELETE_SUBSCRIPTION_TYPE } from 'src/app/const/confirm';
import { MODE_ADD_BY_MODAL } from 'src/app/const/user-subscription';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { MarketingEmailRealTimeService } from 'src/app/states/marketing-email/marketing-email-real-time.service';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';
import { MarketingSubscriptionType } from '../../setting/marketing-email/marketing-subscription-type/class/marketing-subscription-type';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { User } from '../class/user';

@Component({
  selector: 'add-user-to-subscribe',
  templateUrl: './add-user-to-subscribe.component.html',
  styleUrls: ['./add-user-to-subscribe.component.scss']
})
export class AddUserToSubscribeComponent implements OnInit {
  MODE_ADD_BY_MODAL = MODE_ADD_BY_MODAL;
  marketingSubscriptionList: Array<MarketingSubscriptionType> = [];
  selectedSubscriptions: Array<MarketingSubscriptionType> = [];
  isEditMode: boolean = false;
  showAdd: boolean = false;
  selectedForEditSubscription: MarketingSubscriptionType;
  showPreloader: boolean = true;
  @Input() users: Array<User> = [];
  sub: Subscription = new Subscription();
  constructor(private marketingEmailService: MarketingEmailService,
    private marketingEmailRealTimeService: MarketingEmailRealTimeService,
    public activeModal: NgbActiveModal,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private marketingEmailStateService: MarketingEmailStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_SUBSCRIPTION_TYPE) {
          this.onRemoveSubscription(this.marketingEmailStateService.getSubscriptionTypeForRemove().id);
        }

      }
    })
    this.sub.add(getConfirm);
    this.marketingSubscriptionList = this.marketingEmailStateService.getListCustomSubscription();
    if (this.marketingSubscriptionList.length > 0) this.showPreloader = false;
    let onGetListCustomSubscription = this.marketingEmailStateService.onGetListCustomSubscription.subscribe(data => {
      this.marketingSubscriptionList = data;
      this.showPreloader = false;
      this.cd.detectChanges();
    })
    this.sub.add(onGetListCustomSubscription);


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
  onRemoveSubscription(id) {
    this.marketingEmailService.removeSubscriptionType(id).subscribe(data => {
      this.marketingEmailStateService.setListSubscriptionTypeForRemove([]);
      this.cd.detectChanges();
    })
  }
  onEditSubscription(item, event) {
    if (item.isInitEdit) {
      if (item.length === 0 || item.disableUpdate) return;
      this.marketingEmailService.editSubscriptionType(item.id, item.name).pipe(map((res) => res),
        catchError(error => of(undefined)))
        .subscribe(data => {
          item.onInitEdit(false);
          console.log("event", event);
          if (event) event.target.blur();
        })
    }
  }
  toggleEditMode(data) {
    this.isEditMode = data;
    this.selectedSubscriptions = [];
    this.editSubscription(null);
  }
  editSubscription(item) {
    this.selectedForEditSubscription = item;
  }
  isSelectedForEdit(item) {
    if (!this.selectedForEditSubscription) return false;
    return this.selectedForEditSubscription.id === item.id;
  }
  isSelected(item) {
    return this.selectedSubscriptions.find(subscription => subscription.id == item.id);
  }
  onSelectSubscription(item) {
    let index = this.selectedSubscriptions.findIndex(subscription => subscription.id === item.id);
    if (index > -1) this.selectedSubscriptions.splice(index, 1);
    if (index === -1) this.selectedSubscriptions.push(item);
    console.log("this.selectedSubscriptions", this.selectedSubscriptions);
  }
  removeSubscription(item) {
    this.confirmStateService.setConfirmAction(DELETE_SUBSCRIPTION_TYPE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Remove Subscription`;
    this.marketingEmailStateService.setSubscriptionTypeForRemove(item);
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
  ngOnDestroy(): void {
    this.marketingEmailStateService.setListSubscriptionTypeForRemove([]);
    this.sub.unsubscribe();
  }
}
