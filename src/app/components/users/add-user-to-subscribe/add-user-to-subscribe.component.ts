import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DELETE_SUBSCRIPTION_TYPE } from 'src/app/const/confirm';
import { MODE_ADD_BY_MODAL } from 'src/app/const/user-subscription';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn.directive';
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
  isAddNewSubscription: boolean = false;
  @Input() users: Array<User> = [];
  @ViewChild('addBtn') addBtn: DisabledBtnDirective;
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
    this.marketingSubscriptionList = JSON.parse(JSON.stringify(this.marketingEmailStateService.getListCustomSubscription())).map(item => new MarketingSubscriptionType(item));
    if (this.marketingSubscriptionList.length > 0) this.showPreloader = false;
    if (this.marketingEmailStateService.isGetMarketing) this.showPreloader = false;
    let onGetListCustomSubscription = this.marketingEmailStateService.onGetListCustomSubscription.subscribe(data => {
      this.marketingSubscriptionList = JSON.parse(JSON.stringify(data)).map(item => new MarketingSubscriptionType(item));;
      this.showPreloader = false;
      this.cd.detectChanges();
    })
    this.sub.add(onGetListCustomSubscription);
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
          if (event) event.target.blur();
          this.selectedForEditSubscription = null;
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
  }
  removeSubscription(item) {
    this.confirmStateService.setConfirmAction(DELETE_SUBSCRIPTION_TYPE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Remove Subscription`;
    this.marketingEmailStateService.setSubscriptionTypeForRemove(item);
  }
  close() {
    this.activeModal.close();

  }
  onAddedSubscription(data) {
    let subscription = new MarketingSubscriptionType(data);
    if (this.isAddNewSubscription) {
      this.showAdd = false;
      this.onSelectSubscription(subscription);
      this.save();
      this.isAddNewSubscription = false;
    }
  }
  save() {

    let subscriptions = [];
    this.selectedSubscriptions.forEach(subscription => {
      let users = this.users.filter(user => !user.customSubscriptions.find(customSubscription => customSubscription.id === subscription.id))
      if (users.length > 0) subscriptions.push({ id: subscription.id, users: users.map(user => user.id) })
    })
    if (this.showAdd) {
      this.isAddNewSubscription = true;
      this.addBtn.setDisabled(true);
      return;
    }
    let checkEdit = this.marketingSubscriptionList.find(item => item.isInitEdit);
    if (checkEdit) return;
    this.addBtn.setDisabled(true);
    if (subscriptions.length > 0) {
      forkJoin(subscriptions.map(item => this.marketingEmailService.addUsers(item.id, item.users).pipe(map((res) => res),
        catchError(error => of(undefined)))))
        .subscribe(
          () => {
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
  ngOnDestroy(): void {
    this.marketingEmailStateService.setListSubscriptionTypeForRemove([]);
    this.sub.unsubscribe();
  }
}
