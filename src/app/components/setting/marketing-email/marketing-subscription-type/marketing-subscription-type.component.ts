import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_SUBSCRIPTION_TYPE, DELETE_SUBSCRIPTION_TYPIES } from 'src/app/const/confirm';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { MarketingEmailRealTimeService } from 'src/app/states/marketing-email/marketing-email-real-time.service';
import { MarketingEmailStateService } from 'src/app/states/marketing-email/marketing-email-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { MarketingSubscriptionType } from './class/marketing-subscription-type';
import { MarketingSubscriptionTypeFilter } from './class/marketing-subscription-type-filter';

@Component({
  selector: 'marketing-subscription-type',
  templateUrl: './marketing-subscription-type.component.html',
  styleUrls: ['./marketing-subscription-type.component.scss']
})
export class MarketingSubscriptionTypeComponent implements OnInit, OnDestroy {
  marketingSubscriptionList: Array<MarketingSubscriptionType> = [];
  showAdd: boolean = false;
  filter: MarketingSubscriptionTypeFilter = new MarketingSubscriptionTypeFilter();
  showPreloader: boolean = true;
  sub: Subscription = new Subscription();
  colors = ["#16A4FA", "#2BC7C6", "#155EEF", "#D92D20", "#7839EE", "#D92D20", "#2EC866"];
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  constructor(private marketingEmailService: MarketingEmailService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private marketingEmailStateService: MarketingEmailStateService,
    public usersStateService: UsersStateService,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_SUBSCRIPTION_TYPE) {
          this.onRemoveSubscription(this.marketingEmailStateService.getSubscriptionTypeForRemove().id);
        }
        if (this.confirmStateService.getConfirmAction() === DELETE_SUBSCRIPTION_TYPIES) {
          this.onRemoveSubscriptions();
        }
      }
    })
    this.sub.add(getConfirm);
    this.marketingSubscriptionList = this.marketingEmailStateService.getListCustomSubscription();
    if (this.marketingSubscriptionList.length > 0) this.showPreloader = false;
    if (this.marketingEmailStateService.isGetMarketing) this.showPreloader = false;
    let onGetListCustomSubscription = this.marketingEmailStateService.onGetListCustomSubscription.subscribe(data => {
      this.marketingSubscriptionList = data;
      this.showPreloader = false;
      this.cd.detectChanges();
    })
    this.sub.add(onGetListCustomSubscription);
  }
  public toggleShowAdd(data) {
    this.showAdd = data;
  }
  onFilter(field) {
    this.filter.onFilter(field, this.marketingSubscriptionList);
  }
  getUser(id) {
    return this.usersStateService.getAllUsers().find(user => user.id === id);
  }
  getUserName(id) {
    return this.usersStateService.getAllUsers().find(user => user.id == id).firstName[0].toLocaleUpperCase();
  }
  getUserFirstLastName(id) {
    let user = this.usersStateService.getAllUsers().find(user => user.id == id);
    return `${user.firstName} ${user.lastName}`;

  }
  getCount(count, subCount) {
    if (subCount > 1) {
      return count - 2;
    } else if (subCount > 0) {
      return count - 1;
    }
    return count;
  }
  onEditSubscription(item, event) {
    if (item.isInitEdit) {
      if (item.length === 0 || item.disableUpdate || item.isInitRequest) return;
      item.setIsInitRequest(true);
      this.marketingEmailService.editSubscriptionType(item.id, item.name).pipe(map((res) => res),
        catchError(error => of(undefined)))
        .subscribe(data => {
          item.setIsInitRequest(false);
          item.onInitEdit(false);
          if (event) event.target.blur();
        }, err => {
          item.setIsInitRequest(false);
        })
    }
  }
  onSelectAll(event) {
    if (event.target.checked) {
      this.marketingSubscriptionList.forEach(item => {
        item.selected = true;
        this.marketingEmailStateService.getListSubscriptionTypeForRemove().push(item);
      })
    } else {
      this.marketingSubscriptionList.forEach(item => (item.selected = false));
      this.marketingEmailStateService.setListSubscriptionTypeForRemove([]);
    }
    this.cd.detectChanges();
  }
  onRemoveSubscriptions() {
    forkJoin(this.marketingEmailStateService.getListSubscriptionTypeForRemove().map(item => this.marketingEmailService.removeSubscriptionType(item.id).pipe(map((res) => res),
      catchError(error => of(undefined)))))
      .subscribe(
        () => {
          this.marketingEmailStateService.setListSubscriptionTypeForRemove([]);
          this.toastrService.success("The subscription has been successfully removed");
          this.appStateService.changeDetectorRef();
        },
        error => {
        }
      );
  }
  onRemoveSubscription(id) {
    this.marketingEmailService.removeSubscriptionType(id).subscribe(data => {
      this.marketingEmailStateService.setListSubscriptionTypeForRemove([]);
    })
  }
  openAside(item, subscribed) {
    item.setSubscribed(subscribed);
    this.marketingEmailStateService.onOpenAsigeSettings(item);
  }
  select(event, item) {
    this.onSelect.emit({ event: event, item: item });
  }
  removeSubscription(item) {
    this.confirmStateService.setConfirmAction(DELETE_SUBSCRIPTION_TYPE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Remove Subscription`;
    this.marketingEmailStateService.setSubscriptionTypeForRemove(item);
  }
  ngOnDestroy(): void {
    this.marketingSubscriptionList.forEach(item => (item.selected = false));
    this.marketingEmailStateService.setListSubscriptionTypeForRemove([]);
    this.sub.unsubscribe();
  }
}
